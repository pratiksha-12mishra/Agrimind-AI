"""
water_lookup.py
Base water requirement reference table (litres per square meter per day)
by crop and growth stage. Used as a baseline that the ML model adjusts
based on real-time soil moisture, temperature, humidity, and rainfall.
"""

# Base water requirement in L/m² per day, by crop -> growth_stage
WATER_LOOKUP = {
    "wheat": {
        "seedling": 15,
        "vegetative": 25,
        "flowering": 35,
        "maturity": 18,
    },
    "rice": {
        "seedling": 30,
        "vegetative": 45,
        "flowering": 55,
        "maturity": 25,
    },
    "cotton": {
        "seedling": 12,
        "vegetative": 28,
        "flowering": 40,
        "maturity": 20,
    },
    "maize": {
        "seedling": 14,
        "vegetative": 30,
        "flowering": 42,
        "maturity": 20,
    },
    "sugarcane": {
        "seedling": 20,
        "vegetative": 40,
        "flowering": 50,
        "maturity": 30,
    },
    "soybean": {
        "seedling": 10,
        "vegetative": 22,
        "flowering": 32,
        "maturity": 15,
    },
    "groundnut": {
        "seedling": 10,
        "vegetative": 20,
        "flowering": 30,
        "maturity": 14,
    },
    "potato": {
        "seedling": 12,
        "vegetative": 24,
        "flowering": 34,
        "maturity": 16,
    },
    "tomato": {
        "seedling": 10,
        "vegetative": 22,
        "flowering": 30,
        "maturity": 18,
    },
    "onion": {
        "seedling": 8,
        "vegetative": 18,
        "flowering": 26,
        "maturity": 14,
    },
    "chickpea": {
        "seedling": 8,
        "vegetative": 16,
        "flowering": 24,
        "maturity": 12,
    },
    "mustard": {
        "seedling": 9,
        "vegetative": 17,
        "flowering": 26,
        "maturity": 13,
    },
}

# Crops list and growth stages — used by train_model.py to generate
# synthetic data and by the frontend to populate dropdowns.
CROPS = list(WATER_LOOKUP.keys())
GROWTH_STAGES = ["seedling", "vegetative", "flowering", "maturity"]


def get_base_water_requirement(crop: str, growth_stage: str) -> float:
    """
    Returns the base water requirement (L/m²/day) for a crop and stage.
    Falls back to a safe default if the crop or stage is unknown.
    """
    crop = crop.lower().strip()
    growth_stage = growth_stage.lower().strip()

    if crop not in WATER_LOOKUP:
        # Unknown crop -> use wheat as a safe generic default
        crop = "wheat"

    stage_table = WATER_LOOKUP[crop]
    if growth_stage not in stage_table:
        growth_stage = "vegetative"

    return float(stage_table[growth_stage])