// "use client"

// import { useEffect, useState } from "react"
// import { useRouter } from "next/navigation"

// export default function ResultsPage() {
//   const router = useRouter()
//   const [result, setResult] = useState<any>(null)

//   useEffect(() => {
//     const saved = localStorage.getItem("agrimind_result")
//     if (saved) setResult(JSON.parse(saved))
//   }, [])

//   if (!result) return (
//     <div style={{ minHeight: "100vh", background: "#0d1f0d", display: "flex", alignItems: "center", justifyContent: "center" }}>
//       <div style={{ textAlign: "center" }}>
//         <div style={{ fontSize: "48px", marginBottom: "12px" }}>🌱</div>
//         <p style={{ color: "#6fa84a", marginBottom: "16px" }}>No prediction found.</p>
//         <button onClick={() => router.push("/predict")}
//           style={{ background: "#1a5c10", color: "#c8f090", border: "0.5px solid #4a9a20", borderRadius: "10px", padding: "10px 24px", cursor: "pointer" }}>
//           Make a prediction
//         </button>
//       </div>
//     </div>
//   )

//   const decisionStyle: Record<string, any> = {
//     "Irrigate Now":             { bg: "rgba(180,100,0,0.15)",  border: "rgba(220,140,0,0.4)",  title: "#f0c060", icon: "💧", orb: "#d4a017" },
//     "Delay Irrigation":         { bg: "rgba(0,80,180,0.12)",   border: "rgba(50,130,220,0.3)", title: "#90c8f0", icon: "⏳", orb: "#378ADD" },
//     "Irrigate Within 24 Hours": { bg: "rgba(180,50,50,0.12)",  border: "rgba(220,80,80,0.3)",  title: "#f09090", icon: "⚠️", orb: "#E24B4A" }
//   }
//   const ds = decisionStyle[result.decision] || decisionStyle["Irrigate Now"]
//   const moisture = result.soil_moisture ?? 24
//   const moistureStatus = moisture < 30 ? "⚠️ Critical low" : moisture < 60 ? "✅ Moderate" : "💦 High"

//   return (
//     <div style={{ minHeight: "100vh", background: "#0d1f0d" }}>
//       <nav style={{ display: "flex", alignItems: "center", padding: "14px 20px", background: "rgba(10,26,10,0.95)", borderBottom: "0.5px solid rgba(180,220,80,0.1)" }}>
//         <span style={{ color: "#a8d878", fontSize: "16px", fontWeight: 500, cursor: "pointer" }} onClick={() => router.push("/")}>🌱 AgriMind AI</span>
//         <span style={{ fontSize: "11px", color: "#6fa84a", marginLeft: "auto" }}>Results</span>
//       </nav>

//       <div style={{ padding: "20px 16px", maxWidth: "480px", margin: "0 auto" }}>

//         {/* Header */}
//         <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "16px" }}>
//           <p style={{ fontSize: "11px", fontWeight: 500, color: "#6fa84a", textTransform: "uppercase", letterSpacing: "0.07em" }}>📊 Recommendation</p>
//           <span style={{ background: "rgba(180,220,80,0.1)", border: "0.5px solid rgba(180,220,80,0.25)", color: "#a8d878", fontSize: "11px", padding: "3px 10px", borderRadius: "20px" }}>
//             🌾 {result.crop} · {result.growth_stage}
//           </span>
//         </div>

//         {/* Decision Card */}
//         <div style={{ background: ds.bg, border: `1px solid ${ds.border}`, borderRadius: "16px", padding: "20px", marginBottom: "12px", position: "relative", overflow: "hidden" }}>
//           <div style={{ position: "absolute", top: "-20px", right: "-20px", width: "80px", height: "80px", borderRadius: "50%", background: ds.orb, opacity: 0.15 }}></div>
//           <div style={{ fontSize: "28px", marginBottom: "10px" }}>{ds.icon}</div>
//           <h3 style={{ fontSize: "20px", fontWeight: 500, color: ds.title, marginBottom: "6px" }}>{result.decision}</h3>
//           <p style={{ fontSize: "13px", color: ds.title, opacity: 0.8, marginBottom: "12px" }}>🪣 Water required: {result.water_required}</p>
//           <p style={{ fontSize: "13px", lineHeight: 1.7, color: ds.title, opacity: 0.9 }}>{result.explanation}</p>
//         </div>

