const trustScore = require("../scripts/trustScore");

// Helper function to convert raw listing data to the format expected by the model
function toListingData(raw) {
  return {
    price_dist: (raw.marketPrice - raw.listingPrice) / raw.marketPrice,
    seller_age_years: raw.ageYears,
    rating: raw.productRating,
    num_sold: raw.numSold,
    num_rating: raw.numRating,
    num_images: raw.reviewImages,
  };
}

// TODO: These don't work since the model uses onnxruntime-web, which doesn't work in Node/Jest.
// describe('trust model tests', () => {
//   // "Good" listings
//   test("theoretical perfect listing", async () => {
//     const data = toListingData({
//       listingPrice: 100,
//       marketPrice: 100,
//       productRating: 5,
//       numSold: 1000,
//       ageYears: 5,
//       numRating: 1000,
//       reviewImages: 1000,
//     });
//     const score = await trustScore(data);
//     expect(score).toBeGreaterThanOrEqual(90);
//   });
  
//   test("excellent listing, Ajazz AK820 Mechanical Keyboard", async () => {
//     const data = toListingData({
//       listingPrice: 76.73,
//       marketPrice: 90,
//       productRating: 4.8,
//       numSold: 10000,
//       ageYears: 2.993,
//       numRating: 4661,
//       reviewImages: 1223,
//     });
//     const score = await trustScore(data);
//     expect(score).toBeGreaterThanOrEqual(90);
//   });

//   test("excellent listing, TACVASEN Summer Polo Tee Shirts", async () => {
//     const data = toListingData({
//       listingPrice: 37.23,
//       marketPrice: 30,
//       productRating: 4.9,
//       numSold: 600,
//       ageYears: 12,
//       numRating: 132,
//       reviewImages: 11,
//     });
//     const score = await trustScore(data);
//     expect(score).toBeGreaterThanOrEqual(85);
//   });

//   // "Bad" listings
//   test("clearly scam listing, New Original zotac 4090", async () => {
//     const data = toListingData({
//       listingPrice: 500,
//       marketPrice: 1600,
//       productRating: 1.6,
//       numSold: 34,
//       ageYears: 1.253,
//       numRating: 7,
//       reviewImages: 0,
//     });
//     const score = await trustScore(data);
//     expect(score).toBeLessThanOrEqual(30);
//   });

//   test("theoretical worst listing", async () => {
//     const data = toListingData({
//       listingPrice: 100,
//       marketPrice: 50,
//       productRating: 0,
//       numSold: 1,
//       ageYears: 0,
//       numRating: 1,
//       reviewImages: 0,
//     });
//     const score = await trustScore(data);
//     expect(score).toBeLessThanOrEqual(5);
//   });
// });