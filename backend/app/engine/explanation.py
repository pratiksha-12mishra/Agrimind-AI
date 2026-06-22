"""
explanation.py
Converts decision engine output into farmer-readable sentences.
No ML here — just clear, templated language.
"""


def generate_explanation(decision, soil_moisture, rain_probability, temperature, water_required):
    soil_moisture = round(soil_moisture, 1)
    rain_probability = round(rain_probability, 1)
    temperature = round(temperature, 1)

    if decision == "Irrigate Now":
        return (
            f"Soil moisture is low at {soil_moisture}%, and rain probability is only "
            f"{rain_probability}%. Irrigating today with approximately {water_required} L/m² "
            f"will help prevent water stress and maintain healthy crop growth."
        )

    elif decision == "Delay Irrigation":
        if rain_probability > 70:
            return (
                f"There is a high probability of rainfall ({rain_probability}%) in the coming hours. "
                f"Irrigation is not recommended right now to avoid water wastage."
            )
        else:
            return (
                f"Soil moisture is currently sufficient at {soil_moisture}%. "
                f"No irrigation is needed at this time."
            )

    else:  # Irrigate Within 24 Hours
        return (
            f"Soil moisture is at {soil_moisture}% and conditions are moderate. "
            f"Irrigation is not urgent but is recommended within the next 24 hours, "
            f"using approximately {water_required} L/m², to maintain optimal crop health."
        )