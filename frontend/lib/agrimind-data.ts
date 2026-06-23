export const CROPS = ["wheat", "rice", "cotton", "maize", "sugarcane"] as const
export const STAGES = ["seedling", "vegetative", "flowering", "harvest"] as const

export type Decision =
  | "Irrigate Now"
  | "Delay Irrigation"
  | "Irrigate Within 24 Hours"

export type PredictionResult = {
  crop: string
  decision: Decision
  water_required: string
  explanation: string
  confidence: number
  weather: {
    temperature: number
    humidity: number
    rain_probability: number
  }
}

export const mockResult: PredictionResult = {
  crop: "wheat",
  decision: "Irrigate Now",
  water_required: "42 L/m²",
  confidence: 88,
  explanation:
    "Soil moisture is low and no significant rainfall is expected in the next 24 hours. Irrigating today will help prevent water stress and maintain healthy crop growth.",
  weather: {
    temperature: 31,
    humidity: 58,
    rain_probability: 18,
  },
}

/* ---- Analytics mock data (for charts on the results page) ---- */

// Soil moisture trend over the past 7 days vs the ideal range
export const moistureTrend = [
  { day: "Mon", moisture: 41, ideal: 45 },
  { day: "Tue", moisture: 38, ideal: 45 },
  { day: "Wed", moisture: 34, ideal: 45 },
  { day: "Thu", moisture: 30, ideal: 45 },
  { day: "Fri", moisture: 27, ideal: 45 },
  { day: "Sat", moisture: 24, ideal: 45 },
  { day: "Sun", moisture: 22, ideal: 45 },
]

// Hourly rain probability for the next 24h
export const rainForecast = [
  { time: "6AM", rain: 8 },
  { time: "9AM", rain: 12 },
  { time: "12PM", rain: 18 },
  { time: "3PM", rain: 22 },
  { time: "6PM", rain: 15 },
  { time: "9PM", rain: 10 },
]

// How the recommended water budget is split
export const waterBudget = [
  { name: "Crop demand", value: 42 },
  { name: "Soil deficit", value: 26 },
  { name: "Evaporation buffer", value: 18 },
  { name: "Reserve", value: 14 },
]

export const history = [
  { crop: "wheat", decision: "Irrigate Now", water: "42 L/m²", date: "23 Jun" },
  { crop: "rice", decision: "Delay Irrigation", water: "0 L/m²", date: "22 Jun" },
  { crop: "cotton", decision: "Irrigate Within 24 Hours", water: "28 L/m²", date: "21 Jun" },
  { crop: "maize", decision: "Irrigate Now", water: "35 L/m²", date: "20 Jun" },
]
