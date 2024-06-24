import {launch} from "puppeteer";

export function GET() {
    return Response.json({message: 'Hello from Next.js!'})
}

export async function POST(req: Request) {
    const res = await req.json()
    const searchValue = res.searchValue

    if (!searchValue || typeof searchValue !== 'string') {
        return Response.json({error: 'Keyword is required'});
    }

    const browser = await launch({headless: true});
    const page = await browser.newPage();

    const searchUrl = `https://www.google.com/search?q=${encodeURIComponent(searchValue)}`;
    await page.goto(searchUrl, {waitUntil: 'domcontentloaded'});

    const response = await page.evaluate(() => {
        const results = Array.from(document.querySelectorAll('#search .g'))
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
        })
    });

    await browser.close();
    return Response.json({response, peopleAlsoAskQuestions});
}