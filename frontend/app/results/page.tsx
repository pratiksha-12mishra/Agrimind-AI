"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

export default function ResultsPage() {
  const router = useRouter()
  const [result, setResult] = useState<any>(null)

  useEffect(() => {
    const saved = localStorage.getItem("agrimind_result")
    if (saved) setResult(JSON.parse(saved))
  }, [])

  if (!result) return (
    <div style={{ minHeight: "100vh", background: "#0d1f0d", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ textAlign: "center" }}>
        <div style={{ fontSize: "48px", marginBottom: "12px" }}>🌱</div>
        <p style={{ color: "#6fa84a", marginBottom: "16px" }}>No prediction found.</p>
        <button onClick={() => router.push("/predict")}
          style={{ background: "#1a5c10", color: "#c8f090", border: "0.5px solid #4a9a20", borderRadius: "10px", padding: "10px 24px", cursor: "pointer" }}>
          Make a prediction
        </button>
      </div>
    </div>
  )

  const decisionStyle: Record<string, any> = {
    "Irrigate Now":             { bg: "rgba(180,100,0,0.15)",  border: "rgba(220,140,0,0.4)",  title: "#f0c060", icon: "💧", orb: "#d4a017" },
    "Delay Irrigation":         { bg: "rgba(0,80,180,0.12)",   border: "rgba(50,130,220,0.3)", title: "#90c8f0", icon: "⏳", orb: "#378ADD" },
    "Irrigate Within 24 Hours": { bg: "rgba(180,50,50,0.12)",  border: "rgba(220,80,80,0.3)",  title: "#f09090", icon: "⚠️", orb: "#E24B4A" }
  }
  const ds = decisionStyle[result.decision] || decisionStyle["Irrigate Now"]
  const moisture = result.soil_moisture ?? 24
  const moistureStatus = moisture < 30 ? "⚠️ Critical low" : moisture < 60 ? "✅ Moderate" : "💦 High"

  return (
    <div style={{ minHeight: "100vh", background: "#0d1f0d" }}>
      <nav style={{ display: "flex", alignItems: "center", padding: "14px 20px", background: "rgba(10,26,10,0.95)", borderBottom: "0.5px solid rgba(180,220,80,0.1)" }}>
        <span style={{ color: "#a8d878", fontSize: "16px", fontWeight: 500, cursor: "pointer" }} onClick={() => router.push("/")}>🌱 AgriMind AI</span>
        <span style={{ fontSize: "11px", color: "#6fa84a", marginLeft: "auto" }}>Results</span>
      </nav>

      <div style={{ padding: "20px 16px", maxWidth: "480px", margin: "0 auto" }}>

        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "16px" }}>
          <p style={{ fontSize: "11px", fontWeight: 500, color: "#6fa84a", textTransform: "uppercase", letterSpacing: "0.07em" }}>📊 Recommendation</p>
          <span style={{ background: "rgba(180,220,80,0.1)", border: "0.5px solid rgba(180,220,80,0.25)", color: "#a8d878", fontSize: "11px", padding: "3px 10px", borderRadius: "20px" }}>
            🌾 {result.crop} · {result.growth_stage}
          </span>
        </div>

        {/* Decision Card */}
        <div style={{ background: ds.bg, border: `1px solid ${ds.border}`, borderRadius: "16px", padding: "20px", marginBottom: "12px", position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", top: "-20px", right: "-20px", width: "80px", height: "80px", borderRadius: "50%", background: ds.orb, opacity: 0.15 }}></div>
          <div style={{ fontSize: "28px", marginBottom: "10px" }}>{ds.icon}</div>
          <h3 style={{ fontSize: "20px", fontWeight: 500, color: ds.title, marginBottom: "6px" }}>{result.decision}</h3>
          <p style={{ fontSize: "13px", color: ds.title, opacity: 0.8, marginBottom: "12px" }}>🪣 Water required: {result.water_required}</p>
          <p style={{ fontSize: "13px", lineHeight: 1.7, color: ds.title, opacity: 0.9 }}>{result.explanation}</p>
        </div>

        {/* Weather Card */}
        <div style={{ background: "rgba(255,255,255,0.06)", border: "0.5px solid rgba(255,255,255,0.1)", borderRadius: "14px", padding: "16px", marginBottom: "12px" }}>
          <p style={{ fontSize: "11px", fontWeight: 500, color: "#6fa84a", textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: "12px" }}>
            🌤️ Live weather · {result.city}
          </p>
          {result.weather?.condition && (
            <p style={{ fontSize: "13px", color: "#a8d878", marginBottom: "12px", textTransform: "capitalize" }}>
              ☁️ {result.weather.condition}
            </p>
          )}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "8px" }}>
            {[
              { icon: "🌡️", val: `${result.weather?.temperature?.toFixed(1)}°C`, lbl: "Temperature" },
              { icon: "💧", val: `${result.weather?.humidity}%`, lbl: "Humidity" },
              { icon: "🌧️", val: `${result.weather?.rain_probability}%`, lbl: "Rain chance" }
            ].map(w => (
              <div key={w.lbl} style={{ background: "rgba(255,255,255,0.05)", border: "0.5px solid rgba(180,220,80,0.15)", borderRadius: "10px", padding: "12px 8px", textAlign: "center" }}>
                <div style={{ fontSize: "16px", marginBottom: "4px" }}>{w.icon}</div>
                <div style={{ fontSize: "18px", fontWeight: 500, color: "#c8f090" }}>{w.val}</div>
                <div style={{ fontSize: "10px", color: "#6fa84a", marginTop: "3px" }}>{w.lbl}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Soil Card */}
        <div style={{ background: "rgba(180,120,0,0.1)", border: "0.5px solid rgba(200,150,0,0.25)", borderRadius: "16px", padding: "16px", marginBottom: "16px" }}>
          <p style={{ fontSize: "11px", fontWeight: 500, color: "#c8a040", textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: "10px" }}>
            🏔️ Soil moisture analysis
          </p>
          <div style={{ background: "rgba(100,60,0,0.2)", borderRadius: "20px", height: "10px", overflow: "hidden", margin: "10px 0 6px" }}>
            <div style={{ background: "linear-gradient(90deg,#8B4513,#D4A017)", height: "10px", borderRadius: "20px", width: `${moisture}%`, transition: "width 0.6s ease" }} />
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: "10px", color: "#8a6030", marginBottom: "12px" }}>
            <span>Dry 0%</span>
            <span style={{ color: "#d4a017", fontWeight: 500 }}>{moisture}%</span>
            <span>Saturated 100%</span>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
            <div style={{ background: "rgba(0,0,0,0.2)", borderRadius: "8px", padding: "10px", textAlign: "center" }}>
              <div style={{ fontSize: "11px", color: "#8a6030", marginBottom: "3px" }}>Status</div>
              <div style={{ fontSize: "12px", color: "#d4a017", fontWeight: 500 }}>{moistureStatus}</div>
            </div>
            <div style={{ background: "rgba(0,0,0,0.2)", borderRadius: "8px", padding: "10px", textAlign: "center" }}>
              <div style={{ fontSize: "11px", color: "#8a6030", marginBottom: "3px" }}>Location</div>
              <div style={{ fontSize: "12px", color: "#d4a017", fontWeight: 500 }}>📍 {result.city}</div>
            </div>
          </div>
        </div>

        {/* Buttons */}
        <button onClick={() => router.push("/predict")}
          style={{ width: "100%", background: "transparent", border: "0.5px solid rgba(180,220,80,0.3)", borderRadius: "12px", padding: "13px", fontSize: "14px", fontWeight: 500, color: "#a8d878", cursor: "pointer", marginBottom: "8px" }}>
          🔄 New prediction
        </button>
        <button onClick={() => router.push("/")}
          style={{ width: "100%", background: "transparent", border: "0.5px solid rgba(255,255,255,0.08)", borderRadius: "12px", padding: "13px", fontSize: "14px", color: "#6fa84a", cursor: "pointer" }}>
          ← Back to home
        </button>

      </div>
    </div>
  )
}
