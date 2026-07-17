import { NextRequest, NextResponse } from 'next/server'

const BACKEND_URL = 'https://agrimind-ai-kr6q.onrender.com'
const REQUEST_TIMEOUT = 60000

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT)

    const response = await fetch(`${BACKEND_URL}/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: body.email, password: body.password }),
      signal: controller.signal,
    })

    clearTimeout(timeoutId)

    const raw = await response.json()

    if (!response.ok) {
      const errorMessage = Array.isArray(raw.detail)
        ? raw.detail[0]?.msg || 'Signup failed'
        : raw.detail || 'Could not create account'
      return NextResponse.json({ error: errorMessage }, { status: response.status })
    }

    return NextResponse.json(raw)
  } catch (error: any) {
    if (error.name === 'AbortError') {
      return NextResponse.json(
        { error: 'Server is waking up — please try again in a few seconds' },
        { status: 504 }
      )
    }
    return NextResponse.json(
      { error: 'Could not reach the server — please check your connection and try again' },
      { status: 500 }
    )
  }
}