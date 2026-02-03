/**
 * Compute a trustworthiness score [0, 1]
 *
 * @param {number} price - Listing price
 * @param {number} marketPrice - Estimated market price
 * @param {number} reviewScore - Average review score [0, 5]
 * @param {number} numberSold - Total units sold
 * @param {number} ageYears - Seller age in years
 * @returns {number} Trust score in [1, 10000]
 */
function trustScore(
  price,
  marketPrice,
  reviewScore,
  numberSold,
  ageYears,
  weights = {
    review: 0.35,
    price: 0.25,
    sold: 0.20,
    age: 0.20
  }
) {
  // linear mapping
  const r = Math.max(1, reviewScore); // assume reviewScore <= 5
  const reviewNorm = (r - 1) / 4; // [0,1] maps to 0, linear up to 5

  // quadratic
  const priceDist = Math.abs(price - marketPrice) / marketPrice; // normalized dist between prices
  const priceNorm = Math.max(0.1, 1 - Math.pow(priceDist / 0.5, 2));  

  // piecewise linear that penalizes < 100 sold higher
  const n = Math.max(0, Math.floor(numberSold));
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

  const trustNorm =
    weights.review * reviewNorm +
    weights.price  * priceNorm +
    weights.sold   * soldNorm +
    weights.age    * ageNorm;

  return trustNorm;
}