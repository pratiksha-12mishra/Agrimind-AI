import { NextRequest, NextResponse } from 'next/server'

const BACKEND_URL = 'https://agrimind-ai-kr6q.onrender.com'
const REQUEST_TIMEOUT = 60000 // 60 seconds for cold start

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate required fields
    if (!body.crop || !body.growth_stage || body.soil_moisture === undefined || !body.city) {
      return NextResponse.json(
        { error: 'Validation error: Missing required fields (crop, growth_stage, soil_moisture, city)' },
        { status: 400 }
      )
    }

    // Ensure lowercase values for crop and growth_stage
    const payload: Record<string, any> = {
      crop: body.crop.toLowerCase(),
      growth_stage: body.growth_stage.toLowerCase(),
      soil_moisture: body.soil_moisture,
      city: body.city,
    }

    // Forward optional live sensor overrides when present — omitting them
    // entirely keeps this fully backward compatible per Mradanshi's spec
    if (typeof body.sensor_temperature === 'number') {
      payload.sensor_temperature = body.sensor_temperature
    }
    if (typeof body.sensor_humidity === 'number') {
      payload.sensor_humidity = body.sensor_humidity
    }

    console.log('[v0] API Proxy - Request payload:', JSON.stringify(payload))

    // Call backend with timeout
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT)

    const response = await fetch(`${BACKEND_URL}/recommend`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      signal: controller.signal,
    })

    clearTimeout(timeoutId)

    console.log('[v0] API Proxy - Response status:', response.status)

    if (!response.ok) {
      const errorText = await response.text()
      console.log('[v0] API Proxy - Error response:', errorText)

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
    console.log('[v0] API Proxy - Success response:', JSON.stringify(data))
    return NextResponse.json(data)
  } catch (error: any) {
    console.error('[v0] API Proxy - Error:', error)

    if (error.name === 'AbortError') {
      return NextResponse.json(
        { error: 'Request timeout: Backend service took too long to respond. It may be starting up.' },
        { status: 504 }
      )
    }

    return NextResponse.json(
      { error: error.message || 'Failed to process recommendation request' },
      { status: 500 }
    )
  }
}
