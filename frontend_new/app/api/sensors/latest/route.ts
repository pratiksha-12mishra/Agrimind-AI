import { NextResponse } from 'next/server'

const BACKEND_URL = 'https://agrimind-ai-kr6q.onrender.com'
const REQUEST_TIMEOUT = 15000

export async function GET() {
  try {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT)

    // 👇 CHANGE THIS PATH if Mradanshi names the endpoint differently
    const response = await fetch(`${BACKEND_URL}/sensors/latest`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      signal: controller.signal,
    })

    clearTimeout(timeoutId)

    if (!response.ok) {
      const errorText = await response.text()
      return NextResponse.json({ error: errorText || `Backend error: ${response.status}` }, { status: response.status })
    }

    const raw = await response.json()
    return NextResponse.json(raw)
  } catch (error: any) {
    if (error.name === 'AbortError') {
      return NextResponse.json({ error: 'Request timeout' }, { status: 504 })
    }
    return NextResponse.json({ error: error.message || 'Failed to fetch sensor data' }, { status: 500 })
  }
}