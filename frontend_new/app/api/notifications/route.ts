import { NextRequest, NextResponse } from 'next/server'

const BACKEND_URL = 'https://agrimind-ai-kr6q.onrender.com'
const REQUEST_TIMEOUT = 60000

export async function GET(request: NextRequest) {
  try {
    console.log('[v0] Notifications API - Fetching')

    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT)

    const response = await fetch(`${BACKEND_URL}/notifications/`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      signal: controller.signal,
    })

    clearTimeout(timeoutId)
    console.log('[v0] Notifications API - Response status:', response.status)

    if (!response.ok) {
      const errorText = await response.text()
      return NextResponse.json({ error: errorText || `Backend error: ${response.status}` }, { status: response.status })
    }

    const raw = await response.json()
    console.log('[v0] Notifications API - Raw response (first 1000 chars):', JSON.stringify(raw).slice(0, 1000))

    return NextResponse.json(raw)
  } catch (error: any) {
    console.error('[v0] Notifications API - Error:', error)
    if (error.name === 'AbortError') {
      return NextResponse.json({ error: 'Request timeout: Backend took too long to respond.' }, { status: 504 })
    }
    return NextResponse.json({ error: error.message || 'Failed to fetch notifications' }, { status: 500 })
  }
}