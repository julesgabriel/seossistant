import chromium from '@sparticuz/chromium'
import {Contracts, mistralService, scrapingService, usecase} from "./usecase";

const CHROMIUM_PATH = process.env.CHROMIUM_PATH

async function getBrowser() {
    // Configure Chromium with the URL
    // Get the executable path
    if (process.env.NODE_ENV === 'production') {
        const puppeteer = await import('puppeteer-core');
        let launchOptions = {
            headless: true,
            executablePath: await chromium.executablePath(CHROMIUM_PATH),
            args: chromium.args,
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
    websiteUrl: string
}

export type AiAnswer = {
    keyword: string,
    url: string
}

export type Response = {
    response: string[],
    peopleAlsoAskQuestions: string[],
    computedSiteMap: AiAnswer | null
}

export async function POST(req: Request): Promise<any> {
    try {
        const jsonReq: Command = await req.json();
        const searchValue = jsonReq.searchValue;
        const keywords = jsonReq.keywords;
        const websiteUrl = jsonReq.websiteUrl || 'iroko.eu';

        const browser = await getBrowser();
        const page = await browser.newPage();

        const searchUrl = `https://www.google.com/search?q=${encodeURIComponent(searchValue)}`;
        await page.goto(searchUrl, {waitUntil: 'domcontentloaded'});

        const response = await page.evaluate<any>(() => {
            const results = Array.from(document.querySelectorAll('#search .g'));
            return results.map(result => {
                const linkElement = result.querySelector('a');
                return linkElement ? linkElement.href : null;
            });
        });

        // Scrape the "People also ask" questions
        const peopleAlsoAskQuestions = await page.evaluate<any>(() => {
            const questions = Array.from(document.querySelectorAll('div.related-question-pair span'));
            return questions.map(question => question.textContent).filter((item, pos, self) => {
                return self.indexOf(item) === pos;
            });
        });

        await browser.close();

        const services: Contracts = {
            aiService: mistralService,
            scrapingService: scrapingService
        };
        const resultUsecase = await usecase(keywords, websiteUrl, services);
        let result: Response = {
            response,
            peopleAlsoAskQuestions,
            computedSiteMap: null
        }
        if (resultUsecase.choices) {
            console.log(resultUsecase.choices[0].message?.content)
            result.computedSiteMap = (JSON.parse(<string>resultUsecase.choices[0].message?.content)) as AiAnswer;
        }
        return new Response(JSON.stringify(result), { status: 200, headers: { 'Content-Type': 'application/json' } });
    } catch (error) {
        console.error('Error during POST request:', error);
        return new Response(JSON.stringify({error: 'An error occurred while scraping Google search results'}), {status: 500});
    }
}
