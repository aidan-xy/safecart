const trustScore = require('../dist/safecart/scripts/trustScore.ts');

// Helper function to convert raw listing data to the format expected by the model
function toListingData(raw) {
  return {
    price_dist: Math.abs(raw.listingPrice - raw.marketPrice) / raw.marketPrice,
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
      `FAIL: ${label} FAILED — expected >= ${threshold}, got ${value}`
    );
  }
  console.log(`PASS: ${label} passed (${value})`);
}

function assertLessOrEqual(value, threshold, label) {
  if (value > threshold) {
    throw new Error(
      `FAIL: ${label} FAILED — expected <= ${threshold}, got ${value}`
    );
  }
  console.log(`PASS: ${label} passed (${value})`);
}

async function runTests() {
  console.log("Running trust model manual tests...\n");
  let trustScores;

  // good listings
  trustScores =await trustScore(
    toListingData({
      listingPrice: 100,
      marketPrice: 100,
      productRating: 5,
      numSold: 10000,
      ageYears: 10,
      numRating: 10000,
      reviewImages: 1000,
    })
  );
  assertGreaterOrEqual(trustScores.score, 90, "Theoretical perfect listing");
  console.log("Trust score breakdown:", trustScores.metrics);

  trustScores = await trustScore(
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
  assertGreaterOrEqual(trustScores.score, 90, "Ajazz AK820 listing");
  console.log("Trust score breakdown:", trustScores.metrics);

  trustScores = await trustScore(
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
  assertGreaterOrEqual(trustScores.score, 90, "TACVASEN Polo Shirt listing");
  console.log("Trust score breakdown:", trustScores.metrics);

  // bad listings
  trustScores = await trustScore(
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
  assertLessOrEqual(trustScores.score, 30, "Scam RTX 4090 listing");
  console.log("Trust score breakdown:", trustScores.metrics);

  trustScores = await trustScore(
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
  assertLessOrEqual(trustScores.score, 5, "Theoretical worst listing");
  console.log("Trust score breakdown:", trustScores.metrics);

  trustScores = await trustScore(
    toListingData({
      listingPrice: 100,
      marketPrice: 1,
      productRating: 0.1,
      numSold: 1,
      ageYears: 0.1,
      numRating: 1,
      reviewImages: 0,
    })
  );
  assertLessOrEqual(trustScores.score, 5, "Theoretical worst listing, reversed price dist");
  console.log("Trust score breakdown:", trustScores.metrics);

  // validate input
  trustScores = await trustScore(
    toListingData({
      listingPrice: -1,
      marketPrice: -1,
      productRating: -1,
      numSold: -1,
      ageYears: -1,
      numRating: -1,
      reviewImages: -1,
    })
  );
  if (Number.isNaN(trustScores.score)) {
    throw new Error(
      `FAIL: fallback values were not loaded from bad input (` + trustScores.score + ')'
    );
  } else {
    console.log('PASS: fallback values were loaded from bad input (' + trustScores.score + ')')
  }

  trustScores = await trustScore(
    toListingData({
      listingPrice: null,
      marketPrice: null,
      productRating: null,
      numSold: null,
      ageYears: null,
      numRating: null,
      reviewImages: null,
    })
  );
  if (Number.isNaN(trustScores.score)) {
    throw new Error(
      `FAIL: fallback values were not loaded from null input (` + trustScores.score + ')'
    );
  } else {
    console.log('PASS: fallback values were loaded from null input (' + trustScores.score + ')')
  }

  console.log("\n All manual tests passed.");
}

// Run and force process exit on failure
runTests().catch((err) => {
  console.error(err.message);
  process.exit(1);
});