import { TrustModel, ListingData } from "./TrustModel";

/**
 * This function is the main entry point for computing a trust score for a listing using the
 * logistic regression model. It creates an instance of TrustModel, loads the ONNX file, 
 * and then computes the trust score for the given listing data. 
 * 
 * @param {ListingData} input - The listing data to compute the trust score for
 * @returns {Promise<number>} - The computed trust score on a scale of [1, 100] rounded
 */
async function trustScore(input : ListingData): Promise<number> {
  // Create the and load model
  const model = new TrustModel("trust_model.onnx"); // path to ONNX file
  await model.load();

  const score = await model.score(input);
  return Math.max(1, Math.round(score * 100.0)); // convert to [1, 100] rounded scale
}

module.exports = trustScore;