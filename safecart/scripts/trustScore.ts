import { TrustModel, ListingData } from "./TrustModel";

/**
 * This function is the main entry point for computing a trust score for a listing using the
 * logistic regression model. It creates an instance of TrustModel, loads the ONNX file, 
 * and then computes the trust score for the given listing data. 
 * 
 * @param {ListingData} input - The listing data to compute the trust score for
 * @returns {Promise<number>} - The computed trust score on a scale of [1, 100] rounded
 */
export async function trustScore(input : ListingData): Promise<number> {
  // Create the and load model
  const model = new TrustModel("trust_model.onnx"); // path to ONNX file
  await model.load();

  const score = await model.score(input);
  return Math.max(1, Math.round(score * 100.0)); // convert to [1, 100] rounded scale
}

// const goodListing: ListingData = {
//     price_dist: 0.04,
//     seller_age_years: 9.03,
//     rating: 4.9,
//     num_sold: 5000,
//     num_rating: 722,
//     num_images: 61,
// };
// trustScore(goodListing)
//   .then((score) => {
//     console.log("Trust score for good listing:", score);
//   })
//   .catch((error) => {
//     console.error("Failed to get trustScore:", error);
//   });

// const badListing: ListingData = {
//     price_dist: -0.75,
//     seller_age_years: 1.257,
//     rating: 1.6,
//     num_sold: 27,
//     num_rating: 7,
//     num_images: 0
// }
// trustScore(badListing)
//   .then((score) => {
//     console.log("Trust score for bad listing:", score);
//   })
//   .catch((error) => {
//     console.error("Failed to get trustScore:", error);
//   });

// const medListing: ListingData = {
//     price_dist: -0.21,
//     seller_age_years: 1.48,
//     rating: 4.6,
//     num_sold: 101,
//     num_rating: 19,
//     num_images: 4
// }
// trustScore(medListing)
//   .then((score) => {
//     console.log("Trust score for medium listing:", score);
//   })
//   .catch((error) => {
//     console.error("Failed to get trustScore:", error);
//   });

module.exports = trustScore;