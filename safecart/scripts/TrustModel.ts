import * as ort from "onnxruntime-web";

/**
 * Use this interface to interact with the trust model. Must be in this order. Technically no
 * restictions on the domain of the inputs (as long as they are valid number types) but "invalid"
 * inputs will lead to innaccurate classification.
 *
 * @param {number} price_dist - Abs(market price - listing price) / market price, make sure to
 *                              handle divide by zero cases when computing this!
 * @param {number} seller_age_years - age in years >= 0, use 5 as fallback if cannot be determined
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

// A single metric entry in the trust score breakdown.
// @param {string} name - Human-readable metric name
// @param {number} score - Contribution score in [1, 100]
export interface TrustMetric {
  name: string;
  score: number;
}


// Return type of trustScore(). Overall score plus a per-feature breakdown in [1, 100].
// A score of 100 in a metric means that feature is contributing maximally to trustworthiness,
// and 1 means it is contributing maximally against trustworthiness.
export interface TrustScoreResult {
  score: number;
  metrics: TrustMetric[];
}

// This class loads the ONNX model and computes trust scores for listings. 
// It assumes the ONNX model takes a single input tensor of shape [1, 6] with the features in the
// order defined by ListingData, and outputs a tensor with class probabilities where index 1 
// corresponds to the "trustworthy" class.
export class TrustModel {
  private session: ort.InferenceSession | null = null;
  private modelPath: string;

  // Model metadata embedded from the trained sklearn pipeline.
  // Extracted via: scaler.mean_, scaler.scale_, model.coef_[0]
  // These must be kept in sync with trust_model_logistic_regression.py / trust_pipeline.pkl.
  private readonly featureNames: (keyof ListingData)[] = [
    "price_dist",
    "seller_age_years",
    "rating",
    "num_sold",
    "num_rating",
    "num_images",
  ];

  // StandardScaler parameters (mean and std per feature, in ListingData order)
  // ! UPDATE THESE ! if the model is retrained — run: pipeline['scaler'].mean_ / .scale_
  private readonly scalerMean: number[] = [0.265949, 5.00127, 3.42658, 3494.91, 538.177, 81.7089];
  private readonly scalerScale: number[] = [0.266014, 4.47249, 1.52338, 4655.16, 668.868, 103.483];

  // LogisticRegression coefficients (coef_[0], in ListingData order)
  // ! UPDATE THESE ! if the model is retrained — run: pipeline['model'].coef_[0]
  private readonly coef: number[] = [-1.31086, 1.03554, 1.38835, 0.490514, 0.616441, 0.642486];

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
    const probs = await this._runInference(listing);
    return probs[1];
  }

  /**
   * Compute the overall trust score AND a per-feature breakdown, all on [1, 100].
   *
   * Each feature score reflects how much that individual feature contributes to
   * trustworthiness, derived from the logistic regression weights:
   *   contribution_i = coef_i * (x_i - mean_i) / scale_i
   *
   * Positive contributions (feature pushes toward trustworthy) map toward 100.
   * Negative contributions (feature pushes against trustworthy) map toward 1.
   * The per-feature scores are calibrated so that a perfect-100 overall listing
   * would score 100 in every metric.
   *
   * NOTE: scalerMean, scalerScale, and coef must be kept in sync with the trained
   * sklearn pipeline. See trust_model_logistic_regression.py.
   */
  async scoreWithBreakdown(listing: ListingData): Promise<TrustScoreResult> {
    const probs = await this._runInference(listing);
    const score = Math.max(1, Math.round(probs[1] * 100));

    const featureValues: number[] = [
      listing.price_dist,
      listing.seller_age_years,
      listing.rating,
      listing.num_sold,
      listing.num_rating,
      listing.num_images,
    ];

    // Compute each feature's signed contribution to the log-odds
    const contributions = featureValues.map((x, i) => {
      const z = (x - this.scalerMean[i]) / this.scalerScale[i];
      return this.coef[i] * z;
    });

    // Map contributions to [1, 100] via sigmoid so each score is on the same
    // scale as the overall probability-based score. sigmoid(contribution) gives
    // a value in (0, 1) where 0.5 = neutral (no contribution), > 0.5 = positive.
    const metricNames = [
      "Price Ratio",
      "Seller Age",
      "Product Rating",
      "Units Sold",
      "Number of Ratings",
      "Listing Images",
    ];

    const metrics: TrustMetric[] = contributions.map((c, i) => ({
      name: metricNames[i],
      score: Math.max(1, Math.round(sigmoid(c) * 100)),
    }));

    return { score, metrics };
  }

  // Runs ONNX inference and returns the raw probability array [p_class0, p_class1]
  private async _runInference(listing: ListingData): Promise<Float32Array> {
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
      float_input: tensor, // must match export name!
    };

    const results = await this.session.run(feeds, ["probabilities"]);

    const outputTensor = results["probabilities"] as ort.Tensor;
    return outputTensor.data as Float32Array;
  }
}

// Standard sigmoid function
function sigmoid(x: number): number {
  return 1 / (1 + Math.exp(-x));
}