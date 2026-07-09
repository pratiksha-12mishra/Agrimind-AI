"""
explanation.py
Converts decision engine output into farmer-readable sentences.
Includes confidence score phrasing.
"""


def generate_explanation(decision, soil_moisture, rain_probability,
                         temperature, water_required, confidence=None):
    soil_moisture = round(soil_moisture, 1)
    rain_probability = round(rain_probability, 1)
    temperature = round(temperature, 1)

    conf_phrase = ""
    if confidence is not None:
        if confidence >= 90:
            conf_phrase = f" Our model is {confidence}% confident in this recommendation."
        elif confidence >= 75:
            conf_phrase = f" Our model has {confidence}% confidence in this assessment."
        else:
            conf_phrase = f" Note: confidence is moderate at {confidence}%."

    if decision == "Irrigate Now":
        return (
            f"Soil moisture is low at {soil_moisture}%, and rain probability is only "
            f"{rain_probability}%. Irrigating today with approximately {water_required} L/m² "
            f"will help prevent water stress and maintain healthy crop growth.{conf_phrase}"
        )

    elif decision == "Delay Irrigation":
        if rain_probability > 70:
            return (
                f"There is a high probability of rainfall ({rain_probability}%) in the coming "
                f"hours. Irrigation is not recommended right now to avoid water wastage.{conf_phrase}"
            )
        else:
            return (
                f"Soil moisture is currently sufficient at {soil_moisture}%. "
                f"No irrigation is needed at this time.{conf_phrase}"
            )

    else:  # Irrigate Within 24 Hours
        return (
            f"Soil moisture is at {soil_moisture}% and conditions are moderate. "
            f"Irrigation is recommended within the next 24 hours using approximately "
            f"{water_required} L/m² to maintain optimal crop health.{conf_phrase}"
        )