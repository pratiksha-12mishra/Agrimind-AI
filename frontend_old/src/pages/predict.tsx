import { useState } from "react"
import { useRouter } from "next/router"
import { mockResult } from "@/lib/mockData"

const crops = ["wheat", "rice", "cotton"]
const stages = ["seedling", "vegetative", "flowering"]

export default function Predict() {
  const router = useRouter()
  const [form, setForm] = useState({
    crop: "wheat",
    growth_stage: "seedling",
    soil_moisture: 30,
    location: ""
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  async function handleSubmit() {
    if (!form.location.trim()) {
      setError("Please enter a city name")
      return
    }
    setLoading(true)
    setError("")
    try {
      const result = mockResult
      localStorage.setItem("agrimind_result", JSON.stringify(result))
      router.push("/results")
    } catch (e) {
      setError("Something went wrong. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-green-50 flex flex-col items-center p-8">
      <h2 className="text-2xl font-bold text-green-800 mb-6">Enter Field Details</h2>

      <div className="bg-white rounded-2xl shadow p-6 w-full max-w-md flex flex-col gap-4">

        <label className="flex flex-col gap-1">
          <span className="text-sm font-medium text-gray-700">Crop</span>
          <select
            className="border rounded-lg p-2"
            value={form.crop}
            onChange={e => setForm({...form, crop: e.target.value})}
          >
            {crops.map(c => <option key={c}>{c}</option>)}
          </select>
        </label>

        <label className="flex flex-col gap-1">
          <span className="text-sm font-medium text-gray-700">Growth Stage</span>
          <select
            className="border rounded-lg p-2"
            value={form.growth_stage}
            onChange={e => setForm({...form, growth_stage: e.target.value})}
          >
            {stages.map(s => <option key={s}>{s}</option>)}
          </select>
        </label>

        <label className="flex flex-col gap-1">
          <span className="text-sm font-medium text-gray-700">
            Soil Moisture: {form.soil_moisture}%
          </span>
          <input
            type="range" min={0} max={100}
            value={form.soil_moisture}
            onChange={e => setForm({...form, soil_moisture: Number(e.target.value)})}
            className="accent-green-600"
          />
        </label>

        <label className="flex flex-col gap-1">
          <span className="text-sm font-medium text-gray-700">Location (City)</span>
          <input
            type="text"
            placeholder="e.g. Jabalpur"
            className="border rounded-lg p-2"
            value={form.location}
            onChange={e => setForm({...form, location: e.target.value})}
          />
        </label>

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="bg-green-600 text-white py-3 rounded-xl hover:bg-green-700 disabled:opacity-50"
        >
          {loading ? "Analyzing..." : "Get Recommendation"}
        </button>

      </div>
    </main>
  )
}