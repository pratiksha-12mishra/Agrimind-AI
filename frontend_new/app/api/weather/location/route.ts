import { NextRequest, NextResponse } from 'next/server'

const BACKEND_URL = 'https://agrimind-ai-kr6q.onrender.com'
const REQUEST_TIMEOUT = 60000

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const latitude = searchParams.get('latitude')
    const longitude = searchParams.get('longitude')

    if (!latitude || !longitude) {
      return NextResponse.json({ error: 'latitude and longitude are required' }, { status: 400 })
    }

    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT)

    const response = await fetch(
      `${BACKEND_URL}/weather/location/current?latitude=${latitude}&longitude=${longitude}`,
      {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        signal: controller.signal,
      }
    )

    clearTimeout(timeoutId)

    if (!response.ok) {
      const errorText = await response.text()
      let errorMessage = `Backend error: ${response.status}`
      try {
        const errorJson = JSON.parse(errorText)
        if (errorJson.detail) errorMessage = errorJson.detail
      } catch {
        errorMessage = errorText || errorMessage
      }
      return NextResponse.json({ error: errorMessage }, { status: response.status })
    }

    const raw = await response.json()
    const mapped = {
      city: raw.city,
      temperature: raw.temperature,
      humidity: raw.humidity,
      weather_condition: raw.weather ?? raw.weather_condition ?? '',
      rain_chance: raw.rain_probability ?? raw.rain_chance ?? 0,
    }

    return NextResponse.json(mapped)
  } catch (error: any) {
    if (error.name === 'AbortError') {
      return NextResponse.json({ error: 'Request timeout: Backend took too long to respond.' }, { status: 504 })
    }
    return NextResponse.json({ error: error.message || 'Failed to fetch weather data' }, { status: 500 })
  }
}