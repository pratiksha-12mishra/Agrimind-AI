import os
import requests
from dotenv import load_dotenv

load_dotenv()

API_KEY = os.getenv("OPENWEATHER_API_KEY")


def _format_weather_response(data):
    forecast = data["list"][0]
    rain_probability = forecast["pop"] * 100

    return {
        "city": data["city"]["name"],
        "temperature": forecast["main"]["temp"],
        "humidity": forecast["main"]["humidity"],
        "weather": forecast["weather"][0]["description"],
        "rain_probability": rain_probability,
    }


def get_weather(city: str):
    url = "https://api.openweathermap.org/data/2.5/forecast"

    params = {
        "q": city,
        "appid": API_KEY,
        "units": "metric",
    }

    response = requests.get(url, params=params)

    if response.status_code != 200:
        return {"error": "City not found"}

    return _format_weather_response(response.json())


def get_weather_by_coordinates(latitude: float, longitude: float):
    url = "https://api.openweathermap.org/data/2.5/forecast"

    params = {
        "lat": latitude,
        "lon": longitude,
        "appid": API_KEY,
        "units": "metric",
    }

    response = requests.get(url, params=params)

    if response.status_code != 200:
        return {"error": "Unable to fetch weather for current location"}

    return _format_weather_response(response.json())


def get_forecast(city: str):
    url = "https://api.openweathermap.org/data/2.5/forecast"

    params = {
        "q": city,
        "appid": API_KEY,
        "units": "metric",
    }

    response = requests.get(url, params=params)

    if response.status_code != 200:
        return {"error": "City not found"}

    data = response.json()

    forecast = []

    # One forecast approximately every 24 hours
    for i in range(0, min(len(data["list"]), 40), 8):
        item = data["list"][i]

        forecast.append({
            "date": item["dt_txt"].split(" ")[0],
            "temperature": item["main"]["temp"],
            "humidity": item["main"]["humidity"],
            "rain_probability": item["pop"] * 100,
            "weather": item["weather"][0]["description"],
        })

    return forecast