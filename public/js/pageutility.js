const puppeteer = require('puppeteer');

async function extractText(url) {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: 'networkidle2' });
    const text = await page.evaluate(() => document.body.innerText);
    const cleanedText = text.replace(/(\r?\n){3,}/g, '\n\n');

    await browser.close();
    return cleanedText;
}

async function fetchSEOInformation(url) {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: 'domcontentloaded' });

    const seoData = await page.evaluate(() => {
        const getTitle = () =>
            document.querySelector('title')
                ? document.querySelector('title').innerText
                : null;
        const getMetaDescription = () => {
            const element = document.querySelector('meta[name="description"]');
            return element ? element.getAttribute('content') : null;
        };
        // const getMetaRobots = () => {
        //     const element = document.querySelector('meta[name="robots"]');
        //     return element ? element.getAttribute('content') : null;
        // };
        const getFirstH1 = () => {
            const element = document.querySelector('h1');
            return element ? element.innerText : null;
        };

        return {
            title: getTitle(),
            metaDescription: getMetaDescription(),
            // metaRobots: getMetaRobots(),
            firstH1: getFirstH1(),
        };
    });

    await browser.close();
    return seoData;
}

module.exports = { extractText, fetchSEOInformation };
