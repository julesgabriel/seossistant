import {AIService, HnAndMetaStructure} from "@/app/backend/contracts/ai";
import {Scraping, SearchScrapingResult} from "@/app/backend/contracts/scraping";

export type Contracts = { aiService: AIService; scrapingService: Scraping }

export type UseCaseOutput = {
    aiAnswer: string,
    answersGoogleSearch: SearchScrapingResult,
    hnStructure: HnAndMetaStructure
}

export async function usecase(
    searchValue: string,
    keywords: string[],
    sitemapURL: string,
    {scrapingService, aiService}: Contracts
): Promise<UseCaseOutput> {
    const answersGoogleSearch = await scrapingService.googleSearchScraping(searchValue)
    const sitemapContent = await scrapingService.scrapSiteMap(sitemapURL);
    const aiAnswer = await aiService.findUrlsBasedOnKeywordsProvided(keywords, sitemapContent)
    const computedAiAnswer = JSON.parse(<string>aiAnswer)
    const hnStructure = await aiService.generateHnStructure(keywords)
    return {
        answersGoogleSearch,
        aiAnswer: computedAiAnswer,
        hnStructure
    }
}