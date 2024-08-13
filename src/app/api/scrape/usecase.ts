import {Mistral} from "@mistralai/mistralai";
import {ChatCompletionResponse} from "@mistralai/mistralai/models/components";

export interface Scraping {
    scrapSiteMap(websiteBaseUrl: string): Promise<string[]>;
}

// @ts-ignore
export const scrapingService = (browser): Scraping => ({
    async scrapSiteMap(websiteBaseUrl: string): Promise<string[]> {
        const page = await browser.newPage();

        try {
            // Disable unnecessary resources for faster page load
            await page.setRequestInterception(true);
            // @ts-ignore
            page.on('request', (req) => {
                const resourceType = req.resourceType();
                if (['image', 'stylesheet', 'font', 'script'].includes(resourceType)) {
                    req.abort();
                } else {
                    req.continue();
                }
            });

            await page.setViewport({ width: 1280, height: 800 });
            await page.goto(websiteBaseUrl, { timeout: 30000 }); // Set timeout
            console.log('I WENT HERE', websiteBaseUrl)
            console.log('Memory usage after page load:', process.memoryUsage());

            return await page.evaluate(() => {
                const sitemapElement = document.querySelector('pre');
                if (!sitemapElement) {
                    const sitemapElements = document.querySelectorAll('loc');
                    return Array.from(sitemapElements).map(element => element.textContent?.trim()).filter(text => text);
                }

                const sitemapContent = sitemapElement.textContent;
                if (!sitemapContent) return [];

                const parser = new DOMParser();
                const xmlDoc = parser.parseFromString(sitemapContent, 'application/xml');
                const locElements = xmlDoc.getElementsByTagName('loc');
                return Array.from(locElements).map(locElement => locElement.textContent?.trim()).filter(text => text);
            });
        } catch (error) {
            console.error('Error scraping the sitemap:', error);
            console.log('Memory usage on error:', process.memoryUsage());
            throw error;
        } finally {
            try {
                if (!page.isClosed()) {
                    await page.close();
                }
            } catch (error) {
                console.error('Error closing page:', error);
            }
        }
    },
});

export interface AIService {
    findUrlsBasedOnKeywordsProvided(keywords: string[], sitemap: string[]): Promise<ChatCompletionResponse>;
}

export const mistralService: AIService = {
    async findUrlsBasedOnKeywordsProvided(keywords: string[], sitemap: string[]): Promise<ChatCompletionResponse> {
        const apiKey = process.env.MISTRAL_API_KEY;
        const agentId = process.env.MISTAL_SITEMAP_AGENT_ID;

        if (!apiKey || !agentId) throw new Error('Mistral API Key or Agent ID is missing');

        const client = new Mistral({apiKey});
        // Assuming you would implement the API call here, replaced with a mock response for now
        return await client.agents.complete({
            agentId,
            messages: [{role: 'user', content: JSON.stringify({keywords, sitemap})}]
        });

    },
};

export type Contracts = { aiService: AIService; scrapingService: Scraping }

export async function usecase(
    keywords: string[],
    websiteBaseUrl: string,
    {scrapingService, aiService}: Contracts
): Promise<ChatCompletionResponse> {
    websiteBaseUrl = websiteBaseUrl
        .replace(/^https?:\/\//, '')  // Remove 'https://' or 'http://'
        .replace(/^www\./, '')        // Remove 'www.' if it exists
        .replace(/\/$/, '');          // Remove trailing slash if it exists

    const websiteURL = `https://www.${websiteBaseUrl}/sitemap.xml`;

    const sitemap = await scrapingService.scrapSiteMap(websiteURL);

    // Handling sub-sitemaps
    let allUrls: string[] = [];
    if (sitemap.length > 0) {
        if (sitemap.some(url => url.includes('sitemap'))) {
            const subSitemapPromises = sitemap
                .filter(url => url.includes('sitemap'))
                .map(async url => scrapingService.scrapSiteMap(url));

            const subSitemaps = await Promise.all(subSitemapPromises);
            allUrls = subSitemaps.flat(); // Flatten the array of arrays
        } else {
            allUrls = sitemap;
        }

        allUrls = allUrls.filter(url => url.includes('blog/') || url.includes('article/') || url.includes('articles/') || url.includes('resources/') || url.includes('ressources/'));

        // Depending on your logic, use AI service or return the URLs
        return aiService.findUrlsBasedOnKeywordsProvided(keywords, allUrls);
    }

    // Return a default response in case the sitemap is empty or does not meet conditions
    return Promise.reject(new Error("No relevant URLs found or sitemap is empty"));
}