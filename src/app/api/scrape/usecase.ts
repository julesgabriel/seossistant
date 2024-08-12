import {Mistral} from "@mistralai/mistralai";
import {ChatCompletionResponse} from "@mistralai/mistralai/models/components";
import puppeteer from "puppeteer";

export interface Scraping {
    scrapSiteMap(keywords: string[], websiteBaseUrl: string): Promise<string[]>;
}

export const scrapingService: Scraping = {
    async scrapSiteMap(keywords: string[], websiteBaseUrl: string): Promise<string[]> {
        const browser = await puppeteer.launch();
        const page = await browser.newPage();
        const url = `${websiteBaseUrl}/sitemap.xml`;
        await page.goto(url);

        return await page.evaluate<any>(() => {
            const sitemapElement = document.querySelector('pre');
            if (!sitemapElement) return []; // Return an empty array if the <pre> element is not found

            const sitemapContent = sitemapElement.textContent;
            if (!sitemapContent) return []; // Return an empty array if the content is null

            const parser = new DOMParser();
            const xmlDoc = parser.parseFromString(sitemapContent, 'text/xml');
            const urls = Array.from(xmlDoc.getElementsByTagName('loc')).map(loc => loc.textContent).filter(url => url !== null) as string[];

            return urls.filter(url => url.includes('blog/') || url.includes('article/') || url.includes('articles/') || url.includes('resources/') || url.includes('ressources/'));
        });
    }
}

export interface AIService {
    findUrlsBasedOnKeywordsProvided(keywords: string[], sitemap: string[]): Promise<ChatCompletionResponse>;
}

export const mistralService: AIService = {
    async findUrlsBasedOnKeywordsProvided(keywords: string[], sitemap: string[]): Promise<ChatCompletionResponse> {
        const apiKey = process.env.MISTRAL_API_KEY;
        const agentId = process.env.MISTAL_SITEMAP_AGENT_ID;
        const client = new Mistral({apiKey: apiKey});
        return await client.agents.complete({
            agentId,
            messages: [{role: 'user', content: JSON.stringify({keywords, sitemap})}]
        });
    }
};

export type Contracts = {
    scrapingService: Scraping,
    aiService: AIService
}

export async function usecase(keywords: string[], websiteBaseUrl: string, {
    scrapingService,
    aiService
}: Contracts): Promise<ChatCompletionResponse> {
    websiteBaseUrl = websiteBaseUrl
        .replace(/^https?:\/\//, '')  // Remove 'https://' or 'http://'
        .replace(/^www\./, '')         // Remove 'www.' if it exists
        .replace(/\/$/, '');           // Remove trailing slash if it exists

    const websiteURL = `https://www.${websiteBaseUrl}/sitemap.xml`;
    const sitemap = await scrapingService.scrapSiteMap(keywords, websiteURL);

    if (!sitemap.length) {
        return aiService.findUrlsBasedOnKeywordsProvided(keywords, []);
    }
    return await aiService.findUrlsBasedOnKeywordsProvided(keywords, sitemap);
}