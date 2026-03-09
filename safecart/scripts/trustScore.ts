import { TrustModel, ListingData, TrustScoreResult } from "./TrustModel";

// Singleton instance of the trust model (cached to avoid reloading)
let modelInstance: TrustModel | null = null;
let modelInitPromise: Promise<TrustModel> | null = null;

/**
 * Get or initialize the singleton trust model instance.
 * Handles concurrent requests safely with a promise lock.
 * @returns {Promise<TrustModel>} - The loaded model instance
 */
async function getTrustModel(): Promise<TrustModel> {
  if (modelInstance) {
    return modelInstance;
  }

  // If initialization is already in progress, wait for it
  if (modelInitPromise) {
    return modelInitPromise;
  }

  // Start initialization
  modelInitPromise = (async () => {
    const model = new TrustModel("trust_model.onnx");
    await model.load();
    modelInstance = model;
    return model;
  })();

  return modelInitPromise;
}

/**
 * Setup cleanup listener for browser unload events.
 * Disposes model's ONNX session when page closes.
 */
function setupCleanup(): void {
  if (typeof window !== "undefined") {
    window.addEventListener("beforeunload", async () => {
      if (modelInstance) {
        await modelInstance.dispose();
        modelInstance = null;
        modelInitPromise = null;
      }
    });
  }
}

// Initialize cleanup on module load
setupCleanup();

/**
 * This function is the main entry point for computing a trust score for a listing using the
 * logistic regression model. It reuses a cached model instance, loading it only once.
 * 
 * @param {ListingData} input - The ListingData to compute the trust score for. Inputted data is 
 *                              validated and replaced with fallback values if invalid.                              
 * @returns {Promise<TrustScoreResult>} - Overall score and per-metric breakdown in [1, 100] which
 *                                        can be directly fed into the UI. The structure is:
 *   {
 *     score: number,
 *     metrics: [
 *       { name: string, score: number },
 *       ...
 *     ]
 *   }
 */
export async function trustScore(input: ListingData): Promise<TrustScoreResult> {
  const validatedInput = { ...input };
  validateInput(validatedInput);

  const model = await getTrustModel();
  return model.scoreWithBreakdown(validatedInput);
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