import chromium from '@sparticuz/chromium'
import puppeteer from 'puppeteer-core';

const CHROMIUM_PATH = 'https://storage.googleapis.com/chromium-seossistant/chromium-v126.0.0-pack.tar';

async function getBrowser() {
    // Configure Chromium with the URL
    // Get the executable path
    let launchOptions = {
        headless: true,
        executablePath: await chromium.executablePath(CHROMIUM_PATH),
        args: chromium.args,
    };
    return await puppeteer.launch(launchOptions)
}

export function GET() {
    return new Response(JSON.stringify({message: 'Hello from Next.js!'}), {status: 200});
}

export async function POST(req: Request) {
    try {
        const res = await req.json();
        const searchValue = res.searchValue;

        if (!searchValue || typeof searchValue !== 'string') {
            return new Response(JSON.stringify({error: 'Keyword is required'}), {status: 400});
        }

        const browser = await getBrowser();
        const page = await browser.newPage();

        const searchUrl = `https://www.google.com/search?q=${encodeURIComponent(searchValue)}`;
        await page.goto(searchUrl, {waitUntil: 'domcontentloaded'});

        const response = await page.evaluate(() => {
            const results = Array.from(document.querySelectorAll('#search .g'));
            return results.map(result => {
                const linkElement = result.querySelector('a');
                return linkElement?.href;
            }).slice(0, 5);
        });

        // Scrape the "People also ask" questions
        const peopleAlsoAskQuestions = await page.evaluate(() => {
            const questions = Array.from(document.querySelectorAll('div.related-question-pair span'));
            return questions.map(question => question.textContent).filter((item, pos, self) => {
                return self.indexOf(item) === pos;
            });
        });

        await browser.close();
        return new Response(JSON.stringify({response, peopleAlsoAskQuestions}), {status: 200});
    } catch (error) {
        console.error('Error during POST request:', error);
        return new Response(JSON.stringify({error: 'An error occurred while scraping Google search results'}), {status: 500});
    }
}
