import { NextRequest, NextResponse } from 'next/server'

const BACKEND_URL = 'https://agrimind-ai-kr6q.onrender.com'

export async function POST(request: NextRequest) {
  try {
    const subscription = await request.json()

const response = await fetch(`${BACKEND_URL}/notifications/push/subscribe`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(subscription),
    })

    if (!response.ok) {
      const errorText = await response.text()
      return NextResponse.json({ error: errorText || `Backend error: ${response.status}` }, { status: response.status })
    }

    const raw = await response.json().catch(() => ({}))
    return NextResponse.json(raw)
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to register push subscription' }, { status: 500 })
  }
}