import puppeteer from "puppeteer";
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
    args: ["--no-sandbox", "--disable-setuid-sandbox"]
  });

  const page = await browser.newPage();

  await page.setUserAgent(
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120 Safari/537.36"
  );

  await page.goto(url, {
    waitUntil: "networkidle2",
    timeout: 60_000
  });

  // Get the FULL rendered HTML
  const html = await page.content();
  fs.writeFileSync("response.html", html, "utf-8");

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
    "https://www.aliexpress.us/item/3256806959829719.html"
  );
})();
*/

module.exports = dumpFullResponse;