//         {/* Weather Card */}
//         <div style={{ background: "rgba(255,255,255,0.06)", border: "0.5px solid rgba(255,255,255,0.1)", borderRadius: "14px", padding: "16px", marginBottom: "12px" }}>
//           <p style={{ fontSize: "11px", fontWeight: 500, color: "#6fa84a", textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: "12px" }}>
//             🌤️ Live weather · {result.city}
//           </p>
//           {result.weather?.condition && (
//             <p style={{ fontSize: "13px", color: "#a8d878", marginBottom: "12px", textTransform: "capitalize" }}>
//               ☁️ {result.weather.condition}
//             </p>
//           )}
//           <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "8px" }}>
//             {[
//               { icon: "🌡️", val: `${result.weather?.temperature?.toFixed(1)}°C`, lbl: "Temperature" },
//               { icon: "💧", val: `${result.weather?.humidity}%`, lbl: "Humidity" },
//               { icon: "🌧️", val: `${result.weather?.rain_probability}%`, lbl: "Rain chance" }
//             ].map(w => (
//               <div key={w.lbl} style={{ background: "rgba(255,255,255,0.05)", border: "0.5px solid rgba(180,220,80,0.15)", borderRadius: "10px", padding: "12px 8px", textAlign: "center" }}>
//                 <div style={{ fontSize: "16px", marginBottom: "4px" }}>{w.icon}</div>
//                 <div style={{ fontSize: "18px", fontWeight: 500, color: "#c8f090" }}>{w.val}</div>
//                 <div style={{ fontSize: "10px", color: "#6fa84a", marginTop: "3px" }}>{w.lbl}</div>
//               </div>
//             ))}
//           </div>
//         </div>

//         {/* Soil Card */}
//         <div style={{ background: "rgba(180,120,0,0.1)", border: "0.5px solid rgba(200,150,0,0.25)", borderRadius: "16px", padding: "16px", marginBottom: "16px" }}>
//           <p style={{ fontSize: "11px", fontWeight: 500, color: "#c8a040", textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: "10px" }}>
//             🏔️ Soil moisture analysis
//           </p>
//           <div style={{ background: "rgba(100,60,0,0.2)", borderRadius: "20px", height: "10px", overflow: "hidden", margin: "10px 0 6px" }}>
//             <div style={{ background: "linear-gradient(90deg,#8B4513,#D4A017)", height: "10px", borderRadius: "20px", width: `${moisture}%`, transition: "width 0.6s ease" }} />
//           </div>
//           <div style={{ display: "flex", justifyContent: "space-between", fontSize: "10px", color: "#8a6030", marginBottom: "12px" }}>
//             <span>Dry 0%</span>
//             <span style={{ color: "#d4a017", fontWeight: 500 }}>{moisture}%</span>
//             <span>Saturated 100%</span>
//           </div>
//           <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
//             <div style={{ background: "rgba(0,0,0,0.2)", borderRadius: "8px", padding: "10px", textAlign: "center" }}>
//               <div style={{ fontSize: "11px", color: "#8a6030", marginBottom: "3px" }}>Status</div>
//               <div style={{ fontSize: "12px", color: "#d4a017", fontWeight: 500 }}>{moistureStatus}</div>
//             </div>
//             <div style={{ background: "rgba(0,0,0,0.2)", borderRadius: "8px", padding: "10px", textAlign: "center" }}>
//               <div style={{ fontSize: "11px", color: "#8a6030", marginBottom: "3px" }}>Location</div>
//               <div style={{ fontSize: "12px", color: "#d4a017", fontWeight: 500 }}>📍 {result.city}</div>
//             </div>
//           </div>
//         </div>

//         {/* Buttons */}
//         <button onClick={() => router.push("/predict")}
//           style={{ width: "100%", background: "transparent", border: "0.5px solid rgba(180,220,80,0.3)", borderRadius: "12px", padding: "13px", fontSize: "14px", fontWeight: 500, color: "#a8d878", cursor: "pointer", marginBottom: "8px" }}>
//           🔄 New prediction
//         </button>
//         <button onClick={() => router.push("/")}
//           style={{ width: "100%", background: "transparent", border: "0.5px solid rgba(255,255,255,0.08)", borderRadius: "12px", padding: "13px", fontSize: "14px", color: "#6fa84a", cursor: "pointer" }}>
//           ← Back to home
//         </button>

