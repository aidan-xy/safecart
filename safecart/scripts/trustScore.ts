import { TrustModel, ListingData } from "./TrustModel";

/**
 * This function is the main entry point for computing a trust score for a listing using the
 * logistic regression model. It creates an instance of TrustModel, loads the ONNX file, 
 * and then computes the trust score for the given listing data. 
 * 
 * @param {ListingData} input - The listing data to compute the trust score for
 * @returns {Promise<number>} - The computed trust score on a scale of [1, 100] rounded
 */
export async function trustScore(input: ListingData): Promise<number> {
  const validatedInput = { ...input };
  validateInput(validatedInput);

  // Create the and load model
  const model = new TrustModel("trust_model.onnx"); // path to ONNX file
  await model.load();

  const score = await model.score(validatedInput);
  return Math.max(1, Math.round(score * 100.0)); // convert to [1, 100] rounded scale
}

const PRICE_DIST_FALLBACK = 0.25;
const SELLER_AGE_YEARS_FALLBACK = 4.8;
const RATING_FALLBACK = 3.47;
const NUM_SOLD_FALLBACK = 3212;
const NUM_RATING_FALLBACK = 600;
const NUM_IMAGES_FALLBACK = 93;

// Validates each feature of input for trust model, replaces with fallback value (avg. val of the
// data it was trained on) if invalid.
function validateInput(input: ListingData): void {
  if (typeof input.price_dist !== "number" || Number.isNaN(input.price_dist) || input.price_dist < 0) {
    console.log("trustScore: Invalid price_dist, using fallback value. Trust score will be inaccurate!");
    input.price_dist = PRICE_DIST_FALLBACK;
  }
  if (typeof input.seller_age_years !== "number" || Number.isNaN(input.seller_age_years) || input.seller_age_years < 0) {
    console.log("trustScore: Invalid seller_age_years, using fallback value. Trust score will be inaccurate!");
    input.seller_age_years = SELLER_AGE_YEARS_FALLBACK;
  }
  if (typeof input.rating !== "number" || Number.isNaN(input.rating) || input.rating < 0 || input.rating > 5) {
    console.log("trustScore: Invalid rating, using fallback value. Trust score will be inaccurate!");
    input.rating = RATING_FALLBACK;
  }
  if (typeof input.num_sold !== "number" || Number.isNaN(input.num_sold) || input.num_sold < 0) {
    console.log("trustScore: Invalid num_sold, using fallback value. Trust score will be inaccurate!");
    input.num_sold = NUM_SOLD_FALLBACK;
  }
  if (typeof input.num_rating !== "number" || Number.isNaN(input.num_rating) || input.num_rating < 0) {
    console.log("trustScore: Invalid num_rating, using fallback value. Trust score will be inaccurate!");
    input.num_rating = NUM_RATING_FALLBACK;
  }
  if (typeof input.num_images !== "number" || Number.isNaN(input.num_images) || input.num_images < 0) {
    console.log("trustScore: Invalid num_images, using fallback value. Trust score will be inaccurate!");
    input.num_images = NUM_IMAGES_FALLBACK;
  }
}

module.exports = trustScore;