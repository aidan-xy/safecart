import pandas as pd
import joblib

from pathlib import Path
from sklearn.linear_model import LogisticRegression
from sklearn.preprocessing import StandardScaler
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score

"""
This file trains a logistic regression model to classify listing trustworthiness then dumps
it into trust_model_bundle.pkl to be used for trust_score.py
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

# Scale features
scaler = StandardScaler()
X_train_scaled = scaler.fit_transform(X_train)
X_test_scaled = scaler.transform(X_test)

# Train and test model, expect 100% accuracy on synthetic data lol
trust_model = LogisticRegression()
trust_model.fit(X_train_scaled, y_train)

acc = accuracy_score(y_test, trust_model.predict(X_test_scaled)) * 100
print(f"Logistic Regression model accuracy: {acc:.2f}%")

# Dump model
feature_names = X.columns.tolist()
model_path = BASE_DIR / "trust_model_bundle.pkl"
joblib.dump({
    "model": trust_model,
    "scaler": scaler,
    "feature_names": feature_names
}, model_path)
