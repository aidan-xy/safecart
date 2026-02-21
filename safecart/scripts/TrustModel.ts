import * as ort from "onnxruntime-web";

// interface for TrustModel.score()
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

    const results = await this.session.run(feeds);

    // get second output (prob of class 1)
    const outputName = this.session.outputNames[1]; 
    const outputTensor = results[outputName] as ort.Tensor;
    const probs = outputTensor.data as Float32Array;
    return probs[1];
  }
}