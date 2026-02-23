import * as ort from "onnxruntime-web";

/**
 * Use this interface to interact with the trust model. Must be in this order. Technically no
 * restictions on the domain of the inputs (as long as they are valid number types) but "invalid"
 * inputs will lead to innaccurate classification.
 *
 * @param {number} price_dist - Abs(market price - listing price) / market price, make sure to
 *                              handle divide by zero cases when computing this!
 * @param {number} seller_age_years - Seller age in years >= 0
 * @param {number} rating - Rating [0, 5]
 * @param {number} num_sold - Number of units sold >= 0
 * @param {number} num_rating - Total ratings >= 0
 * @param {number} num_images - Total number of images >= 0
 */
export interface ListingData {
  price_dist: number;
  seller_age_years: number;
  rating: number;
  num_sold: number;
  num_rating: number;
  num_images: number;
}

// This class loads the ONNX model and computes trust scores for listings. 
// It assumes the ONNX model takes a single input tensor of shape [1, 6] with the features in the
// order defined by ListingData, and outputs a tensor with class probabilities where index 1 
// corresponds to the "trustworthy" class.
export class TrustModel {
  private session: ort.InferenceSession | null = null;
  private modelPath: string;

  // Constructs TrustModel with .onnx at modelPath
  constructor(modelPath: string) {
    this.modelPath = modelPath;
  }

  // Load the ONNX model asynchronously 
  async load(): Promise<void> {
    this.session = await ort.InferenceSession.create(this.modelPath);
    console.log("Trust model loaded.");
  }

  // Compute trust probability [0, 1] for a single listing
  async score(listing: ListingData): Promise<number> {
    if (!this.session) {
      throw new Error("Model not loaded. Call load() first.");
    }

    const input = new Float32Array([
      listing.price_dist,
      listing.seller_age_years,
      listing.rating,
      listing.num_sold,
      listing.num_rating,
      listing.num_images,
    ]);

    const tensor = new ort.Tensor("float32", input, [1, 6]);

    const feeds: Record<string, ort.Tensor> = {
      float_input: tensor, // must match export name !
    };

    const results = await this.session.run(feeds, ['probabilities']);

    // get second output (prob of class 1)
    const outputTensor = results['probabilities'] as ort.Tensor;
    const probs = outputTensor.data as Float32Array;
    return probs[1];
  }
}