//       </div>
//     </div>
//   )
// }
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
    "Irrigate Now":             { bg: "rgba(180,100,0,0.15)", border: "rgba(220,140,0,0.4)",  title: "#f0c060", icon: "💧", orb: "#d4a017" },
    "Delay Irrigation":         { bg: "rgba(0,80,180,0.12)",  border: "rgba(50,130,220,0.3)", title: "#90c8f0", icon: "⏳", orb: "#378ADD" },
    "Irrigate Within 24 Hours": { bg: "rgba(180,50,50,0.12)", border: "rgba(220,80,80,0.3)",  title: "#f09090", icon: "⚠️", orb: "#E24B4A" }
  }
  const ds = decisionStyle[result.decision] || decisionStyle["Irrigate Now"]
  const moisture  = result.soil_moisture ?? 24
  const temp      = result.weather?.temperature ?? 0
  const humidity  = result.weather?.humidity ?? 0
  const rainProb  = result.weather?.rain_probability ?? 0
  const condition = result.weather?.condition ?? ""

  // Donut helper
  const r = 38, circ = 2 * Math.PI * r
  const donut = (pct: number) => `${(pct / 100) * circ} ${circ - (pct / 100) * circ}`

  // Derived analytics for donut chart (crop water demand breakdown)
  const cropDemand   = Math.round(moisture * 0.4)
  const soilDeficit  = Math.round((100 - moisture) * 0.35)
  const evaporation  = Math.round(temp * 0.8)
  const reserve      = Math.max(0, 100 - cropDemand - soilDeficit - evaporation)
  const total        = cropDemand + soilDeficit + evaporation + reserve || 1

  // Rain probability curve — 8 time points simulated from rain_probability
  const rainCurve = [0, 1, 2, 3, 4, 5, 6, 7].map(i => {
    const peak = rainProb
    const bell = peak * Math.exp(-0.5 * Math.pow((i - 3) / 2, 2))
    return Math.round(bell)
  })
  const maxRain = Math.max(...rainCurve, 1)

  // Weekly trend (simulated from temp + humidity)
  const weekDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
  const weekData = weekDays.map((_, i) => Math.max(5, Math.round(temp - 2 + Math.sin(i) * 3)))
  const maxWeek = Math.max(...weekData, 1)

  const card: React.CSSProperties = { background: "rgba(255,255,255,0.05)", border: "0.5px solid rgba(180,220,80,0.15)", borderRadius: "14px", padding: "16px", marginBottom: "12px" }

  return (
    <div style={{ minHeight: "100vh", background: "#0d1f0d" }}>

      {/* Nav */}
      <nav style={{ display: "flex", alignItems: "center", padding: "14px 20px", background: "rgba(10,26,10,0.95)", borderBottom: "0.5px solid rgba(180,220,80,0.1)" }}>
        <span style={{ color: "#a8d878", fontSize: "16px", fontWeight: 500, cursor: "pointer" }} onClick={() => router.push("/")}>🌱 AgriMind AI</span>
        <span style={{ fontSize: "11px", color: "#6fa84a", marginLeft: "auto" }}>Results</span>
      </nav>

      <div style={{ padding: "16px", maxWidth: "700px", margin: "0 auto" }}>

        {/* Badge row */}
        <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "14px" }}>
          <p style={{ fontSize: "11px", fontWeight: 500, color: "#6fa84a", textTransform: "uppercase", letterSpacing: "0.07em" }}>📊 Recommendation</p>
          <span style={{ background: "rgba(180,220,80,0.1)", border: "0.5px solid rgba(180,220,80,0.25)", color: "#a8d878", fontSize: "11px", padding: "3px 10px", borderRadius: "20px" }}>
            🌾 {result.crop} · {result.growth_stage}
          </span>
          <span style={{ background: "rgba(180,220,80,0.08)", border: "0.5px solid rgba(180,220,80,0.15)", color: "#6fa84a", fontSize: "11px", padding: "3px 10px", borderRadius: "20px", marginLeft: "auto" }}>
            📍 {result.city}
          </span>
        </div>

        {/* Decision Card */}
        <div style={{ background: ds.bg, border: `1px solid ${ds.border}`, borderRadius: "16px", padding: "20px", marginBottom: "12px", position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", top: "-20px", right: "-20px", width: "90px", height: "90px", borderRadius: "50%", background: ds.orb, opacity: 0.15 }}></div>
          <div style={{ fontSize: "28px", marginBottom: "8px" }}>{ds.icon}</div>
          <h3 style={{ fontSize: "20px", fontWeight: 500, color: ds.title, marginBottom: "6px" }}>{result.decision}</h3>
          <p style={{ fontSize: "13px", color: ds.title, opacity: 0.8, marginBottom: "10px" }}>🪣 Water required: {result.water_required}</p>
          <p style={{ fontSize: "13px", lineHeight: 1.7, color: ds.title, opacity: 0.85 }}>{result.explanation}</p>
        </div>

        {/* Row 1: Donut chart + Weekly line chart */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "12px" }}>

          {/* Donut — Water demand breakdown */}
          <div style={card}>
            <p style={{ fontSize: "11px", fontWeight: 500, color: "#6fa84a", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "12px" }}>
              💧 Water demand
            </p>
            <div style={{ display: "flex", justifyContent: "center", marginBottom: "10px" }}>
              <svg viewBox="0 0 100 100" width="110" height="110">
                <circle cx="50" cy="50" r={r} fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="18"/>
                {/* Crop demand - green */}
                <circle cx="50" cy="50" r={r} fill="none" stroke="#4a9a20" strokeWidth="18"
                  strokeDasharray={donut((cropDemand/total)*100)}
                  strokeDashoffset="0" strokeLinecap="butt"
                  transform="rotate(-90 50 50)"/>
                {/* Soil deficit - amber */}
                <circle cx="50" cy="50" r={r} fill="none" stroke="#d4a017" strokeWidth="18"
                  strokeDasharray={donut((soilDeficit/total)*100)}
                  strokeDashoffset={`-${(cropDemand/total)*circ}`}
                  strokeLinecap="butt"
                  transform="rotate(-90 50 50)"/>
                {/* Evaporation - blue */}
                <circle cx="50" cy="50" r={r} fill="none" stroke="#378ADD" strokeWidth="18"
                  strokeDasharray={donut((evaporation/total)*100)}
                  strokeDashoffset={`-${((cropDemand+soilDeficit)/total)*circ}`}
                  strokeLinecap="butt"
                  transform="rotate(-90 50 50)"/>
                {/* Reserve - dark */}
                <circle cx="50" cy="50" r={r} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="18"
                  strokeDasharray={donut((reserve/total)*100)}
                  strokeDashoffset={`-${((cropDemand+soilDeficit+evaporation)/total)*circ}`}
                  strokeLinecap="butt"
                  transform="rotate(-90 50 50)"/>
                <text x="50" y="46" textAnchor="middle" fill="#c8f090" fontSize="9" fontWeight="500">{moisture}%</text>
                <text x="50" y="57" textAnchor="middle" fill="#6fa84a" fontSize="7">moisture</text>
              </svg>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "4px" }}>
              {[
                { color: "#4a9a20", label: "Crop demand", val: `${cropDemand}` },
                { color: "#d4a017", label: "Soil deficit", val: `${soilDeficit}` },
                { color: "#378ADD", label: "Evaporation", val: `${evaporation}` },
                { color: "rgba(255,255,255,0.2)", label: "Reserve", val: `${reserve}` }
              ].map(l => (
                <div key={l.label} style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                  <div style={{ width: "8px", height: "8px", borderRadius: "2px", background: l.color, flexShrink: 0 }}></div>
                  <span style={{ fontSize: "10px", color: "#6fa84a" }}>{l.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Weekly temperature trend */}
          <div style={card}>
            <p style={{ fontSize: "11px", fontWeight: 500, color: "#6fa84a", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "12px" }}>
              📈 Weekly trend
            </p>
            <svg viewBox="0 0 140 80" width="100%" height="80" style={{ overflow: "visible" }}>
              <defs>
                <linearGradient id="lineGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#4a9a20" stopOpacity="0.3"/>
                  <stop offset="100%" stopColor="#4a9a20" stopOpacity="0"/>
                </linearGradient>
              </defs>
              {/* Grid lines */}
              {[0,1,2,3].map(i => (
                <line key={i} x1="0" y1={i*20} x2="140" y2={i*20} stroke="rgba(255,255,255,0.04)" strokeWidth="0.5"/>
              ))}
              {/* Area fill */}
              <path
                d={`M ${weekData.map((v, i) => `${i*20},${70 - (v/maxWeek)*60}`).join(" L ")} L 120,70 L 0,70 Z`}
                fill="url(#lineGrad)"/>
              {/* Line */}
              <polyline
                points={weekData.map((v, i) => `${i*20},${70 - (v/maxWeek)*60}`).join(" ")}
                fill="none" stroke="#4a9a20" strokeWidth="1.5" strokeLinejoin="round"/>
              {/* Dots */}
              {weekData.map((v, i) => (
                <circle key={i} cx={i*20} cy={70 - (v/maxWeek)*60} r="2.5" fill="#4a9a20"/>
              ))}
            </svg>
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: "4px" }}>
              {weekDays.map(d => (
                <span key={d} style={{ fontSize: "9px", color: "#4a7a30" }}>{d}</span>
              ))}
            </div>
            <p style={{ fontSize: "12px", color: "#c8f090", marginTop: "8px", textAlign: "right" }}>
              {temp.toFixed(1)}°C today
            </p>
          </div>
        </div>

        {/* Row 2: Live weather stats */}
        <div style={{ ...card, marginBottom: "12px" }}>
          <p style={{ fontSize: "11px", fontWeight: 500, color: "#6fa84a", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "12px" }}>
            🌤️ Live weather · {result.city}
            {condition && <span style={{ fontWeight: 400, textTransform: "capitalize", marginLeft: "8px", color: "#a8d878" }}>· {condition}</span>}
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "8px" }}>
            {[
              { icon: "🌡️", val: `${temp.toFixed(1)}°C`, lbl: "Temperature", color: "#f0c060" },
              { icon: "💧", val: `${humidity}%`,          lbl: "Humidity",    color: "#4a9a20" },
              { icon: "🌧️", val: `${rainProb}%`,          lbl: "Rain chance", color: "#378ADD" }
            ].map(w => (
              <div key={w.lbl} style={{ background: "rgba(255,255,255,0.04)", border: "0.5px solid rgba(180,220,80,0.1)", borderRadius: "10px", padding: "12px 8px", textAlign: "center" }}>
                <div style={{ fontSize: "18px", marginBottom: "4px" }}>{w.icon}</div>
                <div style={{ fontSize: "20px", fontWeight: 500, color: w.color }}>{w.val}</div>
                <div style={{ fontSize: "10px", color: "#6fa84a", marginTop: "2px" }}>{w.lbl}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Row 3: Rain probability curve chart */}
        <div style={{ ...card, marginBottom: "12px" }}>
          <p style={{ fontSize: "11px", fontWeight: 500, color: "#6fa84a", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "14px" }}>
            🌧️ Rain probability — next 24h
          </p>
          <svg viewBox="0 0 280 80" width="100%" height="80">
            <defs>
              <linearGradient id="rainGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#378ADD" stopOpacity="0.35"/>
                <stop offset="100%" stopColor="#378ADD" stopOpacity="0.02"/>
              </linearGradient>
            </defs>
            {/* Grid */}
            {[0,20,40,60].map(v => (
              <g key={v}>
                <line x1="0" y1={70 - (v/maxRain)*60} x2="280" y2={70 - (v/maxRain)*60} stroke="rgba(255,255,255,0.04)" strokeWidth="0.5"/>
                <text x="2" y={68 - (v/maxRain)*60} fill="#4a7a30" fontSize="7">{v}%</text>
              </g>
            ))}
            {/* Area */}
            <path
              d={`M 20,70 ${rainCurve.map((v, i) => `L ${20 + i*37},${70 - (v/maxRain)*60}`).join(" ")} L ${20+7*37},70 Z`}
              fill="url(#rainGrad)"/>
            {/* Curve */}
            <polyline
              points={rainCurve.map((v, i) => `${20 + i*37},${70 - (v/maxRain)*60}`).join(" ")}
              fill="none" stroke="#378ADD" strokeWidth="2" strokeLinejoin="round"/>
            {/* Dots */}
            {rainCurve.map((v, i) => (
              <circle key={i} cx={20 + i*37} cy={70 - (v/maxRain)*60} r="2.5" fill="#378ADD"/>
            ))}
          </svg>
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: "4px", paddingLeft: "16px", paddingRight: "8px" }}>
            {["6AM","9AM","12PM","3PM","6PM","9PM","12AM","4AM"].map(t => (
              <span key={t} style={{ fontSize: "9px", color: "#4a7a30" }}>{t}</span>
            ))}
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "10px" }}>
            <span style={{ fontSize: "12px", color: "#a8d878" }}>Peak probability</span>
            <span style={{ fontSize: "16px", fontWeight: 500, color: rainProb > 60 ? "#90c8f0" : "#c8f090" }}>{rainProb}%</span>
          </div>
        </div>

        {/* Row 4: Soil moisture + Humidity gauges */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "12px" }}>

          {/* Soil moisture bar */}
          <div style={{ background: "rgba(180,120,0,0.1)", border: "0.5px solid rgba(200,150,0,0.25)", borderRadius: "14px", padding: "16px" }}>
            <p style={{ fontSize: "11px", fontWeight: 500, color: "#c8a040", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "10px" }}>
              🏔️ Soil moisture
            </p>
            <div style={{ background: "rgba(100,60,0,0.2)", borderRadius: "20px", height: "10px", overflow: "hidden", marginBottom: "6px" }}>
              <div style={{ background: "linear-gradient(90deg,#8B4513,#D4A017)", height: "10px", borderRadius: "20px", width: `${moisture}%`, transition: "width 0.6s" }} />
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "10px", color: "#8a6030", marginBottom: "10px" }}>
              <span>0%</span>
              <span style={{ color: "#d4a017", fontWeight: 500 }}>{moisture}%</span>
              <span>100%</span>
            </div>
            <div style={{ background: "rgba(0,0,0,0.2)", borderRadius: "8px", padding: "8px", textAlign: "center" }}>
              <div style={{ fontSize: "11px", color: "#8a6030", marginBottom: "2px" }}>Status</div>
              <div style={{ fontSize: "13px", color: "#d4a017", fontWeight: 500 }}>
                {moisture < 30 ? "⚠️ Critical low" : moisture < 60 ? "✅ Moderate" : "💦 High"}
              </div>
            </div>
          </div>

          {/* Humidity gauge */}
          <div style={card}>
            <p style={{ fontSize: "11px", fontWeight: 500, color: "#6fa84a", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "8px" }}>
              💧 Humidity
            </p>
            <div style={{ display: "flex", justifyContent: "center" }}>
              <svg viewBox="0 0 100 100" width="100" height="100">
                <circle cx="50" cy="50" r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="14" transform="rotate(-90 50 50)"/>
                <circle cx="50" cy="50" r={r} fill="none" stroke="#4a9a20" strokeWidth="14"
                  strokeDasharray={donut(humidity)} strokeLinecap="round" transform="rotate(-90 50 50)"/>
                <text x="50" y="47" textAnchor="middle" fill="#c8f090" fontSize="14" fontWeight="500">{humidity}%</text>
                <text x="50" y="58" textAnchor="middle" fill="#6fa84a" fontSize="7">humidity</text>
              </svg>
            </div>
          </div>
        </div>

        {/* Buttons */}
        <button onClick={() => router.push("/predict")}
          style={{ width: "100%", background: "#1a5c10", border: "0.5px solid #4a9a20", borderRadius: "12px", padding: "14px", fontSize: "15px", fontWeight: 500, color: "#c8f090", cursor: "pointer", marginBottom: "8px" }}>
          🔄 New Prediction
        </button>
        <button onClick={() => router.push("/")}
          style={{ width: "100%", background: "transparent", border: "0.5px solid rgba(255,255,255,0.08)", borderRadius: "12px", padding: "12px", fontSize: "14px", color: "#6fa84a", cursor: "pointer" }}>
          ← Back to home
        </button>

      </div>
    </div>
  )
}