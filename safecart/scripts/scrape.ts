import puppeteer from "puppeteer-extra";
import StealthPlugin from "puppeteer-extra-plugin-stealth";

puppeteer.use(StealthPlugin()); 
import fs from "fs";

/**
 * Dumps the full rendered HTML of a page given its URL using Puppeteer.
 *
 * @param {string} url - The URL of the page to scrape.
 * @returns {Promise<string>} - The full rendered HTML of the page.
 */
async function dumpFullResponse(url: string) {
  const browser = await puppeteer.launch({
    headless: true,
    args: [
    '--no-sandbox',
    '--disable-setuid-sandbox',
    '--disable-dev-shm-usage',
    '--disable-accelerated-2d-canvas',
    '--disable-gpu'
  ]
  });

  const page = await browser.newPage();

  // realistic browser signals
  await page.setUserAgent(
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 " +
    "(KHTML, like Gecko) Chrome/120 Safari/537.36"
  );

  await page.setViewport({
    width: 1366,
    height: 768
  });

  await page.setExtraHTTPHeaders({
    "accept-language": "en-US,en;q=0.9"
  });

  // FAST navigation
  await page.goto(url, {
    waitUntil: "domcontentloaded", // faster than networkidle
    timeout: 60000
  });

  // capture page immediately
  const html = await page.content();

  fs.writeFileSync("response.html", html, "utf8");

  await browser.close();
  return html;
}

/*
(async () => {
  console.log(await dumpFullResponse("https://www.example.com"));
})();
*/

/*
(async () => {
  await dumpFullResponse(
    "https://www.aliexpress.us/w/wholesale-DDR5-ram.html"
  );
})();
*/

module.exports = dumpFullResponse;