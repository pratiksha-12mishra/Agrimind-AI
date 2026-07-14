import { NextRequest, NextResponse } from 'next/server'

const BACKEND_URL = 'https://agrimind-ai-kr6q.onrender.com'
const REQUEST_TIMEOUT = 60000 // 60 seconds for cold start

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const city = searchParams.get('city')

    if (!city) {
      return NextResponse.json({ error: 'City parameter is required' }, { status: 400 })
    }

    console.log('[v0] Weather API - Fetching for city:', city)

    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT)

    const response = await fetch(`${BACKEND_URL}/weather/${encodeURIComponent(city)}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      signal: controller.signal,
    })

    clearTimeout(timeoutId)

    console.log('[v0] Weather API - Response status:', response.status)

    if (!response.ok) {
      const errorText = await response.text()
      console.log('[v0] Weather API - Error response:', errorText)

      let errorMessage = `Backend error: ${response.status}`
      try {
        const errorJson = JSON.parse(errorText)
        if (errorJson.detail) {
          errorMessage = errorJson.detail
        }
      } catch {
        errorMessage = errorText || errorMessage
      }

      return NextResponse.json({ error: errorMessage }, { status: response.status })
    }

    const raw = await response.json()
    console.log('[v0] Weather API - Raw backend response:', JSON.stringify(raw))

    // Backend uses different field names than the frontend expects — map them here
    const mapped = {
      city: raw.city,
      temperature: raw.temperature,
      humidity: raw.humidity,
      weather_condition: raw.weather ?? raw.weather_condition ?? '',
      rain_chance: raw.rain_probability ?? raw.rain_chance ?? 0,
    }

    console.log('[v0] Weather API - Mapped response:', JSON.stringify(mapped))
    return NextResponse.json(mapped)
  } catch (error: any) {
    console.error('[v0] Weather API - Error:', error)

    if (error.name === 'AbortError') {
      return NextResponse.json(
        { error: 'Request timeout: Backend service took too long to respond.' },
        { status: 504 }
      )
    }

    return NextResponse.json(
      { error: error.message || 'Failed to fetch weather data' },
      { status: 500 }
    )
  }
}