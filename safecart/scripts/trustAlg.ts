/**
 * Compute a trustworthiness score [0, 1]. This function assumes good values and does not handle
 * edge cases.
 *
 * @param {number} listingPrice - Listing price (> 0)
 * @param {number} marketPrice - Estimated market price (> 0)
 * @param {number} productRating - Average review score [0, 5]
 * @param {number} numSold - Total units sold (> 0)
 * @param {number} ageYears - Seller age in years (>= 0)
 * @param {number} numRating - Total ratings (> 0)
 * @param {number} reviewImages - Total number of images (>= 0)
 * @returns {{
 *   score: number;
 *   metrics: {
 *     name: string;
 *     score: number;
 *   }[]
 * }}
 */
export function trustScore(
  listingPrice: number,
  marketPrice: number,
  productRating: number,
  numSold: number,
  numRating: number,
  reviewImages: number
): {
  score: number;
  metrics: {
    name: string;
    score: number;
  }[];
} {

  // linear mapping
  const r = Math.max(1, productRating); // assume productRating <= 5
  const reviewNorm = (r - 1) / 4;

  // quadratic price similarity
  const priceDist = Math.abs(listingPrice - marketPrice) / marketPrice;
  const priceNorm = Math.max(0.1, 1 - Math.pow(priceDist / 0.5, 2));

  // piecewise linear sales score
  const n = Math.max(1, Math.floor(numSold));
  let soldNorm;
  if (n < 100) {
    soldNorm = n / 200;
  } else if (n >= 1000) {
    soldNorm = 1;
  } else {
    soldNorm = 0.5 + 0.5 * (n - 100) / 900;
  }

  const priceWeight = 0.25;

  const MAX_REVIEW_WEIGHT = 0.5;
  const MIN_REVIEW_WEIGHT = 0.3;
  const REVIEW_RATIO_TARGET = 0.4;
  const IMAGE_RATIO_TARGET = 0.2;

  const reviewRatio = numRating / n;
  let imageRatio = 0;
  if (numRating > 0) {
    imageRatio = reviewImages / numRating;
  }

  const reviewRatioNorm = Math.min(reviewRatio / REVIEW_RATIO_TARGET, 1);
  const imageRatioNorm = Math.min(imageRatio / IMAGE_RATIO_TARGET, 1);

  const combinedRatioNorm = (reviewRatioNorm + imageRatioNorm) / 2;

  const reviewWeight =
    MIN_REVIEW_WEIGHT +
    (MAX_REVIEW_WEIGHT - MIN_REVIEW_WEIGHT) * combinedRatioNorm;

  // remaining weight goes entirely to sales volume
  const soldWeight = 1 - (priceWeight + reviewWeight);

  const trustNorm: number =
    reviewWeight * reviewNorm +
    priceWeight * priceNorm +
    soldWeight * soldNorm;

  return {
    score: normToPercent(trustNorm),
    metrics: [
      { name: "Product Rating", score: normToPercent(reviewNorm) },
      { name: "Price Ratio", score: normToPercent(priceNorm) },
      { name: "Sales Volume", score: normToPercent(soldNorm) }
    ]
  };
}

// Takes a norm [0, 1] -> [0, 100]
function normToPercent(norm: number): number {
  return Math.round(norm * 100);
}