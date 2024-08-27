import chromium from "@sparticuz/chromium";
import {scrapingService} from "@/app/backend/contracts/scraping";


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

export type SiteMapsOutput = {
    multipleSitemaps: boolean,
    sitemap: string[]
}

export async function POST(req: Request): Promise<any> {
    const jsonReq: {
        websiteUrl: string
    } = await req.json();
    let websiteUrl = jsonReq.websiteUrl;
    websiteUrl = websiteUrl
        .replace(/^https?:\/\//, '')  // Remove 'https://' or 'http://'
        .replace(/^www\./, '')        // Remove 'www.' if it exists
        .replace(/\/$/, '');          // Remove trailing slash if it exists

    const websiteURL = `https://www.${websiteUrl}/sitemap.xml`;
    const browser = await getBrowser();
    const sitemap = await scrapingService(browser).scrapSiteMap(websiteURL)
    const isThereMultipleSitemaps = sitemap.filter(sitemap => sitemap.includes('.xml')).length > 1
    let response: SiteMapsOutput = {
        multipleSitemaps: isThereMultipleSitemaps,
        sitemap: isThereMultipleSitemaps ? sitemap : [websiteURL]
    }
    await browser.close()
    return new Response(JSON.stringify(response), {status: 200, headers: {'Content-Type': 'application/json'}});
}