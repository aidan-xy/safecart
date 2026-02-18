/**
 * @jest-environment node
 */

const dumpFullResponse = require("../scripts/scrape");

describe('scrape whole page tests', () => {
  // testing on example.com, a fixed page that is expected not to change
  test('retrieve example page', async () => {
    await dumpFullResponse("https://www.example.com");
  }, 
    20000);

  // testing on a listing page
  test('retrieve a listing', async () => {
    await dumpFullResponse("https://www.aliexpress.us/item/3256806959829719.html");
  },
    20000);
});