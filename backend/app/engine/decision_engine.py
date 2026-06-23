"""
decision_engine.py
Main entry point for the irrigation decision engine.
Loads the trained XGBoost models once at import time and exposes a single
clean function: decide_irrigation(...)

Mradanshi imports this in backend/app/main.py like:
    from app.engine.decision_engine import decide_irrigation
"""

import pickle
import pandas as pd
import os

from .water_lookup import get_base_water_requirement, CROPS, GROWTH_STAGES
from .explanation import generate_explanation

# ---- Load models once at import time ----
_BASE_DIR = os.path.dirname(os.path.abspath(__file__))

with open(os.path.join(_BASE_DIR, "irrigation_classifier.pkl"), "rb") as f:
    _clf_bundle = pickle.load(f)
    _CLASSIFIER = _clf_bundle["model"]
    _FEATURE_COLS = _clf_bundle["feature_cols"]

with open(os.path.join(_BASE_DIR, "water_regressor.pkl"), "rb") as f:
    _reg_bundle = pickle.load(f)
    _REGRESSOR = _reg_bundle["model"]


def _build_feature_row(crop, growth_stage, soil_moisture, temperature, humidity, rain_probability):
    """Builds a single-row DataFrame matching the training feature columns exactly."""
    crop = crop.lower().strip()
    growth_stage = growth_stage.lower().strip()

    if crop not in CROPS:
        crop = "wheat"
    if growth_stage not in GROWTH_STAGES:
        growth_stage = "vegetative"

    base_water = get_base_water_requirement(crop, growth_stage)

    row = {col: 0 for col in _FEATURE_COLS}
    row["soil_moisture"] = soil_moisture
    row["temperature"] = temperature
    row["humidity"] = humidity
    row["rain_probability"] = rain_probability
    row["base_water"] = base_water

    crop_col = f"crop_{crop}"
    stage_col = f"growth_stage_{growth_stage}"
    if crop_col in row:
        row[crop_col] = 1
    if stage_col in row:
        row[stage_col] = 1

    return pd.DataFrame([row])[_FEATURE_COLS]


def decide_irrigation(crop, growth_stage, soil_moisture, temperature, humidity, rain_probability):
    """
    Main function called by the backend.

    Args:
        crop (str): e.g. "wheat"
        growth_stage (str): e.g. "flowering"
        soil_moisture (float): percentage, 0-100
        temperature (float): Celsius
        humidity (float): percentage, 0-100
        rain_probability (float): percentage, 0-100

    Returns:
        dict with keys: decision, water_required, explanation
    """
    features = _build_feature_row(
        crop, growth_stage, soil_moisture, temperature, humidity, rain_probability
    )

    irrigation_needed = int(_CLASSIFIER.predict(features)[0])
    water_required_raw = float(_REGRESSOR.predict(features)[0])
    water_required_raw = max(0, round(water_required_raw, 1))

    if soil_moisture < 15:
        # Critically low moisture overrides everything else — crop is already stressed
        decision = "Irrigate Now"
    elif not irrigation_needed:
        decision = "Delay Irrigation"
        water_required_raw = 0.0
    elif rain_probability > 70:
        decision = "Delay Irrigation"
        water_required_raw = 0.0
    elif soil_moisture < 30 and rain_probability < 50:
        decision = "Irrigate Now"
    else:
        decision = "Irrigate Within 24 Hours"

    explanation = generate_explanation(
        decision=decision,
        soil_moisture=soil_moisture,
        rain_probability=rain_probability,
        temperature=temperature,
        water_required=water_required_raw,
    )

    return {
        "decision": decision,
        "water_required": f"{water_required_raw} L/m²",
        "explanation": explanation,
    }


# ---- Quick manual test when run directly ----
if __name__ == "__main__":
    test_cases = [
        dict(crop="wheat", growth_stage="flowering", soil_moisture=22, temperature=33, humidity=40, rain_probability=15),
        dict(crop="rice", growth_stage="vegetative", soil_moisture=55, temperature=28, humidity=70, rain_probability=80),
        dict(crop="cotton", growth_stage="seedling", soil_moisture=45, temperature=30, humidity=50, rain_probability=45),
        dict(crop="wheat", growth_stage="flowering", soil_moisture=1, temperature=33, humidity=40, rain_probability=45),
        dict(crop="wheat", growth_stage="flowering", soil_moisture=5, temperature=33, humidity=40, rain_probability=45),
    ]
    for case in test_cases:
        result = decide_irrigation(**case)
        print(case)
        print("->", result)
        print()