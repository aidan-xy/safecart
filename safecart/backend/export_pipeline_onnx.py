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
pipeline = joblib.load(BASE_DIR / "model/trust_pipeline.pkl")

# Define input shape (6 features)
initial_type = [('float_input', FloatTensorType([None, 6]))]

onnx_model = convert_sklearn(
    pipeline,
    initial_types=initial_type,
    options={id(pipeline): {'zipmap': False}}  # disable ZipMap
)

with open("trust_model.onnx", "wb") as f:
    f.write(onnx_model.SerializeToString())