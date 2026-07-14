import { NextRequest, NextResponse } from 'next/server'

const BACKEND_URL = 'https://agrimind-ai-kr6q.onrender.com'
const REQUEST_TIMEOUT = 60000

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const action = body.action

    if (!action || (action !== 'start' && action !== 'stop')) {
      return NextResponse.json({ error: 'action must be "start" or "stop"' }, { status: 400 })
    }

    console.log('[v0] Motor API - Sending action:', action)

    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT)

    const response = await fetch(`${BACKEND_URL}/motor/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action }),
      signal: controller.signal,
    })

    clearTimeout(timeoutId)
    console.log('[v0] Motor API - Response status:', response.status)

    const raw = await response.json()
    console.log('[v0] Motor API - Response:', JSON.stringify(raw))

    if (!response.ok) {
      return NextResponse.json({ error: raw.detail || `Backend error: ${response.status}` }, { status: response.status })
    }

    return NextResponse.json(raw)
  } catch (error: any) {
    console.error('[v0] Motor API - Error:', error)
    if (error.name === 'AbortError') {
      return NextResponse.json({ error: 'Request timeout: Backend took too long to respond.' }, { status: 504 })
    }
    return NextResponse.json({ error: error.message || 'Failed to send motor command' }, { status: 500 })
  }
}