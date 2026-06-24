"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { getPrediction } from "@/lib/apiClient"

const crops = ["wheat", "rice", "cotton"]
const stages = ["seedling", "vegetative", "flowering"]

export default function PredictPage() {
  const router = useRouter()
  const [form, setForm] = useState({
    crop: "wheat",
    growth_stage: "flowering",
    soil_moisture: 30,
    city: ""
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  async function handleSubmit() {
    if (!form.city.trim()) {
      setError("Please enter a city name")
      return
    }
    setLoading(true)
    setError("")
    try {
      const result = await getPrediction(form)
      localStorage.setItem("agrimind_result", JSON.stringify(result))
      router.push("/results")
    } catch (e: any) {
      setError(e.message || "Something went wrong. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ minHeight: "100vh", background: "#0d1f0d" }}>
      <nav style={{ display: "flex", alignItems: "center", padding: "14px 20px", background: "rgba(10,26,10,0.95)", borderBottom: "0.5px solid rgba(180,220,80,0.1)" }}>
        <span style={{ color: "#a8d878", fontSize: "16px", fontWeight: 500, cursor: "pointer" }} onClick={() => router.push("/")}>🌱 AgriMind AI</span>
        <span style={{ fontSize: "11px", color: "#6fa84a", marginLeft: "auto" }}>Field Analysis</span>
      </nav>

      <div style={{ padding: "20px 16px", maxWidth: "480px", margin: "0 auto" }}>
        <p style={{ fontSize: "11px", fontWeight: 500, color: "#6fa84a", textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: "12px" }}>
          📋 Enter field details
        </p>

        <div style={{ background: "rgba(255,255,255,0.05)", border: "0.5px solid rgba(180,220,80,0.2)", borderRadius: "16px", padding: "20px", marginBottom: "12px" }}>

          {/* Crop */}
          <label style={{ fontSize: "12px", color: "#a8d878", fontWeight: 500, display: "block", marginBottom: "6px" }}>
            🌾 Crop type
          </label>
          <select
            value={form.crop}
            onChange={e => setForm({ ...form, crop: e.target.value })}
            style={{ width: "100%", background: "rgba(255,255,255,0.07)", border: "0.5px solid rgba(180,220,80,0.25)", borderRadius: "8px", padding: "10px 12px", fontSize: "14px", color: "#e8f5c8", marginBottom: "14px", outline: "none" }}
          >
            {crops.map(c => <option key={c} value={c} style={{ background: "#1a3a0a" }}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>)}
          </select>

          {/* Growth Stage */}
          <label style={{ fontSize: "12px", color: "#a8d878", fontWeight: 500, display: "block", marginBottom: "6px" }}>
            📅 Growth stage
          </label>
          <select
            value={form.growth_stage}
            onChange={e => setForm({ ...form, growth_stage: e.target.value })}
            style={{ width: "100%", background: "rgba(255,255,255,0.07)", border: "0.5px solid rgba(180,220,80,0.25)", borderRadius: "8px", padding: "10px 12px", fontSize: "14px", color: "#e8f5c8", marginBottom: "14px", outline: "none" }}
          >
            {stages.map(s => <option key={s} value={s} style={{ background: "#1a3a0a" }}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
          </select>

          {/* Soil Moisture */}
          <label style={{ fontSize: "12px", color: "#a8d878", fontWeight: 500, display: "block", marginBottom: "6px" }}>
            🏔️ Soil moisture — <span style={{ color: "#c8f090" }}>{form.soil_moisture}%</span>
          </label>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "4px" }}>
            <input
              type="range" min={0} max={100} step={1}
              value={form.soil_moisture}
              onChange={e => setForm({ ...form, soil_moisture: Number(e.target.value) })}
              style={{ flex: 1, accentColor: "#639922" }}
            />
            <span style={{ background: "rgba(180,220,80,0.15)", border: "0.5px solid rgba(180,220,80,0.3)", color: "#a8d878", fontSize: "13px", fontWeight: 500, padding: "4px 12px", borderRadius: "20px", minWidth: "52px", textAlign: "center" }}>
              {form.soil_moisture}%
            </span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: "10px", color: "#4a7a30", marginBottom: "14px" }}>
            <span>Dry</span><span>Optimal (50–70%)</span><span>Saturated</span>
          </div>

          {/* City */}
          <label style={{ fontSize: "12px", color: "#a8d878", fontWeight: 500, display: "block", marginBottom: "6px" }}>
            📍 City
          </label>
          <input
            type="text"
            placeholder="e.g. Bhopal, Jabalpur, Mumbai"
            value={form.city}
            onChange={e => setForm({ ...form, city: e.target.value })}
            onKeyDown={e => e.key === "Enter" && handleSubmit()}
            style={{ width: "100%", background: "rgba(255,255,255,0.07)", border: "0.5px solid rgba(180,220,80,0.25)", borderRadius: "8px", padding: "10px 12px", fontSize: "14px", color: "#e8f5c8", outline: "none" }}
          />
        </div>

        {error && (
          <div style={{ background: "rgba(220,60,60,0.1)", border: "0.5px solid rgba(220,60,60,0.3)", borderRadius: "10px", padding: "10px 14px", marginBottom: "12px", fontSize: "13px", color: "#f09090" }}>
            ⚠️ {error}
          </div>
        )}

        <button
          onClick={handleSubmit}
          disabled={loading}
          style={{ width: "100%", background: loading ? "#2a4a1a" : "#1a5c10", border: "0.5px solid #4a9a20", borderRadius: "12px", padding: "14px", fontSize: "15px", fontWeight: 500, color: "#c8f090", cursor: loading ? "not-allowed" : "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}
        >
          {loading ? (
            <>
              <span style={{ display: "inline-block", width: "14px", height: "14px", border: "2px solid #c8f090", borderTopColor: "transparent", borderRadius: "50%", animation: "spin 0.8s linear infinite" }}></span>
              Fetching weather & analyzing...
            </>
          ) : "🤖 Get AI recommendation"}
        </button>

        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    </div>
  )
}