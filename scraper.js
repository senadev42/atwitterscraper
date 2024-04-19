const puppeteer = require("puppeteer");

async function run() {
  const browser = await puppeteer.launch({ headless: "new" });
  const page = await browser.newPage();

  await page.goto("https://twitter.com/coindesk");

  const data = await page.evaluate(() => {
    const url = window.location.href;

    return { url };
  });

  await browser.close();
  return data;
}

(async () => {
  try {
    const scrapedData = await run();
    console.log("Scraped Data:", scrapedData);

  } catch (error) {
    console.error("Error during scraping:", error);
  }
})();