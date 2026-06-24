import { useRouter } from "next/router"
import { useEffect, useState } from "react"

export default function History() {
  const router = useRouter()
  const [items, setItems] = useState<any[]>([])

  useEffect(() => {
    const saved = localStorage.getItem("agrimind_result")
    if (saved) setItems([JSON.parse(saved)])
  }, [])

  return (
    <div style={{ minHeight: "100vh", background: "#0d1f0d" }}>
      <nav style={{ display: "flex", alignItems: "center", padding: "14px 20px", background: "rgba(10,26,10,0.9)" }}>
        <span style={{ color: "#a8d878", fontSize: "16px", fontWeight: 500 }}>🌱 AgriMind AI</span>
        <span style={{ fontSize: "11px", color: "#6fa84a", marginLeft: "auto" }}>History</span>
      </nav>
      <div style={{ padding: "20px 16px", maxWidth: "480px", margin: "0 auto" }}>
        <p style={{ fontSize: "11px", fontWeight: 500, color: "#6fa84a", textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: "12px" }}>🕐 Past predictions</p>
        {items.length === 0 ? (
          <div style={{ textAlign: "center", padding: "40px 0" }}>
            <div style={{ fontSize: "40px", marginBottom: "12px" }}>📭</div>
            <p style={{ color: "#6fa84a" }}>No predictions yet.</p>
            <button onClick={() => router.push("/predict")}
              style={{ marginTop: "16px", background: "#1a5c10", color: "#c8f090", border: "0.5px solid #4a9a20", borderRadius: "10px", padding: "10px 24px", cursor: "pointer" }}>
              Make your first prediction
            </button>
          </div>
        ) : items.map((item, i) => (
          <div key={i} style={{ background: "rgba(255,255,255,0.05)", border: "0.5px solid rgba(180,220,80,0.18)", borderRadius: "14px", padding: "14px", marginBottom: "10px" }}>
            <p style={{ fontSize: "13px", fontWeight: 500, color: "#c8f090", marginBottom: "4px" }}>🌾 {item.crop} · {item.growth_stage}</p>
            <p style={{ fontSize: "13px", color: "#a8d878", marginBottom: "4px" }}>{item.decision}</p>
            <p style={{ fontSize: "12px", color: "#6fa84a" }}>💧 {item.water_required}</p>
          </div>
        ))}
        <button onClick={() => router.push("/")}
          style={{ width: "100%", background: "transparent", border: "0.5px solid rgba(180,220,80,0.3)", borderRadius: "12px", padding: "12px", fontSize: "14px", color: "#a8d878", cursor: "pointer", marginTop: "8px" }}>
          ← Back to home
        </button>
      </div>
    </div>
  )
}