const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"

export async function getPrediction(data: {
  crop: string
  growth_stage: string
  soil_moisture: number
  location: string
}) {
  const res = await fetch(`${BASE_URL}/predict`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  })
  if (!res.ok) throw new Error("Prediction failed")
  return res.json()
}

export async function getHistory() {
  const res = await fetch(`${BASE_URL}/history`)
  if (!res.ok) throw new Error("History fetch failed")
  return res.json()
}