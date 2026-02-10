/**
 * Compute a trustworthiness score [0, 1], simplified down version. This function assumes good 
 * values and does not handle edge cases.
 *
 * @param {number} productRating - Average review score in [0, 5]
 * @param {number} numSold - Total units sold (> 0)
 * @param {number} ageYears - Age of seller in years (> 0), -1 if cannot determine
 * @param {number} numRating - Total ratings (> 0)
 * @param {number} reviewImages - Total number of images (>= 0)
 * @returns {number} Trust score in [0, 1]
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
  if (ageYears < 0) { // cannot determine age
    ageNorm = -1;
  } else if (ageYears < 1) {
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
  
  let soldWeight;
  let ageWeight;
  if (ageNorm < 0) { // cannot determine age
    soldWeight = 1 - reviewWeight;
    ageWeight = 0;
  } else {
    soldWeight = (1 - reviewWeight) / 2; // this equally weights age/sold
    ageWeight = (1 - reviewWeight) / 2;
  }

  const trustNorm =
    reviewWeight * reviewNorm +
    soldWeight   * soldNorm +
    ageWeight    * ageNorm;

  return trustNorm;
}

module.exports = simpleTrustScore;