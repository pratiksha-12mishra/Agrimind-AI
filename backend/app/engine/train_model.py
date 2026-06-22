"""
train_model.py
Generates synthetic but agronomically realistic training data and trains
an XGBoost model to predict:
  1. irrigation_needed (classification: 0 = no, 1 = yes)
  2. water_required_liters (regression)

Run this once: python train_model.py
It saves two files: irrigation_classifier.pkl and water_regressor.pkl
"""

import numpy as np
import pandas as pd
from xgboost import XGBClassifier, XGBRegressor
from sklearn.model_selection import train_test_split
import pickle

from water_lookup import CROPS, GROWTH_STAGES, get_base_water_requirement

np.random.seed(42)

N_SAMPLES = 8000


def generate_synthetic_data(n=N_SAMPLES):
    rows = []
    for _ in range(n):
        crop = np.random.choice(CROPS)
        stage = np.random.choice(GROWTH_STAGES)
        soil_moisture = np.random.uniform(5, 80)        # percent
        temperature = np.random.uniform(15, 45)          # Celsius
        humidity = np.random.uniform(10, 95)              # percent
        rain_probability = np.random.uniform(0, 100)      # percent

        base_water = get_base_water_requirement(crop, stage)

        # ---- Ground truth logic (agronomic reasoning, used to LABEL synthetic data) ----
        # Lower soil moisture, higher temp, lower humidity, lower rain chance -> more irrigation needed
        moisture_deficit = max(0, 50 - soil_moisture) / 50      # 0 to 1
        heat_factor = max(0, temperature - 25) / 20             # 0 to 1
        dryness_factor = max(0, 60 - humidity) / 60              # 0 to 1
        rain_relief = rain_probability / 100                      # 0 to 1

        need_score = (
            moisture_deficit * 0.5
            + heat_factor * 0.2
            + dryness_factor * 0.15
            - rain_relief * 0.35
        )

        irrigation_needed = 1 if need_score > 0.18 else 0

        # Water amount scales with deficit and heat, reduced by expected rain
        water_multiplier = 1 + moisture_deficit * 0.8 + heat_factor * 0.4 - rain_relief * 0.5
        water_multiplier = max(0.2, water_multiplier)
        water_required = round(base_water * water_multiplier, 1)

        rows.append({
            "crop": crop,
            "growth_stage": stage,
            "soil_moisture": soil_moisture,
            "temperature": temperature,
            "humidity": humidity,
            "rain_probability": rain_probability,
            "base_water": base_water,
            "irrigation_needed": irrigation_needed,
            "water_required": water_required,
        })

    return pd.DataFrame(rows)


def encode_features(df):
    """One-hot encode crop and growth_stage, keep numeric features as-is."""
    df_encoded = pd.get_dummies(df, columns=["crop", "growth_stage"])
    return df_encoded


def main():
    print("Generating synthetic training data...")
    df = generate_synthetic_data()

    feature_cols_numeric = [
        "soil_moisture", "temperature", "humidity", "rain_probability", "base_water"
    ]

    df_encoded = encode_features(df)
    feature_cols = feature_cols_numeric + [
        c for c in df_encoded.columns if c.startswith("crop_") or c.startswith("growth_stage_")
    ]

    X = df_encoded[feature_cols]
    y_class = df_encoded["irrigation_needed"]
    y_reg = df_encoded["water_required"]

    X_train, X_test, yc_train, yc_test, yr_train, yr_test = train_test_split(
        X, y_class, y_reg, test_size=0.2, random_state=42
    )

    print("Training irrigation classifier...")
    clf = XGBClassifier(
        n_estimators=120, max_depth=4, learning_rate=0.1,
        use_label_encoder=False, eval_metric="logloss", random_state=42
    )
    clf.fit(X_train, yc_train)
    print("Classifier accuracy on test set:", clf.score(X_test, yc_test))

    print("Training water requirement regressor...")
    reg = XGBRegressor(
        n_estimators=150, max_depth=4, learning_rate=0.1, random_state=42
    )
    reg.fit(X_train, yr_train)
    preds = reg.predict(X_test)
    mae = np.mean(np.abs(preds - yr_test))
    print("Regressor MAE on test set (L/m²):", round(mae, 2))

    # Save models + feature column order (critical for matching inputs at inference time)
    with open("irrigation_classifier.pkl", "wb") as f:
        pickle.dump({"model": clf, "feature_cols": feature_cols}, f)

    with open("water_regressor.pkl", "wb") as f:
        pickle.dump({"model": reg, "feature_cols": feature_cols}, f)

    print("Saved irrigation_classifier.pkl and water_regressor.pkl")


if __name__ == "__main__":
    main()