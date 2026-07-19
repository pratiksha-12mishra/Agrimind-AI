const BACKEND_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://agrimind-ai-kr6q.onrender.com'

export interface RecommendationRequest {
  crop: string
  growth_stage: string
  soil_moisture: number
  city: string
  sensor_temperature?: number
  sensor_humidity?: number
}

export interface RecommendationResponse {
  recommendation: string
  water_required: number
  confidence: number
  soil_moisture_analysis: string
  weather_data: WeatherData | null
  explanation: string
}

export interface WeatherData {
  temperature: number
  humidity: number
  rain_chance: number
  weather_condition: string
  city: string
}

export interface ApiError {
  error: string
}

function isApiError(data: any): data is ApiError {
  return data && typeof data === 'object' && 'error' in data && typeof data.error === 'string'
}

export const apiClient = {
  async getWeather(city: string): Promise<{ data: WeatherData | null; error: string | null }> {
    try {
      console.log('[v0] Fetching weather for:', city)

      const response = await fetch(`/api/weather?city=${encodeURIComponent(city)}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      })

      console.log('[v0] Weather API status:', response.status)

      const responseData = await response.json()
      console.log('[v0] Weather API response:', JSON.stringify(responseData))

      if (!response.ok || isApiError(responseData)) {
        const errorMessage = isApiError(responseData) ? responseData.error : `Error: ${response.status}`
        console.error('[v0] Weather error:', errorMessage)
        return { data: null, error: errorMessage }
      }

      return { data: responseData, error: null }
    } catch (error: any) {
      const errorMsg = error?.message || 'Failed to fetch weather data'
      console.error('[v0] Weather fetch error:', errorMsg)
      return { data: null, error: errorMsg }
    }
  },

  async getRecommendation(
    data: RecommendationRequest
  ): Promise<{ data: RecommendationResponse | null; error: string | null }> {
    try {
      console.log('[v0] Requesting recommendation with payload:', JSON.stringify(data))

      const payload: Record<string, any> = {
        crop: (data as any).crop_type ? (data as any).crop_type.toLowerCase() : data.crop.toLowerCase(),
        growth_stage: data.growth_stage.toLowerCase(),
        soil_moisture: data.soil_moisture,
        city: data.city,
      }

      // Only include sensor overrides when actually available — omitting
      // them entirely keeps this fully backward compatible per Mradanshi's spec
      if (typeof data.sensor_temperature === 'number') {
        payload.sensor_temperature = data.sensor_temperature
      }
      if (typeof data.sensor_humidity === 'number') {
        payload.sensor_humidity = data.sensor_humidity
      }

      console.log('[v0] Final payload being sent:', JSON.stringify(payload))

      const response = await fetch('/api/recommend', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      console.log('[v0] Recommendation API status:', response.status)

      const responseData = await response.json()
      console.log('[v0] Recommendation API response:', JSON.stringify(responseData))

      if (!response.ok || isApiError(responseData)) {
        const errorMessage = isApiError(responseData) ? responseData.error : `Error: ${response.status}`
        console.error('[v0] Recommendation error:', errorMessage)
        return { data: null, error: errorMessage }
      }

      // Backend returns a nested shape — flatten it to match what the UI expects
      const rec = responseData.recommendation || {}
      const flattened: RecommendationResponse = {
        recommendation: rec.decision ?? 'No recommendation',
        water_required:
          typeof rec.water_required_raw === 'number'
            ? rec.water_required_raw
            : parseFloat(rec.water_required) || 0,
        confidence: typeof rec.confidence === 'number' ? rec.confidence : 0,
        soil_moisture_analysis: rec.explanation ?? '',
        weather_data: responseData.weather ?? null,
        explanation: rec.explanation ?? '',
      }

      return { data: flattened, error: null }
    } catch (error: any) {
      const errorMsg = error?.message || 'Failed to get recommendation'
      console.error('[v0] Recommendation fetch error:', errorMsg)
      return { data: null, error: errorMsg }
    }
  },
}