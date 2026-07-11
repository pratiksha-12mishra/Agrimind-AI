import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const lat = searchParams.get('lat')
  const lon = searchParams.get('lon')

  if (!lat || !lon) {
    return NextResponse.json({ error: 'lat and lon are required' }, { status: 400 })
  }

  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&zoom=10&addressdetails=1`,
      {
        headers: {
          'User-Agent': 'AgriMindAI/1.0 (student hackathon project)',
        },
      }
    )

    if (!response.ok) {
      return NextResponse.json({ error: `Geocoding failed: ${response.status}` }, { status: 502 })
    }

    const data = await response.json()
    const address = data.address || {}

    // Try candidates from most specific to most general, and strip
    // administrative suffixes like "Tahsil"/"District"/"Taluka" that
    // OpenWeather's city database usually doesn't recognize.
    const clean = (name: string | undefined) =>
      name
        ?.replace(/\s+(tahsil|taluka|district|division|block|mandal)$/i, '')
        .trim()

    const candidates = [
      clean(address.city),
      clean(address.town),
      clean(address.municipality),
      clean(address.village),
      clean(address.county),
      clean(address.state_district),
      clean(address.state),
    ].filter(Boolean) as string[]

    if (candidates.length === 0) {
      return NextResponse.json({ error: 'Could not determine city from coordinates' }, { status: 404 })
    }

    // Return the full ranked list — the frontend will try each one
    // against the weather API until one succeeds.
    return NextResponse.json({ city: candidates[0], candidates })
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || 'Geocoding request failed' }, { status: 500 })
  }
}