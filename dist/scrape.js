"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const puppeteer_1 = __importDefault(require("puppeteer"));
const crypto_1 = __importDefault(require("crypto"));
const TARGET_URL = "https://www.aliexpress.us/item/3256806959829719.html";
const REQUESTS = 30;
const DELAY_MS = 1500; // be polite-ish
function hash(content) {
    return crypto_1.default.createHash("sha256").update(content).digest("hex");
}
async function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
async function runTest() {
    const browser = await puppeteer_1.default.launch({
        headless: true,
        args: ["--no-sandbox", "--disable-setuid-sandbox"]
    });
    const page = await browser.newPage();
    await page.setUserAgent("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120 Safari/537.36");
    let baselineHash = null;
    for (let i = 1; i <= REQUESTS; i++) {
        await page.goto(TARGET_URL, {
            waitUntil: "networkidle2",
            timeout: 60000
        });
        const html = await page.content();
        const currentHash = hash(html);
        if (baselineHash === null) {
            baselineHash = currentHash;
            console.log(`[${i}] baseline captured (${currentHash.slice(0, 8)})`);
        }
        else {
            const same = currentHash === baselineHash;
            console.log(`[${i}] ${same ? "SAME" : "DIFFERENT"} (${currentHash.slice(0, 8)})`);
        }
        await sleep(DELAY_MS);
    }
    await browser.close();
}
runTest().catch(console.error);
