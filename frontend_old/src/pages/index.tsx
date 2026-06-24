import { useRouter } from "next/router"
import { useState } from "react"
import Image from "next/image"

const pageStyle: React.CSSProperties = { minHeight: "100vh", background: "#0d1f0d" }
const card: React.CSSProperties = { background: "rgba(255,255,255,0.05)", border: "0.5px solid rgba(180,220,80,0.18)", borderRadius: "14px", padding: "16px", marginBottom: "10px" }
const sectionLabel: React.CSSProperties = { fontSize: "11px", fontWeight: 500, color: "#6fa84a", textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: "8px" }

export default function Home() {
  const router = useRouter()
  const [tab, setTab] = useState(1)

  return (
    <div style={pageStyle}>

      {/* Nav */}
      <nav style={{ display: "flex", alignItems: "center", padding: "14px 20px", background: "rgba(10,26,10,0.95)", borderBottom: "0.5px solid rgba(180,220,80,0.1)" }}>
        <span style={{ color: "#a8d878", fontSize: "16px", fontWeight: 500 }}>🌱 AgriMind AI</span>
        <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: "6px" }}>
          <div style={{ width: "7px", height: "7px", borderRadius: "50%", background: "#4caf50" }}></div>
          <span style={{ fontSize: "11px", color: "#6fa84a" }}>Live · Biothon 2026</span>
        </div>
      </nav>

      {/* Hero with image */}
      <div style={{ position: "relative", height: "200px", overflow: "hidden" }}>
        <Image
          src="/assets/hero.jpg"
          alt="Smart irrigation farm"
          fill
          style={{ objectFit: "cover", opacity: 0.5 }}
          priority
        />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(10,26,10,0.3) 0%, rgba(10,26,10,0.85) 100%)" }}></div>
        <div style={{ position: "relative", padding: "18px 20px", height: "100%", display: "flex", flexDirection: "column", justifyContent: "flex-end" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: "5px", background: "rgba(180,220,80,0.12)", border: "0.5px solid rgba(180,220,80,0.25)", borderRadius: "20px", padding: "3px 10px", fontSize: "10px", color: "#a8d878", marginBottom: "8px", width: "fit-content" }}>
            🌱 Smart Irrigation Platform
          </div>
          <h1 style={{ fontSize: "20px", fontWeight: 500, color: "#e8f5c8", lineHeight: 1.25, marginBottom: "4px" }}>
            AgriMind AI — Smarter Farms
          </h1>
          <p style={{ fontSize: "12px", color: "#6fa84a" }}>Soil · Weather · AI · Together</p>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", background: "rgba(10,26,10,0.95)", borderBottom: "0.5px solid rgba(180,220,80,0.15)" }}>
        {["About", "Menu"].map((t, i) => (
          <button key={t} onClick={() => setTab(i + 1)}
            style={{ flex: 1, padding: "11px 8px", fontSize: "13px", textAlign: "center", color: tab === i + 1 ? "#c8f090" : "#6fa84a", background: "transparent", border: "none", borderBottom: tab === i + 1 ? "2px solid #639922" : "2px solid transparent", cursor: "pointer" }}>
            {t}
          </button>
        ))}
      </div>

      {/* Tab 1 — About */}
      {tab === 1 && (
        <div style={{ padding: "16px", maxWidth: "480px", margin: "0 auto" }}>

          <p style={sectionLabel}>What is AgriMind AI?</p>
          <div style={card}>
            <p style={{ fontSize: "13px", color: "#a8c878", lineHeight: 1.7 }}>
              AgriMind AI is a smart irrigation decision platform built for Indian farmers. It analyzes your soil moisture, crop type, and live weather forecast to tell you <span style={{ color: "#c8f090", fontWeight: 500 }}>exactly when to irrigate and how much water to use</span> — no guesswork, no wasted water.
            </p>
          </div>

          <p style={sectionLabel}>The problem we solve</p>
          <div style={card}>
            {[
              "Farmers irrigate on fixed schedules — not based on actual field conditions",
              "Over-irrigation wastes water and reduces crop yield",
              "Unpredictable weather makes manual decisions unreliable"
            ].map((p, i) => (
              <div key={i} style={{ display: "flex", gap: "10px", alignItems: "flex-start", marginBottom: i < 2 ? "10px" : 0 }}>
                <span style={{ fontSize: "14px", flexShrink: 0, marginTop: "2px" }}>❌</span>
                <p style={{ fontSize: "13px", color: "#a8c878", lineHeight: 1.6 }}>{p}</p>
              </div>
            ))}
          </div>

          {/* Farm image */}
          <div style={{ borderRadius: "12px", overflow: "hidden", marginBottom: "12px", height: "140px", position: "relative", border: "0.5px solid rgba(180,220,80,0.15)" }}>
            <Image src="/assets/farm.jpg" alt="Farm field" fill style={{ objectFit: "cover", opacity: 0.75 }} />
            <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, transparent 50%, rgba(10,26,10,0.7) 100%)" }}></div>
            <div style={{ position: "absolute", bottom: "10px", left: "12px", fontSize: "11px", color: "#a8d878" }}>🌾 Smart irrigation in action</div>
          </div>

          <p style={sectionLabel}>How it works — 3 steps</p>
          <div style={card}>
            {[
              { n: "1", title: "Enter field details", desc: "Select your crop, growth stage, soil moisture level, and your city location" },
              { n: "2", title: "AI fetches live weather", desc: "Our system calls OpenWeather API to get real temperature, humidity, and rain probability" },
              { n: "3", title: "Get your decision", desc: "The engine combines all data: Irrigate Now, Delay, or Irrigate Within 24 Hours — with exact water quantity" }
            ].map((s, i) => (
              <div key={i} style={{ display: "flex", gap: "10px", marginBottom: i < 2 ? "14px" : 0 }}>
                <div style={{ width: "28px", height: "28px", borderRadius: "50%", background: "rgba(180,220,80,0.12)", border: "0.5px solid rgba(180,220,80,0.25)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "12px", color: "#c8f090", flexShrink: 0 }}>{s.n}</div>
                <div>
                  <p style={{ fontSize: "13px", fontWeight: 500, color: "#c8f090", marginBottom: "2px" }}>{s.title}</p>
                  <p style={{ fontSize: "12px", color: "#a8c878", lineHeight: 1.6 }}>{s.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <p style={sectionLabel}>Key features</p>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px", marginBottom: "12px" }}>
            {[
              { icon: "💧", title: "Smart irrigation", desc: "Tells you when and how much" },
              { icon: "🌦️", title: "Weather aware", desc: "Live forecast prevents waste" },
              { icon: "🌾", title: "Crop specific", desc: "Wheat, rice, cotton logic" },
              { icon: "📊", title: "History", desc: "Review past predictions" }
            ].map(f => (
              <div key={f.title} style={{ background: "rgba(255,255,255,0.04)", border: "0.5px solid rgba(180,220,80,0.12)", borderRadius: "12px", padding: "12px 10px", textAlign: "center" }}>
                <div style={{ fontSize: "22px", marginBottom: "6px" }}>{f.icon}</div>
                <p style={{ fontSize: "12px", fontWeight: 500, color: "#c8f090", marginBottom: "3px" }}>{f.title}</p>
                <p style={{ fontSize: "11px", color: "#6fa84a", lineHeight: 1.5 }}>{f.desc}</p>
              </div>
            ))}
          </div>

          {/* Architecture image */}
          <div style={{ borderRadius: "12px", overflow: "hidden", marginBottom: "12px", height: "120px", position: "relative", border: "0.5px solid rgba(180,220,80,0.15)" }}>
            <Image src="/assets/architecture.jpg" alt="System architecture" fill style={{ objectFit: "cover", opacity: 0.7 }} />
            <div style={{ position: "absolute", inset: 0, background: "rgba(10,26,10,0.4)" }}></div>
            <div style={{ position: "absolute", bottom: "10px", left: "12px", fontSize: "11px", color: "#a8d878" }}>⚙️ Next.js · FastAPI · OpenWeather · SQLite</div>
          </div>

          <p style={sectionLabel}>Built by Team Semicolon</p>
          {[
            { init: "M", name: "Mradanshi", role: "Backend & Weather Integration" },
            { init: "H", name: "Harsh", role: "Decision Engine & Data" },
            { init: "P", name: "Pratiksha", role: "Frontend & Demo Lead" }
          ].map(m => (
            <div key={m.name} style={{ display: "flex", alignItems: "center", gap: "10px", background: "rgba(255,255,255,0.04)", border: "0.5px solid rgba(180,220,80,0.12)", borderRadius: "10px", padding: "10px 12px", marginBottom: "8px" }}>
              <div style={{ width: "30px", height: "30px", borderRadius: "50%", background: "rgba(180,220,80,0.15)", border: "0.5px solid rgba(180,220,80,0.3)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "12px", color: "#c8f090", fontWeight: 500, flexShrink: 0 }}>{m.init}</div>
              <div>
                <p style={{ fontSize: "13px", color: "#c8f090", fontWeight: 500 }}>{m.name}</p>
                <p style={{ fontSize: "11px", color: "#6fa84a" }}>{m.role}</p>
              </div>
            </div>
          ))}

        </div>
      )}

      {/* Tab 2 — Menu */}
      {tab === 2 && (
        <div style={{ padding: "16px", maxWidth: "480px", margin: "0 auto" }}>

          <p style={{ ...sectionLabel, marginBottom: "12px" }}>What would you like to do?</p>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", marginBottom: "14px" }}>
            {[
              { icon: "🤖", title: "Get Prediction", desc: "Enter field details and get irrigation decision", route: "/predict", primary: true },
              { icon: "📊", title: "View Results",   desc: "See your last AI recommendation", route: "/results", primary: false },
              { icon: "🕐", title: "History",        desc: "All your past predictions", route: "/history", primary: false },
              { icon: "📬", title: "Contact Us",     desc: "Reach the Semicolon team", route: "#contact", primary: false }
            ].map(m => (
              <div key={m.title}
                onClick={() => m.route !== "#contact" && router.push(m.route)}
                style={{ background: m.primary ? "rgba(26,92,16,0.4)" : "rgba(255,255,255,0.05)", border: `0.5px solid ${m.primary ? "rgba(100,180,40,0.4)" : "rgba(180,220,80,0.18)"}`, borderRadius: "14px", padding: "16px 14px", cursor: "pointer", display: "flex", flexDirection: "column", gap: "6px" }}>
                <span style={{ fontSize: "24px" }}>{m.icon}</span>
                <p style={{ fontSize: "14px", fontWeight: 500, color: m.primary ? "#e8f5c8" : "#c8f090" }}>{m.title}</p>
                <p style={{ fontSize: "11px", color: "#6fa84a", lineHeight: 1.4 }}>{m.desc}</p>
              </div>
            ))}
          </div>

          {/* Irrigation image */}
          <div style={{ borderRadius: "12px", overflow: "hidden", marginBottom: "14px", height: "130px", position: "relative", border: "0.5px solid rgba(180,220,80,0.15)" }}>
            <Image src="/assets/hero.jpg" alt="Irrigation" fill style={{ objectFit: "cover", opacity: 0.6 }} />
            <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, transparent 40%, rgba(10,26,10,0.8) 100%)" }}></div>
            <div style={{ position: "absolute", bottom: "10px", left: "12px" }}>
              <p style={{ fontSize: "13px", fontWeight: 500, color: "#c8f090" }}>💧 Save up to 40% water</p>
              <p style={{ fontSize: "11px", color: "#a8d878" }}>With AI-powered irrigation decisions</p>
            </div>
          </div>

          <p id="contact" style={{ ...sectionLabel, marginBottom: "10px" }}>Contact us</p>
          <div style={{ background: "rgba(255,255,255,0.04)", border: "0.5px solid rgba(180,220,80,0.12)", borderRadius: "14px", padding: "16px", marginBottom: "12px" }}>
            {[
              { icon: "📧", label: "Email", val: "team.semicolon@agrimind.ai" },
              { icon: "🏆", label: "Hackathon", val: "Biothon 2026 · Team Semicolon" },
              { icon: "💻", label: "GitHub", val: "github.com/team-semicolon" }
            ].map((c, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: i < 2 ? "12px" : 0 }}>
                <div style={{ width: "32px", height: "32px", borderRadius: "8px", background: "rgba(180,220,80,0.1)", border: "0.5px solid rgba(180,220,80,0.2)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "15px", flexShrink: 0 }}>{c.icon}</div>
                <div>
                  <p style={{ fontSize: "11px", color: "#6fa84a", marginBottom: "2px" }}>{c.label}</p>
                  <p style={{ fontSize: "13px", color: "#a8d878", fontWeight: 500 }}>{c.val}</p>
                </div>
              </div>
            ))}
          </div>

          <p style={{ ...sectionLabel, marginBottom: "10px" }}>Future roadmap</p>
          <div style={{ background: "rgba(255,255,255,0.04)", border: "0.5px solid rgba(180,220,80,0.12)", borderRadius: "14px", padding: "14px" }}>
            {["🛰️ Satellite crop monitoring", "🎙️ Voice assistant for farmers", "🦠 Crop disease detection", "📡 Real IoT sensor integration", "🌐 Digital twin simulation"].map((f, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: i < 4 ? "8px" : 0, fontSize: "13px", color: "#a8c878" }}>
                <span style={{ fontSize: "10px", background: "rgba(180,220,80,0.08)", border: "0.5px solid rgba(180,220,80,0.15)", color: "#6fa84a", padding: "2px 7px", borderRadius: "10px" }}>Soon</span>
                {f}
              </div>
            ))}
          </div>

        </div>
      )}

    </div>
  )
}