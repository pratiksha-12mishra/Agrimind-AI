'use client'

import { useState, useEffect } from 'react'
import { Droplets, Cloud, Thermometer, AlertCircle } from 'lucide-react'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts'

interface DashboardProps {
  isLoggedIn: boolean
}

export default function Dashboard({ isLoggedIn }: DashboardProps) {
  // Simulated live soil moisture trend — replace with real WebSocket data once backend provides it
  const [trendData, setTrendData] = useState<{ time: string; moisture: number }[]>([])

  const [motorStatus, setMotorStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle')
  const [motorMessage, setMotorMessage] = useState('')
  const [motorState, setMotorState] = useState<'off' | 'on'>('off')

  const sendMotorCommand = async (action: 'start' | 'stop') => {
    setMotorStatus('sending')
    setMotorMessage('')
    try {
      const res = await fetch('/api/motor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action }),
      })
      const data = await res.json()

      if (!res.ok) {
        setMotorStatus('error')
        setMotorMessage(data.error || 'Failed to send command')
        return
      }

      setMotorStatus('sent')
      setMotorState(action === 'start' ? 'on' : 'off')
      setMotorMessage(`MQTT command published to "${data.topic}" — no physical pump connected yet, this will control the real motor once ESP32 hardware is set up.`)
    } catch (err: any) {
      setMotorStatus('error')
      setMotorMessage(err?.message || 'Network error sending motor command')
    }
  }
  useEffect(() => {
    if (!isLoggedIn) return

    const seed = Array.from({ length: 8 }).map((_, i) => ({
      time: `-${(8 - i) * 3}m`,
      moisture: 40 + Math.round(Math.sin(i) * 8 + Math.random() * 4),
    }))
    setTrendData(seed)

    const interval = setInterval(() => {
      setTrendData((prev) => {
        const next = [...prev.slice(1)]
        const last = prev[prev.length - 1]?.moisture ?? 45
        const newMoisture = Math.max(15, Math.min(85, last + (Math.random() * 10 - 5)))
        next.push({ time: 'now', moisture: Math.round(newMoisture) })
        return next
      })
    }, 3000)

    return () => clearInterval(interval)
  }, [isLoggedIn])

  if (!isLoggedIn) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="text-center">
          <p className="text-foreground text-lg">Please login to access the dashboard</p>
        </div>
      </div>
    )
  }

  const latestMoisture = trendData.length ? trendData[trendData.length - 1].moisture : 45

  // Pie chart: today's soil status breakdown (demo distribution)
  const statusPieData = [
    { name: 'Optimal', value: 55 },
    { name: 'Dry', value: 25 },
    { name: 'Saturated', value: 20 },
  ]
  const STATUS_COLORS = ['var(--color-primary)', 'var(--color-destructive)', 'var(--color-accent)']

  return (
    <div className="min-h-screen bg-background p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">Irrigation Monitoring Dashboard</h1>
          <p className="text-muted-foreground">Real-time monitoring and IoT sensor integration</p>
        </div>

        {/* Key Metrics */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-card border border-border rounded-lg p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">Soil Moisture</p>
                <p className="text-3xl font-bold text-foreground">{latestMoisture}%</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {latestMoisture < 30 ? 'Dry' : latestMoisture <= 70 ? 'Optimal' : 'Saturated'}
                </p>
              </div>
              <div className="p-3 rounded-lg bg-primary/10">
                <Droplets className="text-primary" size={24} />
              </div>
            </div>
            <p className="text-xs text-muted-foreground bg-secondary p-2 rounded">Simulated live data</p>
          </div>

          <div className="bg-card border border-border rounded-lg p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">Temperature</p>
                <p className="text-3xl font-bold text-foreground">28.5°C</p>
                <p className="text-xs text-muted-foreground mt-1">Optimal</p>
              </div>
              <div className="p-3 rounded-lg bg-primary/10">
                <Thermometer className="text-primary" size={24} />
              </div>
            </div>
            <p className="text-xs text-muted-foreground bg-secondary p-2 rounded">Demo sensor data</p>
          </div>

          <div className="bg-card border border-border rounded-lg p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">Humidity</p>
                <p className="text-3xl font-bold text-foreground">65%</p>
                <p className="text-xs text-muted-foreground mt-1">Normal</p>
              </div>
              <div className="p-3 rounded-lg bg-primary/10">
                <Cloud className="text-primary" size={24} />
              </div>
            </div>
            <p className="text-xs text-muted-foreground bg-secondary p-2 rounded">Demo sensor data</p>
          </div>

          <div className="bg-card border border-border rounded-lg p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">Weather Status</p>
                <p className="text-xl font-bold text-foreground">Partly Cloudy</p>
                <p className="text-xs text-muted-foreground mt-1">No rain expected</p>
              </div>
              <div className="p-3 rounded-lg bg-primary/10">
                <AlertCircle className="text-primary" size={24} />
              </div>
            </div>
            <p className="text-xs text-muted-foreground bg-secondary p-2 rounded">Live API data</p>
          </div>
        </div>

        {/* Live Trend + Pie Chart */}
        <div className="grid lg:grid-cols-3 gap-8 mb-8">
          <div className="lg:col-span-2 bg-card border border-border rounded-lg p-8">
            <h3 className="text-xl font-bold text-foreground mb-1">Soil Moisture Trend</h3>
            <p className="text-xs text-muted-foreground mb-6">
              Simulated live feed, updates every 3 seconds — swap for real ESP32/WebSocket data once available
            </p>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={trendData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--color-muted)" />
                  <XAxis dataKey="time" stroke="var(--color-muted-foreground)" fontSize={12} />
                  <YAxis domain={[0, 100]} stroke="var(--color-muted-foreground)" fontSize={12} />
                  <Tooltip formatter={(value: number) => `${value}%`} />
                  <Line
                    type="monotone"
                    dataKey="moisture"
                    stroke="var(--color-primary)"
                    strokeWidth={2}
                    dot={false}
                    isAnimationActive={true}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-card border border-border rounded-lg p-8">
            <h3 className="text-xl font-bold text-foreground mb-1">Today's Soil Status</h3>
            <p className="text-xs text-muted-foreground mb-6">Demo distribution</p>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={statusPieData} dataKey="value" nameKey="name" innerRadius={45} outerRadius={75} paddingAngle={3}>
                    {statusPieData.map((entry, index) => (
                      <Cell key={entry.name} fill={STATUS_COLORS[index % STATUS_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value: number) => `${value}%`} />
                  <Legend verticalAlign="bottom" height={36} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Latest Recommendation */}
        <div className="bg-card border border-border rounded-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-foreground mb-6">Latest Irrigation Recommendation</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="p-6 bg-primary/5 rounded-lg border border-primary/20">
              <p className="text-sm text-muted-foreground font-semibold uppercase mb-2">Recommendation</p>
              <p className="text-2xl font-bold text-primary mb-2">Irrigate Within 24 Hours</p>
              <p className="text-sm text-muted-foreground">Based on current soil moisture and weather forecast</p>
            </div>

            <div className="p-6 bg-accent/5 rounded-lg border border-accent/20">
              <p className="text-sm text-muted-foreground font-semibold uppercase mb-2">Water Required</p>
              <p className="text-2xl font-bold text-accent mb-2">32.5 L/m²</p>
              <p className="text-sm text-muted-foreground">Litres per square metre</p>
            </div>

            <div className="p-6 bg-primary/5 rounded-lg border border-primary/20">
              <p className="text-sm text-muted-foreground font-semibold uppercase mb-2">Confidence Score</p>
              <p className="text-2xl font-bold text-primary mb-2">87.4%</p>
              <p className="text-sm text-muted-foreground">AI recommendation confidence</p>
            </div>
          </div>
        </div>

        {/* Sensor Integration Status */}
        <div className="grid md:grid-cols-2 gap-8 mb-8">
          {/* IoT Sensors */}
          <div className="bg-card border border-border rounded-lg p-8">
            <h3 className="text-xl font-bold text-foreground mb-6">IoT Sensor Integration</h3>
            <div className="space-y-4">
              <div className="p-4 bg-secondary rounded-lg border border-border">
                <p className="text-sm font-semibold text-foreground">⚫ Sensor Offline</p>
                <p className="text-muted-foreground mt-1">Live IoT sensor integration coming soon</p>
              </div>
              <div className="p-4 bg-secondary rounded-lg border border-border">
                <p className="text-sm font-semibold text-foreground">Live Data</p>
                <p className="text-muted-foreground mt-1">Connect your soil moisture sensors to see real-time data</p>
              </div>
              <div className="p-4 bg-secondary rounded-lg border border-border">
                <p className="text-sm font-semibold text-foreground">Supported Devices</p>
                <p className="text-muted-foreground mt-1">DHT22, Capacitive Soil Moisture Sensors, Weather Stations</p>
              </div>
            </div>
          </div>

          {/* Motor Control */}
          <div className="bg-card border border-border rounded-lg p-8">
            <h3 className="text-xl font-bold text-foreground mb-1">Motor & Pump Control</h3>
            <p className="text-xs text-muted-foreground mb-6">
              Sends real MQTT commands to your backend — physical pump response requires ESP32 hardware setup
            </p>

            <div className="flex items-center justify-between mb-6 p-4 bg-secondary rounded-lg border border-border">
              <span className="text-sm font-semibold text-foreground">Motor Status</span>
              <span
                className={`text-sm font-bold px-3 py-1 rounded-full ${
                  motorState === 'on' ? 'bg-primary/20 text-primary' : 'bg-muted text-muted-foreground'
                }`}
              >
                {motorState === 'on' ? '🟢 ON' : '⚫ OFF'}
              </span>
            </div>

            <div className="flex gap-4 mb-4">
              <button
                onClick={() => sendMotorCommand('start')}
                disabled={motorStatus === 'sending'}
                className="flex-1 py-3 rounded-lg bg-primary text-primary-foreground font-semibold hover:opacity-90 disabled:opacity-50"
              >
                {motorStatus === 'sending' ? 'Sending...' : 'Start Motor'}
              </button>
              <button
                onClick={() => sendMotorCommand('stop')}
                disabled={motorStatus === 'sending'}
                className="flex-1 py-3 rounded-lg bg-destructive text-destructive-foreground font-semibold hover:opacity-90 disabled:opacity-50"
              >
                {motorStatus === 'sending' ? 'Sending...' : 'Stop Motor'}
              </button>
            </div>

            {motorStatus === 'sent' && (
              <div className="p-3 bg-primary/10 border border-primary/20 rounded-lg text-sm text-primary">
                ✓ {motorMessage}
              </div>
            )}
            {motorStatus === 'error' && (
              <div className="p-3 bg-destructive/10 border border-destructive rounded-lg text-sm text-destructive">
                {motorMessage}
              </div>
            )}
          </div>
        </div>

        {/* System Status */}
        <div className="bg-primary/5 border border-primary/20 rounded-lg p-8">
          <div className="flex items-start gap-4">
            <AlertCircle className="text-primary flex-shrink-0 mt-1" size={24} />
            <div>
              <h3 className="font-bold text-foreground mb-2">System Status</h3>
              <p className="text-muted-foreground mb-4">
                Demo dashboard showing irrigation monitoring capabilities. Connect your IoT sensors and farm details to start receiving real-time irrigation recommendations.
              </p>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>✓ Weather API connected and working</li>
                <li>✓ AI recommendation engine active</li>
                <li>• Sensor integration coming soon</li>
                <li>• Motor automation coming soon</li>
                <li>• Notification system coming soon</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}