/**
 * Compute a trustworthiness score [0, 1]
 *
 * @param {number} listingPrice - Listing price
 * @param {number} marketPrice - Estimated market price
 * @param {number} productRating - Average review score [0, 5]
 * @param {number} numSold - Total units sold
 * @param {number} ageYears - Seller age in years
 * @param {number} numRating - Total ratings
 * @param {number} reviewImages - Total number of images
 * @returns {number} Trust score in [1, 10000]
 */
function trustScore(
  listingPrice,
  marketPrice,
  productRating,
  numSold,
  ageYears,
  numRating,
  reviewImages
) {
  // linear mapping
  const r = Math.max(1, productRating); // assume productRating <= 5
  const reviewNorm = (r - 1) / 4; // [0,1] maps to 0, linear up to 5

  // quadratic
  const priceDist = Math.abs(listingPrice - marketPrice) / marketPrice; // normalized dist
  const priceNorm = Math.max(0.1, 1 - Math.pow(priceDist / 0.5, 2));  

  // piecewise linear that penalizes < 100 sold higher
  const n = Math.max(0, Math.floor(numSold));
  let soldNorm;
  if (n < 100) {
    soldNorm = n / 200;
  } else if (n >= 1000) {
    soldNorm = 1;
  } else {
    soldNorm = 0.5 + 0.5 * (n - 100) / 900;
  }

  let ageNorm;
  if (ageYears < 1) {
    ageNorm = 0.1 + 0.5 * ageYears;
  } else if (ageYears < 5) {
    ageNorm = 0.6 + 0.4 * ((ageYears - 1) / 4);
  } else {
    ageNorm = 1.0;
  }

  const priceWeight = 0.25;
  
  const MAX_REVIEW_WEIGHT = 0.5;
  const MIN_REVIEW_WEIGHT = 0.3;
  const REVIEW_RATIO_TARGET = 0.4;
  const IMAGE_RATIO_TARGET = 0.2;

  const reviewRatio = numRating / numSold;
  const imageRatio = reviewImages / numRating;

  // reviewWeight ranges from MIN_REVIEW_WEIGHT - MAX_REVIEW_WEIGHT. 
  // A listing with >=REVIEW_RATIO_TARGET reviewRatio and >=IMAGE_RATIO_TARGET imageRatio will
  // be weighted MAX_REVIEW_WEIGHT, scaled linearly.
  
  // Normalize the ratios to [0, 1]
  const reviewRatioNorm = Math.min(reviewRatio / REVIEW_RATIO_TARGET, 1);
  const imageRatioNorm = Math.min(imageRatio / IMAGE_RATIO_TARGET, 1);

  // This equally values the two ratios. Can be weighted if needed.
  const combinedRatioNorm = (reviewRatioNorm + imageRatioNorm) / 2;

  const reviewWeight = MIN_REVIEW_WEIGHT +
                         (MAX_REVIEW_WEIGHT - MIN_REVIEW_WEIGHT) * combinedRatioNorm;

  const remainingWeight = 1 - (priceWeight + reviewWeight);
  const soldWeight = remainingWeight / 2;
  const ageWeight = remainingWeight / 2;

  const trustNorm =
    reviewWeight * reviewNorm +
    priceWeight  * priceNorm +
    soldWeight   * soldNorm +
    ageWeight    * ageNorm;

  return trustNorm;
}

/**
 * Compute a trustworthiness score [0, 1], simplified down version
 *
 * @param {number} productRating - Average review score [0, 5]
 * @param {number} numSold - Total units sold
 * @param {number} numRating - Total ratings
 * @param {number} ageYears - Age of seller in years
 * @param {number} reviewImages - Total number of images
 * @returns {number} Trust score in [1, 10000]
 */
function simpleTrustScore(
  productRating,
  numSold,
  ageYears,
  numRating,
  reviewImages
) {
  // linear mapping
  const r = Math.max(1, productRating); // assume productRating <= 5
  const reviewNorm = (r - 1) / 4; // [0,1] maps to 0, linear up to 5

  // piecewise linear that penalizes < 100 sold higher
  const n = Math.max(0, Math.floor(numSold));
  let soldNorm;
  if (n < 100) {
    soldNorm = n / 200;
  } else if (n >= 1000) {
    soldNorm = 1;
  } else {
    soldNorm = 0.5 + 0.5 * (n - 100) / 900;
  }

  let ageNorm;
  if (ageYears < 1) {
    ageNorm = 0.1 + 0.5 * ageYears;
  } else if (ageYears < 5) {
    ageNorm = 0.6 + 0.4 * ((ageYears - 1) / 4);
  } else {
    ageNorm = 1.0;
  }

  const MAX_REVIEW_WEIGHT = 0.8;
  const MIN_REVIEW_WEIGHT = 0.6;
  const REVIEW_RATIO_TARGET = 0.4;
  const IMAGE_RATIO_TARGET = 0.2;

  const reviewRatio = numRating / numSold;
  const imageRatio = reviewImages / numRating;

  // reviewWeight ranges from MIN_REVIEW_WEIGHT - MAX_REVIEW_WEIGHT. 
  // A listing with >=REVIEW_RATIO_TARGET reviewRatio and >=IMAGE_RATIO_TARGET imageRatio will
  // be weighted MAX_REVIEW_WEIGHT, scaled linearly.
  
  // Normalize the ratios to [0, 1]
  const reviewRatioNorm = Math.min(reviewRatio / REVIEW_RATIO_TARGET, 1);
  const imageRatioNorm = Math.min(imageRatio / IMAGE_RATIO_TARGET, 1);

  // This equally values the two ratios. Can be weighted if needed.
  const combinedRatioNorm = (reviewRatioNorm + imageRatioNorm) / 2;

  const reviewWeight = MIN_REVIEW_WEIGHT +
                         (MAX_REVIEW_WEIGHT - MIN_REVIEW_WEIGHT) * combinedRatioNorm;
  const soldWeight = (1 - reviewWeight) / 2;
  const ageWeight = (1 - reviewWeight) / 2;

  const trustNorm =
    reviewWeight * reviewNorm +
    soldWeight   * soldNorm +
    ageWeight    * ageNorm;

  return trustNorm;
}