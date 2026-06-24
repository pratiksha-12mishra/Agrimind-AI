import { useEffect, useState } from "react"
import { useRouter } from "next/router"
import RecommendationCard from "@/components/RecommendationCard"
import WeatherCard from "@/components/WeatherCard"

export default function Results() {
  const router = useRouter()
  const [result, setResult] = useState<any>(null)

  useEffect(() => {
    const saved = localStorage.getItem("agrimind_result")
    if (saved) setResult(JSON.parse(saved))
  }, [])

  if (!result) return (
    <main className="min-h-screen bg-green-50 flex items-center justify-center">
      <div className="text-center">
        <p className="text-gray-600 mb-4">No prediction found.</p>
        <button
          onClick={() => router.push("/predict")}
          className="bg-green-600 text-white px-6 py-2 rounded-xl"
        >
          Make a Prediction
        </button>
      </div>
    </main>
  )

  return (
    <main className="min-h-screen bg-green-50 flex flex-col items-center p-8">
      <h2 className="text-2xl font-bold text-green-800 mb-6">
        Recommendation for {result.crop}
      </h2>
      <div className="w-full max-w-md flex flex-col gap-4">
        <RecommendationCard
          decision={result.decision}
          water_required={result.water_required}
          explanation={result.explanation}
        />
        <WeatherCard {...result.weather} />
        <button
          onClick={() => router.push("/predict")}
          className="bg-green-600 text-white py-3 rounded-xl hover:bg-green-700"
        >
          New Prediction
        </button>
      </div>
    </main>
  )
}