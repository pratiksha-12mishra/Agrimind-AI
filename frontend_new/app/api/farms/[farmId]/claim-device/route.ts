import { NextRequest, NextResponse } from 'next/server'

const BACKEND_URL = 'https://agrimind-ai-kr6q.onrender.com'
const REQUEST_TIMEOUT = 60000

export async function POST(request: NextRequest, { params }: { params: { farmId: string } }) {
  try {
    const authHeader = request.headers.get('authorization')
    if (!authHeader) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    const body = await request.json()

    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT)

    const response = await fetch(`${BACKEND_URL}/farms/${params.farmId}/claim-device`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: authHeader },
      body: JSON.stringify(body),
      signal: controller.signal,
    })

    clearTimeout(timeoutId)

    const raw = await response.json()

    if (!response.ok) {
      return NextResponse.json({ error: raw.detail || `Error ${response.status}` }, { status: response.status })
    }

    return NextResponse.json(raw)
  } catch (error: any) {
    if (error.name === 'AbortError') {
      return NextResponse.json({ error: 'Server is waking up — please try again in a few seconds' }, { status: 504 })
    }
    return NextResponse.json({ error: error.message || 'Failed to claim device' }, { status: 500 })
  }
}