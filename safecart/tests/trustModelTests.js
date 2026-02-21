const trustScore = require('../dist/safecart/scripts/trustScore.js');

// Helper function to convert raw listing data to the format expected by the model
function toListingData(raw) {
  return {
    price_dist: (raw.listingPrice - raw.marketPrice) / raw.marketPrice,
    seller_age_years: raw.ageYears,
    rating: raw.productRating,
    num_sold: raw.numSold,
    num_rating: raw.numRating,
    num_images: raw.reviewImages,
  };
}

// Simple assertion helpers
function assertGreaterOrEqual(value, threshold, label) {
  if (value < threshold) {
    throw new Error(
      `❌ ${label} FAILED — expected >= ${threshold}, got ${value}`
    );
  }
  console.log(`✅ ${label} passed (${value})`);
}

function assertLessOrEqual(value, threshold, label) {
  if (value > threshold) {
    throw new Error(
      `❌ ${label} FAILED — expected <= ${threshold}, got ${value}`
    );
  }
  console.log(`✅ ${label} passed (${value})`);
}

async function runTests() {
  console.log("Running trust model manual tests...\n");
  let score;

  // good listings
  score = await trustScore(
    toListingData({
      listingPrice: 100,
      marketPrice: 100,
      productRating: 5,
      numSold: 1000,
      ageYears: 5,
      numRating: 1000,
      reviewImages: 1000,
    })
  );
  assertGreaterOrEqual(score, 90, "Theoretical perfect listing");

  score = await trustScore(
    toListingData({
      listingPrice: 76.73,
      marketPrice: 90,
      productRating: 4.8,
      numSold: 10000,
      ageYears: 2.993,
      numRating: 4661,
      reviewImages: 1223,
    })
  );
  assertGreaterOrEqual(score, 90, "Ajazz AK820 listing");

  score = await trustScore(
    toListingData({
      listingPrice: 37.23,
      marketPrice: 30,
      productRating: 4.9,
      numSold: 600,
      ageYears: 12,
      numRating: 132,
      reviewImages: 11,
    })
  );
  assertGreaterOrEqual(score, 85, "TACVASEN Polo Shirt listing");

  // bad listings
  score = await trustScore(
    toListingData({
      listingPrice: 500,
      marketPrice: 1600,
      productRating: 1.6,
      numSold: 34,
      ageYears: 1.253,
      numRating: 7,
      reviewImages: 0,
    })
  );
  assertLessOrEqual(score, 30, "Scam RTX 4090 listing");

  score = await trustScore(
    toListingData({
      listingPrice: 1,
      marketPrice: 100,
      productRating: 0.1,
      numSold: 1,
      ageYears: 0.1,
      numRating: 1,
      reviewImages: 0,
    })
  );
  assertLessOrEqual(score, 5, "Theoretical worst listing");

  console.log("\n All manual tests passed.");
}

// Run and force process exit on failure
runTests().catch((err) => {
  console.error(err.message);
  process.exit(1);
});