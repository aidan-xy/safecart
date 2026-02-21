import joblib

from pathlib import Path
from skl2onnx import convert_sklearn
from skl2onnx.common.data_types import FloatTensorType

"""
This file exports the trust pipeline to ONNX (to root dir) so it can be used with TypeScript.
"""

# This gets the file path of this file
BASE_DIR = Path(__file__).resolve().parent

# Load trained pipeline
pipeline = joblib.load(BASE_DIR / "trust_pipeline.pkl")

# Define input shape (6 features)
initial_type = [('float_input', FloatTensorType([None, 6]))]

# Convert to ONNX with options to disable zipmap (makes output easier to work with in TypeScript)
scaler = pipeline.steps[0][1]
classifier = pipeline.steps[1][1]
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