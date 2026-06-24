const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://agrimind-ai-kr6q.onrender.com"

export interface PredictionRequest {
  crop: string
  growth_stage: string
  soil_moisture: number
  city: string
}

export interface PredictionResponse {
  crop: string
  growth_stage: string
  soil_moisture: number
  city: string
  decision: string
  water_required: string
  explanation: string
  weather: {
    temperature: number
    humidity: number
    rain_probability: number
    condition: string
  }
}

export async function getPrediction(data: PredictionRequest): Promise<PredictionResponse> {
  const res = await fetch(`${BASE_URL}/recommend`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      crop: data.crop.toLowerCase(),
      growth_stage: data.growth_stage.toLowerCase(),
      soil_moisture: data.soil_moisture,
      city: data.city
    })
  })

  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    if (res.status === 404) throw new Error("City not found. Please check the city name.")
    if (res.status === 422) throw new Error(err?.detail?.[0]?.msg || "Invalid input. Check crop, stage and moisture values.")
    throw new Error("Something went wrong. Please try again.")
  }

  const raw = await res.json()

  return {
    crop: data.crop,
    growth_stage: data.growth_stage,
    soil_moisture: data.soil_moisture,
    city: data.city,
    decision: raw.recommendation.decision,
    water_required: raw.recommendation.water_required,
    explanation: raw.recommendation.explanation,
    weather: {
      temperature: raw.weather.temperature,
      humidity: raw.weather.humidity,
      rain_probability: raw.weather.rain_probability,
      condition: raw.weather.weather
    }
  }
}

export async function getHistory() {
  try {
    const res = await fetch(`${BASE_URL}/history`)
    if (!res.ok) return { predictions: [] }
    return res.json()
  } catch {
    return { predictions: [] }
  }
}