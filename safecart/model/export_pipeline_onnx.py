import joblib
import numpy as np

from pathlib import Path
from skl2onnx import convert_sklearn
from skl2onnx.common.data_types import FloatTensorType

"""
This file exports the trust pipeline to ONNX (to root dir) so it can be used with TypeScript. It 
also prints the scaler mean/scale and logistic regression coefficients so they can be copy-pasted 
into TrustModel.ts (the scalerMean, scalerScale, and coef arrays). These values are needed to 
compute per-feature contribution scores.
"""

# This gets the file path of this file
BASE_DIR = Path(__file__).resolve().parent

# Load trained pipeline
pipeline = joblib.load(BASE_DIR / "trust_pipeline.pkl")

# Print model parameters for copy-paste into TrustModel.ts
scaler = pipeline.steps[0][1]
classifier = pipeline.steps[1][1]

def fmt(arr: np.ndarray) -> str:
    return "[" + ", ".join(f"{v:.6g}" for v in arr) + "]"

print("TrustModel.ts model parameters (copy these into the class):")
print(f"  private readonly scalerMean: number[]  = {fmt(scaler.mean_)};")
print(f"  private readonly scalerScale: number[] = {fmt(scaler.scale_)};")
print(f"  private readonly coef: number[]        = {fmt(classifier.coef_[0])};")

# Define input shape (6 features)
initial_type = [('float_input', FloatTensorType([None, 6]))]

# Convert to ONNX with options to disable zipmap (makes output easier to work with in TypeScript)
onnx_model = convert_sklearn(
    pipeline,
    initial_types=initial_type,
    options={
        id(scaler): {},
        id(classifier): {'zipmap': False}
    }
)
with open("trust_model.onnx", "wb") as f:
    f.write(onnx_model.SerializeToString())