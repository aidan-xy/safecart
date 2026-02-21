import numpy as np
import pandas as pd
import joblib

# Maps [0, 1] -> [1, 100] rounded
def norm_to_percent(norm):
    if norm < 0.01:
        return 1.0
    return np.round(norm * 100.0)

def trust_score(model, scaler, input_dict):
    """
    Compute the trust score for a single marketplace listing = prob mapped to {0, 100} ints

    Parameters:
    - model: Trained sklearn LogisticRegression model
    - scaler: Fitted sklearn StandardScaler (fit on training data only)
    - input_dict: Dictionary containing feature values for one listing.
                  Keys must match the training feature names:
                    "price_dist": percent distance of price to market price (can be neg),
                    "seller_age_years": age of seller in years >= 0,
                    "rating": star rating [0, 5],
                    "num_sold": number sold >= 0,
                    "num_rating": number of ratings >= 0,
                    "num_images": number of images in ratings >= 0

    Returns:
    - Score [1, 100] rounded that the listing is trustworthy (class 1 of model)
    """
    df = pd.DataFrame([input_dict])
    df = df[feature_names] 
    scaled = scaler.transform(df)
    return norm_to_percent(model.predict_proba(scaled)[0][1])

bundle = joblib.load("trust_model_bundle.pkl")
trust_model = bundle["model"]
scaler = bundle["scaler"]
feature_names = bundle["feature_names"]

# Some manual test listings: 
# AMD Ryzen 5 7500F, extremely trustworthy
good_listing = {
    "price_dist": 0.04,
    "seller_age_years": 9.03,
    "rating": 4.9,
    "num_sold": 5000,
    "num_rating": 722,
    "num_images": 61
}
print(
    "Good Listing Trust Score:",
    trust_score(trust_model, scaler, good_listing)
)

# New Original zotac 4090, clear scam
bad_listing = {
    "price_dist": -0.75,
    "seller_age_years": 1.257,
    "rating": 1.6,
    "num_sold": 27,
    "num_rating": 7,
    "num_images": 0
}
print(
    "Bad Listing Trust Score:",
    trust_score(trust_model, scaler, bad_listing)
)

# Random Smart Watch listing, medium trustworthiness
# "Smart Watch for Women (Answer/Make Call), Fitness Tracker for Android and iOS Phones 
# Waterproof Smartwatch with 1.32" HD Full"
med_listing = {
    "price_dist": -0.21,
    "seller_age_years": 1.48,
    "rating": 4.6,
    "num_sold": 101,
    "num_rating": 19,
    "num_images": 4
}
print(
    "Medium Trust Listing Trust Score:",
    trust_score(trust_model, scaler, med_listing)
)