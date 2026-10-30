# 🌱 AgriMind AI — Smart Irrigation Decision Platform

![AgriMind AI Banner](./assets/banner.png)

> An AI-powered irrigation decision-support platform that helps farmers optimize water usage using real-time sensor data, weather forecasts, and machine learning recommendations — accessible from any Android phone as a Progressive Web App.

[![Live Demo](https://img.shields.io/badge/Live%20Demo-Vercel-black?style=for-the-badge&logo=vercel)](https://agrimind-ai-yxdv.vercel.app/)
[![Backend API](https://img.shields.io/badge/Backend%20API-Render-46E3B7?style=for-the-badge&logo=render)](https://agrimind-ai-kr6q.onrender.com/docs)
[![GitHub](https://img.shields.io/badge/GitHub-Repository-181717?style=for-the-badge&logo=github)](https://github.com/pratiksha-12mishra/Agrimind-AI)
[![Demo Video](https://img.shields.io/badge/Demo-YouTube-FF0000?style=for-the-badge&logo=youtube)](https://youtu.be/1WktyCsI-6g?si=RoE3njD2MN1mDdLw)
![Made with Love](https://img.shields.io/badge/Made%20with-❤️%20in%20India-orange?style=for-the-badge)

---

## 📱 Install as a Mobile App (PWA)

AgriMind AI is a **Progressive Web App** — no App Store needed.

1. Open [agrimind-ai-yxdv.vercel.app](https://agrimind-ai-yxdv.vercel.app/) on **Android Chrome**
2. Tap the **"Add to Home Screen"** banner
3. Open from your home screen like a native app

---

## 🎬 Demo Video

[![AgriMind AI Demo](https://img.youtube.com/vi/1WktyCsI-6g/maxresdefault.jpg)](https://youtu.be/1WktyCsI-6g?si=RoE3njD2MN1mDdLw)

> Click the thumbnail above to watch the full demo

---

## 🎯 Problem We're Solving

Farmers often irrigate fields based on guesswork or fixed schedules rather than actual field conditions. This causes:

- **Over-irrigation** — wastes water, increases costs, reduces crop yield
- **Under-irrigation** — causes crop stress and productivity loss
- **Manual monitoring** — requires constant labor in the field
- **Weather blindness** — irrigation decisions ignore upcoming rainfall

AgriMind AI answers two questions every farmer needs:
> **When should I irrigate? How much water does my crop need?**

---

## ✨ Features

| Feature | Description |
|---|---|
| 🤖 **AI Irrigation Engine** | XGBoost model (98.5% accuracy) predicts irrigation need and water quantity |
| 🌤️ **Weather-Aware Decisions** | Checks rain forecast before recommending irrigation |
| 📊 **Live Dashboard** | Real-time soil moisture, temperature, humidity from ESP32 sensors |
| 🔔 **Smart Notifications** | Hourly automatic alerts when soil moisture drops critically low |
| 💧 **Motor Control** | Start/stop irrigation pump directly from phone |
| 🎙️ **Voice Assistant** | Ask farming questions in Hindi, Marathi, Bengali, Tamil, Gujarati, or English |
| 📈 **History & Analytics** | Water used today, this week, this month — and water saved vs baseline |
| 🌙 **Dark / Light Mode** | Farmer-friendly UI with full theme support |
| 🌐 **Multilingual UI** | Interface available in 6 Indian languages |
| 🔐 **Authentication** | Secure JWT-based user authentication |
| 📴 **Offline Resilience** | ESP32 buffers sensor data when WiFi drops, retransmits on reconnect |

---

## 🏗️ System Architecture

Android Phone (PWA — Next.js on Vercel)
│
│ HTTPS REST + WebSocket
▼
FastAPI Backend (Render)
│
├── PostgreSQL (Supabase) — users, sensor readings, predictions, notifications
├── OpenWeather API — live + 7-day weather forecast
├── Groq API (llama-3.3-70b) — multilingual voice assistant
├── Web Push (pywebpush) — phone notifications
└── MQTT (HiveMQ Cloud) ←→ ESP32
│
├── DHT11 — temperature + humidity
├── Soil Moisture Sensor — soil water content %
└── Relay Module — controls irrigation pump


---

## 🛠️ Tech Stack

### Frontend
- **Next.js 14** — React framework
- **Tailwind CSS** — styling
- **Recharts** — water usage charts
- **Web Speech API** — voice input/output
- **Web Push API** — push notifications
- **PWA** — installable on Android

### Backend
- **FastAPI** — REST API + WebSocket
- **PostgreSQL** (Supabase) — database
- **JWT Authentication** — secure user sessions
- **APScheduler** — hourly notification jobs
- **pywebpush** — Web Push notifications
- **paho-mqtt** — MQTT client for ESP32 communication
- **HiveMQ Cloud** — MQTT broker

### AI / ML
- **XGBoost** — irrigation classifier + water requirement regressor
- **Scikit-learn** — model pipeline
- **Groq API** (`llama-3.3-70b-versatile`) — voice assistant (6 languages)
- **OpenWeather API** — weather intelligence
- **15,000 sample** agronomy-informed synthetic training dataset

### IoT Hardware
- **ESP32** (NodeMCU-32S) — WiFi microcontroller
- **DHT11** — temperature + humidity sensor (GPIO14)
- **Resistive Soil Moisture Sensor** — soil water content (GPIO34)
- **5V Relay Module** (SRD-05VDC-SL-C) — pump switch (GPIO26)
- **Submersible pump** — irrigation demo
- **18650 Battery** — relay + pump power supply

---

## 📂 Project Structure

AgriMind-AI/
├── frontend/ # Next.js PWA
│ └── src/
│ ├── pages/
│ │ ├── index.tsx # Home / landing
│ │ ├── predict.tsx # Irrigation prediction form
│ │ ├── results.tsx # AI recommendation results
│ │ ├── dashboard.tsx # Live sensor dashboard
│ │ ├── weather.tsx # 7-day weather forecast
│ │ ├── history.tsx # Water usage analytics
│ │ ├── voice.tsx # Voice assistant
│ │ └── settings.tsx # Theme + language
│ └── public/
│ ├── manifest.json # PWA manifest
│ └── sw.js # Service worker (push notifications)
│
├── backend/
│ └── app/
│ ├── main.py # FastAPI app + routes
│ ├── engine/ # ML decision engine
│ │ ├── decision_engine.py
│ │ ├── train_model.py
│ │ ├── water_lookup.py
│ │ ├── explanation.py
│ │ ├── irrigation_classifier.pkl
│ │ └── water_regressor.pkl
│ ├── voice/
│ │ └── gemini_voice.py # Groq-powered voice assistant
│ ├── mqtt/
│ │ └── client.py # HiveMQ subscriber
│ ├── weather/
│ │ └── openweather_client.py
│ └── db/
│ ├── database.py
│ └── models.py
│
└── firmware/
└── agrimind_esp32/
└── agrimind_esp32.ino # Complete ESP32 firmware


---

## 🚀 Getting Started

### Prerequisites
- Python 3.10+
- Node.js 18+
- Arduino IDE 2.x (for ESP32 firmware)
- PostgreSQL database (Supabase free tier works)
- HiveMQ Cloud free account
- OpenWeather API key
- Groq API key (free at console.groq.com)

### Backend Setup

```bash
# Clone the repo
git clone https://github.com/pratiksha-12mishra/Agrimind-AI.git
cd Agrimind-AI/backend

# Create virtual environment
python -m venv venv
venv\Scripts\activate        # Windows
# source venv/bin/activate   # Mac/Linux

# Install dependencies
pip install -r requirements.txt

# Create .env file
cp .env.example .env
# Fill in your API keys

# Train the ML model
python -m app.engine.train_model

# Start the backend
uvicorn app.main:app --reload
```

Backend runs at `http://localhost:8000`
Swagger docs at `http://localhost:8000/docs`

### Frontend Setup

```bash
cd Agrimind-AI/frontend

# Install dependencies
npm install

# Create environment file
cp .env.example .env.local
# Fill in your backend URL and VAPID public key

# Start development server
npm run dev
```

Frontend runs at `http://localhost:3000`

### ESP32 Firmware Setup

1. Open `firmware/agrimind_esp32/agrimind_esp32.ino` in Arduino IDE
2. Install required libraries via Library Manager:
   - `PubSubClient` by Nick O'Leary
   - `DHT sensor library` by Adafruit
   - `Adafruit Unified Sensor` by Adafruit
   - `ArduinoJson` by Benoit Blanchon
3. Fill in your WiFi credentials at the top of the file
4. Select board: **ESP32 Dev Module**, port: your COM port
5. Upload

---

## ⚙️ Environment Variables

### Backend `.env`

```env
# Database
DATABASE_URL=postgresql://user:password@host/dbname

# APIs
OPENWEATHER_API_KEY=your_key_here
GROQ_API_KEY=gsk_your_key_here

# MQTT (HiveMQ Cloud)
MQTT_BROKER=your_cluster.hivemq.cloud
MQTT_PORT=8883
MQTT_USERNAME=your_username
MQTT_PASSWORD=your_password

# Web Push
VAPID_PRIVATE_KEY=your_vapid_private_key
VAPID_EMAIL=mailto:your@email.com

# JWT
SECRET_KEY=your_jwt_secret
```

### Frontend `.env.local`

```env
NEXT_PUBLIC_API_URL=https://agrimind-ai-kr6q.onrender.com
NEXT_PUBLIC_VAPID_PUBLIC_KEY=your_vapid_public_key
```

---

## 🤖 ML Model Details

The irrigation decision engine uses two XGBoost models:

| Model | Task | Performance |
|---|---|---|
| `irrigation_classifier.pkl` | Should I irrigate? (Yes/No) | **98.5% accuracy** |
| `water_regressor.pkl` | How much water? (L/m²) | **0.41 L/m² MAE** |

**Training data:** 15,000 samples generated using established agronomic relationships — soil moisture deficit, evapotranspiration rates, rain probability, and crop-specific water requirements.

**Crops supported:** Wheat, Rice, Cotton, Maize, Sugarcane, Soybean, Groundnut, Potato, Tomato, Onion, Chickpea, Mustard

---

## 📡 API Reference

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/health` | Health check |
| `POST` | `/auth/register` | Register new user |
| `POST` | `/auth/login` | Login + get JWT token |
| `GET` | `/weather/{city}` | Current + 7-day forecast |
| `POST` | `/recommend` | Get irrigation recommendation |
| `POST` | `/voice` | Voice assistant query |
| `WS` | `/ws/sensor` | Real-time sensor stream |
| `POST` | `/motor` | Control irrigation pump |
| `GET` | `/notifications` | Notification history |
| `POST` | `/notifications/push/subscribe` | Register for push notifications |

Full interactive documentation: [agrimind-ai-kr6q.onrender.com/docs](https://agrimind-ai-kr6q.onrender.com/docs)

---

## 🔌 ESP32 Wiring

| Component | ESP32 Pin |
|---|---|
| DHT11 Signal (`S`) | GPIO 14 |
| DHT11 Power (`+`) | VIN (5V) |
| Soil Moisture (`AO`) | GPIO 34 |
| Soil Moisture (`VCC`) | 3V3 |
| Relay (`IN`) | GPIO 26 |
| Relay (`VCC`) | VIN (5V) — from battery |

**Pump wiring via relay screw terminals:**

18650 Battery (+) → COM terminal
Pump green wire (+) → NO terminal
Pump white wire (-) → Battery (-) / GND


---

## 🗺️ Roadmap

- [x] AI irrigation decision engine (XGBoost)
- [x] Real-time sensor dashboard
- [x] Weather-aware recommendations
- [x] Motor control via phone
- [x] Multilingual voice assistant (6 languages)
- [x] Push notifications
- [x] JWT authentication
- [x] PWA (installable on Android)
- [ ] Real IoT sensor integration at scale
- [ ] Crop disease detection (computer vision)
- [ ] Digital twin farm simulation
- [ ] Satellite-based crop monitoring
- [ ] Reinforcement learning optimization

---

## 👥 Team

**Team Semicolon** — Biothon 2026, Marwadi University

| Name | Role | GitHub |
|---|---|---|
| Pratiksha Mishra | Team Lead · Frontend · ML | [@pratiksha-12mishra](https://github.com/pratiksha-12mishra) |
| Harsh Kumar Urmaliya | IoT · ML Engine · Voice AI | [@harsh-1418](https://github.com/harsh-1418) |
| Mradanshi Sahu | Backend · API · DevOps | [@mradanshi](https://github.com/mradanshi) |

---

## 📄 License

This project is licensed under the MIT License — see [LICENSE](./LICENSE) for details.

---

## 🙏 Acknowledgements

- [OpenWeather API](https://openweathermap.org/) — weather data
- [Groq](https://groq.com/) — fast LLM inference for voice assistant
- [HiveMQ](https://www.hivemq.com/) — MQTT broker
- [Supabase](https://supabase.com/) — PostgreSQL hosting
- [Vercel](https://vercel.com/) — frontend deployment
- [Render](https://render.com/) — backend deployment

---

<p align="center">Built with ❤️ for Indian farmers · Team Semicolon · Biothon 2026</p>
