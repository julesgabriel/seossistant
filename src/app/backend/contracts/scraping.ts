
export type SearchScrapingResult = {
    answers: string[],
    questions: string[]
}

export interface Scraping {
    scrapSiteMap(websiteBaseUrl: string): Promise<string[]>;
    googleSearchScraping(searchValue: string): Promise<SearchScrapingResult>;
}

export const scrapingService = (browser: any): Scraping => ({
    async scrapSiteMap(websiteBaseUrl: string): Promise<(string)[] | any[]> {
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

            await page.setViewport({width: 1280, height: 800});
            await page.goto(websiteBaseUrl, {timeout: 30000});

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
    async googleSearchScraping(searchValue: string): Promise<SearchScrapingResult> {
        const page = await browser.newPage()
        const searchUrl = `https://www.google.com/search?q=${encodeURIComponent(searchValue)}`;
        await page.goto(searchUrl, {waitUntil: 'domcontentloaded'});

        return await page.evaluate(() => {
            const answers: string[] = Array.from(document.querySelectorAll('#search .g'))
                .map(result => {
                    const linkElement = result.querySelector('a');
                    return linkElement!.href;
                });

            const questions: string[] = Array.from(document.querySelectorAll('div.related-question-pair span'))
                .map(question => question.textContent).filter((item, pos, self) => {
                    return self.indexOf(item) === pos;
                })
                .filter(el => el !== null);
            return {
                answers,
                questions,
            }
        });


    }
});
