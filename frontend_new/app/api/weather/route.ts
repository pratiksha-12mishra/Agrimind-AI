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

    // Call backend with timeout
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

    const data = await response.json()
    console.log('[v0] Weather API - Success response:', JSON.stringify(data))
    return NextResponse.json(data)
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
