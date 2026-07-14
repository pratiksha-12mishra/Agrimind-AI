import { NextRequest, NextResponse } from 'next/server'

const BACKEND_URL = 'https://agrimind-ai-kr6q.onrender.com'
const REQUEST_TIMEOUT = 60000

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { query, language, farm_context } = body

    if (!query || !language) {
      return NextResponse.json({ error: 'query and language are required' }, { status: 400 })
    }

    console.log('[v0] Voice API - Query:', query, '| Language:', language)

    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT)

    const response = await fetch(`${BACKEND_URL}/voice/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        query,
        language,
        farm_context: farm_context ?? { soil_moisture: 50, crop: 'wheat', decision: 'unknown' },
      }),
      signal: controller.signal,
    })

    clearTimeout(timeoutId)
    console.log('[v0] Voice API - Response status:', response.status)

    const raw = await response.json()
    console.log('[v0] Voice API - Raw response:', JSON.stringify(raw))

    if (!response.ok) {
      return NextResponse.json({ error: raw.detail || raw.error || `Backend error: ${response.status}` }, { status: response.status })
    }

    return NextResponse.json(raw)
  } catch (error: any) {
    console.error('[v0] Voice API - Error:', error)
    if (error.name === 'AbortError') {
      return NextResponse.json({ error: 'Request timeout: Backend took too long to respond.' }, { status: 504 })
    }
    return NextResponse.json({ error: error.message || 'Failed to get voice response' }, { status: 500 })
  }
}