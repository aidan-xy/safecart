import pandas as pd
import joblib

from pathlib import Path
from sklearn.linear_model import LogisticRegression
from sklearn.preprocessing import StandardScaler
from sklearn.pipeline import Pipeline
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score

"""
This file trains a logistic regression pipeline to classify listing trustworthiness then dumps
it into trust_pipeline.pkl to be exported to ONNX.
"""

# This gets the file path of this file
BASE_DIR = Path(__file__).resolve().parent

# Load CSV (!) synthetic = NOT REAL DATA (!)
# columns: price_dist, seller_age_years, rating, num_sold, num_rating, num_images, is_trustworthy
trust_data = pd.read_csv(BASE_DIR / "data/synthetic_marketplace_data.csv")

# Features and label
X = trust_data.drop("is_trustworthy", axis=1)
y = trust_data["is_trustworthy"]

# Splits the data into train/test
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=1
)

# Create pipeline (scaler + logistic regression)
trust_pipeline = Pipeline([
    ("scaler", StandardScaler()),
    ("model", LogisticRegression())
])

# Train pipeline (scaler + model together)
trust_pipeline.fit(X_train, y_train)

# Test pipeline, expect 100% accuracy on synthetic data lol
acc = accuracy_score(y_test, trust_pipeline.predict(X_test)) * 100
print(f"Logistic Regression model accuracy: {acc:.2f}%")

# Dump pipeline
joblib.dump(trust_pipeline, BASE_DIR / "trust_pipeline.pkl")
