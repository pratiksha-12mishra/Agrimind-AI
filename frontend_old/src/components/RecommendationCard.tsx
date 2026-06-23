type Props = {
  decision: string
  water_required: string
  explanation: string
}

const decisionColor: Record<string, string> = {
  "Irrigate Now": "bg-red-100 border-red-400 text-red-800",
  "Delay Irrigation": "bg-blue-100 border-blue-400 text-blue-800",
  "Irrigate Within 24 Hours": "bg-yellow-100 border-yellow-400 text-yellow-800"
}

export default function RecommendationCard({ decision, water_required, explanation }: Props) {
  return (
    <div className={`border-2 rounded-2xl p-5 ${decisionColor[decision] || "bg-gray-100"}`}>
      <h3 className="text-xl font-bold mb-1">{decision}</h3>
      <p className="text-sm font-medium mb-3">Water Required: {water_required}</p>
      <p className="text-sm">{explanation}</p>
    </div>
  )
}