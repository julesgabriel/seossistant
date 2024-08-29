import chromium from '@sparticuz/chromium'
import {Contracts, usecase} from "./usecase";
import {scrapingService} from "@/app/backend/contracts/scraping";
import {openAIService} from "@/app/backend/contracts/ai";

async function getBrowser() {
    // Configure Chromium with the URL
    // Get the executable path
    if (process.env.NODE_ENV === 'production') {
        const puppeteer = await import('puppeteer-core');

        let launchOptions = {
            headless: true,
            executablePath: await chromium.executablePath(process.env.CHROMIUM_PATH),
            args: [...chromium.args, '--no-sandbox', '--disable-setuid-sandbox'],
            dumpio: true
        };
        return await puppeteer.launch(launchOptions)
    } else {
        const puppeteer = await import('puppeteer');
        return await puppeteer.launch({headless: true});
    }
}

export function GET() {
    return new Response(JSON.stringify({message: 'Hello from Next.js!'}), {status: 200});
}

export type Command = {
    searchValue: string,
    keywords: string[],
    sitemapUrl: string
}

export type AiAnswer = {
    keyword: string,
    url: string
}

export type Response = {
    answersGoogleSearch: string[],
    peopleAlsoAskQuestions: string[],
    computedSiteMap: AiAnswer | null
}

export const maxDuration = 300

export async function POST(req: Request): Promise<any> {
    const jsonReq: Command = await req.json();
    const searchValue = jsonReq.searchValue;
    const keywords = jsonReq.keywords;
    let sitemapUrl = jsonReq.sitemapUrl;
    const browser = await getBrowser();
    const services: Contracts = {
        aiService: openAIService(process.env.OPENAI_API_KEY),
        scrapingService: scrapingService(browser)
    };


    const usecaseResult = await usecase(searchValue, keywords, sitemapUrl, services)
    await browser.close()
    return new Response(JSON.stringify(usecaseResult), {
        status: 200,
        headers: {'Content-Type': 'application/json'}
    });

}

