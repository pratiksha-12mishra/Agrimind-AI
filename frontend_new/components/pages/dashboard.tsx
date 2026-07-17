'use client'

import { useState, useEffect } from 'react'
import { Droplets, Cloud, Thermometer, AlertCircle, Loader2 } from 'lucide-react'
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
import { authFetch } from '@/lib/auth'

interface DashboardProps {
  isLoggedIn: boolean
}

interface Farm {
  id: number
  name: string
  city: string
  crop: string
  growth_stage: string
  area: number
  soil_type: string
  irrigation_method: string
  device_id: string | null
  owner_id: number
}

const KNOWN_DEVICE_ID = 'agrimind_esp32_001' // confirmed by Mradanshi as the real device in use

export default function Dashboard({ isLoggedIn }: DashboardProps) {
  // Farm/device setup state
  const [farmLoading, setFarmLoading] = useState(true)
  const [farm, setFarm] = useState<Farm | null>(null)
  const [farms, setFarms] = useState<Farm[]>([])
  const [setupError, setSetupError] = useState<string | null>(null)
  const [creatingFarm, setCreatingFarm] = useState(false)
  const [claimingDevice, setClaimingDevice] = useState(false)
  const [newFarmName, setNewFarmName] = useState('Demo Farm')
  const [newFarmCity, setNewFarmCity] = useState('Jabalpur')

  // Sensor/dashboard state
  const [trendData, setTrendData] = useState<{ time: string; moisture: number }[]>([])
  const [sensorData, setSensorData] = useState<any>(null)
  const [sensorRaw, setSensorRaw] = useState<any>(null)
  const [sensorOnline, setSensorOnline] = useState(false)

  const [motorStatus, setMotorStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle')
  const [motorMessage, setMotorMessage] = useState('')
  const [motorState, setMotorState] = useState<'off' | 'on'>('off')

  // Step 1: check if the logged-in user already has a farm with a claimed device
  useEffect(() => {
    if (!isLoggedIn) return

    const checkFarms = async () => {
      setFarmLoading(true)
      setSetupError(null)
      try {
        const res = await authFetch('/api/farms/mine')
        const data = await res.json()

        if (!res.ok) {
          setSetupError(typeof data.error === 'string' ? data.error : JSON.stringify(data.error) || 'Could not claim device')
          setFarmLoading(false)
          return
        }

        setFarms(Array.isArray(data) ? data : [])
        const farmWithDevice = Array.isArray(data) ? data.find((f: Farm) => f.device_id) : null
        setFarm(farmWithDevice ?? null)
      } catch (err: any) {
        setSetupError(err?.message || 'Network error checking farms')
      } finally {
        setFarmLoading(false)
      }
    }

    checkFarms()
  }, [isLoggedIn])

  const handleCreateFarm = async () => {
    setCreatingFarm(true)
    setSetupError(null)
    try {
      const res = await authFetch('/api/farms', {
        method: 'POST',
        body: JSON.stringify({
          name: newFarmName,
          city: newFarmCity,
          crop: 'wheat',
          growth_stage: 'vegetative',
          area: 1.0,
          soil_type: 'loam',
          irrigation_method: 'drip',
        }),
      })
      const data = await res.json()
      if (!res.ok) {
        setSetupError(typeof data.error === 'string' ? data.error : JSON.stringify(data.error) || 'Could not claim device')
        setCreatingFarm(false)
        return
      }
      setFarms((prev) => [...prev, data])
      // Immediately claim the device on this new farm
      await handleClaimDevice(data.id)
    } catch (err: any) {
      setSetupError(err?.message || 'Network error creating farm')
    } finally {
      setCreatingFarm(false)
    }
  }

  const handleClaimDevice = async (farmId: number) => {
    setClaimingDevice(true)
    setSetupError(null)
    try {
      const res = await authFetch(`/api/farms/${farmId}/claim-device`, {
        method: 'POST',
        body: JSON.stringify({ device_id: KNOWN_DEVICE_ID }),
      })
      const data = await res.json()
      if (!res.ok) {
        setSetupError(typeof data.error === 'string' ? data.error : JSON.stringify(data.error) || 'Could not claim device')
        setClaimingDevice(false)
        return
      }
      // Re-fetch farms to get the updated device_id
      const refreshed = await authFetch('/api/farms/mine')
      const refreshedData = await refreshed.json()
      setFarms(Array.isArray(refreshedData) ? refreshedData : [])
      const farmWithDevice = Array.isArray(refreshedData) ? refreshedData.find((f: Farm) => f.device_id) : null
      setFarm(farmWithDevice ?? null)
    } catch (err: any) {
      setSetupError(err?.message || 'Network error claiming device')
    } finally {
      setClaimingDevice(false)
    }
  }

  // Step 2: once a device is claimed, poll real sensor data
  useEffect(() => {
    if (!isLoggedIn || !farm?.device_id) return

    const poll = async () => {
      try {
        const res = await fetch('/api/sensors/latest')
        const data = await res.json()
        setSensorRaw(data)

        if (!res.ok) {
          setSensorOnline(false)
          return
        }

        setSensorData(data)

        const lastSeen = data.last_seen ?? data.timestamp
        if (lastSeen) {
          const ageMs = Date.now() - new Date(lastSeen).getTime()
          setSensorOnline(ageMs < 5 * 60 * 1000)
        } else {
          setSensorOnline(true)
        }

        if (typeof data.soil_moisture === 'number') {
          setTrendData((prev) => {
            const next = [...prev.slice(-7)]
            next.push({ time: 'now', moisture: data.soil_moisture })
            return next
          })
        }
      } catch {
        setSensorOnline(false)
      }
    }

    poll()
    const interval = setInterval(poll, 5000)
    return () => clearInterval(interval)
  }, [isLoggedIn, farm?.device_id])

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
      setMotorMessage(`MQTT command published to "${data.topic}"`)
    } catch (err: any) {
      setMotorStatus('error')
      setMotorMessage(err?.message || 'Network error sending motor command')
    }
  }

  if (!isLoggedIn) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="text-center">
          <p className="text-foreground text-lg">Please login to access the dashboard</p>
        </div>
      </div>
    )
  }

  // Loading farm/device check
  if (farmLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="animate-spin text-primary mr-3" size={24} />
        <span className="text-muted-foreground">Checking your farm setup...</span>
      </div>
    )
  }

  // No device claimed yet — show setup flow
  if (!farm?.device_id) {
    const unclaimedFarm = farms.find((f) => !f.device_id)

    return (
      <div className="min-h-screen bg-background p-4 sm:p-6 lg:p-8">
        <div className="max-w-xl mx-auto">
          <h1 className="text-3xl font-bold text-foreground mb-2">Connect Your Sensor</h1>
          <p className="text-muted-foreground mb-8">
            One-time setup — link your ESP32 device to a farm to start seeing live data.
          </p>

          {setupError && (
            <div className="mb-6 bg-destructive/10 border border-destructive rounded-lg p-4 flex gap-3">
              <AlertCircle className="text-destructive flex-shrink-0" size={20} />
              <p className="text-sm text-destructive">{setupError}</p>
            </div>
          )}

          {!unclaimedFarm && farms.length === 0 && (
            <div className="bg-card border border-border rounded-lg p-6 space-y-4">
              <h2 className="font-semibold text-foreground">Step 1: Create a farm</h2>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Farm Name</label>
                <input
                  value={newFarmName}
                  onChange={(e) => setNewFarmName(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border border-border bg-input text-foreground"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">City</label>
                <input
                  value={newFarmCity}
                  onChange={(e) => setNewFarmCity(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border border-border bg-input text-foreground"
                />
              </div>
              <button
                onClick={handleCreateFarm}
                disabled={creatingFarm || claimingDevice}
                className="w-full py-3 rounded-lg bg-primary text-primary-foreground font-semibold hover:opacity-90 disabled:opacity-50"
              >
                {creatingFarm || claimingDevice ? 'Setting up...' : 'Create Farm & Connect Device'}
              </button>
            </div>
          )}

          {unclaimedFarm && (
            <div className="bg-card border border-border rounded-lg p-6 space-y-4">
              <h2 className="font-semibold text-foreground">Connect device to "{unclaimedFarm.name}"</h2>
              <p className="text-sm text-muted-foreground">
                Device ID: <span className="font-mono">{KNOWN_DEVICE_ID}</span>
              </p>
              <button
                onClick={() => handleClaimDevice(unclaimedFarm.id)}
                disabled={claimingDevice}
                className="w-full py-3 rounded-lg bg-primary text-primary-foreground font-semibold hover:opacity-90 disabled:opacity-50"
              >
                {claimingDevice ? 'Connecting...' : 'Connect Device'}
              </button>
            </div>
          )}
        </div>
      </div>
    )
  }

  // Device claimed — show real dashboard
  const latestMoisture = sensorData?.soil_moisture ?? null
  const latestTemp = sensorData?.temperature ?? null
  const latestHumidity = sensorData?.humidity ?? null
  const motorRunning = sensorData?.motor_running ?? false

  const statusPieData = [
    { name: 'Optimal', value: 55 },
    { name: 'Dry', value: 25 },
    { name: 'Saturated', value: 20 },
  ]
  const STATUS_COLORS = ['var(--color-primary)', 'var(--color-destructive)', 'var(--color-accent)']

  return (
    <div className="min-h-screen bg-background p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">Irrigation Monitoring Dashboard</h1>
          <p className="text-muted-foreground">
            {farm.name} — {farm.city} · Device: {farm.device_id}
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-card border border-border rounded-lg p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">Soil Moisture</p>
                <p className="text-3xl font-bold text-foreground">
                  {sensorOnline && latestMoisture !== null ? `${latestMoisture}%` : '—'}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {sensorOnline && latestMoisture !== null
                    ? latestMoisture < 30
                      ? 'Dry'
                      : latestMoisture <= 70
                      ? 'Optimal'
                      : 'Saturated'
                    : 'No data'}
                </p>
              </div>
              <div className="p-3 rounded-lg bg-primary/10">
                <Droplets className="text-primary" size={24} />
              </div>
            </div>
            <p className={`text-xs p-2 rounded ${sensorOnline ? 'bg-primary/10 text-primary' : 'bg-secondary text-muted-foreground'}`}>
              {sensorOnline ? '🟢 Live ESP32 data' : '⚫ Sensor Offline'}
            </p>
          </div>

          <div className="bg-card border border-border rounded-lg p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">Temperature</p>
                <p className="text-3xl font-bold text-foreground">
                  {sensorOnline && latestTemp !== null ? `${latestTemp}°C` : '—'}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {sensorOnline && latestTemp !== null ? 'From DHT11 sensor' : 'No data'}
                </p>
              </div>
              <div className="p-3 rounded-lg bg-primary/10">
                <Thermometer className="text-primary" size={24} />
              </div>
            </div>
            <p className={`text-xs p-2 rounded ${sensorOnline ? 'bg-primary/10 text-primary' : 'bg-secondary text-muted-foreground'}`}>
              {sensorOnline ? '🟢 Live ESP32 data' : '⚫ Sensor Offline'}
            </p>
          </div>

          <div className="bg-card border border-border rounded-lg p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">Humidity</p>
                <p className="text-3xl font-bold text-foreground">
                  {sensorOnline && latestHumidity !== null ? `${latestHumidity}%` : '—'}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {sensorOnline && latestHumidity !== null ? 'From DHT11 sensor' : 'No data'}
                </p>
              </div>
              <div className="p-3 rounded-lg bg-primary/10">
                <Cloud className="text-primary" size={24} />
              </div>
            </div>
            <p className={`text-xs p-2 rounded ${sensorOnline ? 'bg-primary/10 text-primary' : 'bg-secondary text-muted-foreground'}`}>
              {sensorOnline ? '🟢 Live ESP32 data' : '⚫ Sensor Offline'}
            </p>
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
            <p className="text-xs text-muted-foreground bg-secondary p-2 rounded">See Weather tab for live data</p>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 mb-8">
          <div className="lg:col-span-2 bg-card border border-border rounded-lg p-8">
            <h3 className="text-xl font-bold text-foreground mb-1">Soil Moisture Trend</h3>
            <p className="text-xs text-muted-foreground mb-6">
              {sensorOnline ? 'Live readings from ESP32, polled every 5 seconds' : 'Waiting for sensor data...'}
            </p>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={trendData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--color-muted)" />
                  <XAxis dataKey="time" stroke="var(--color-muted-foreground)" fontSize={12} />
                  <YAxis domain={[0, 100]} stroke="var(--color-muted-foreground)" fontSize={12} />
                  <Tooltip formatter={(value: any) => `${value}%`} />
                  <Line type="monotone" dataKey="moisture" stroke="var(--color-primary)" strokeWidth={2} dot={false} />
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
                  <Tooltip formatter={(value: any) => `${value}%`} />
                  <Legend verticalAlign="bottom" height={36} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <div className="bg-card border border-border rounded-lg p-8 mb-8">
          <h3 className="text-xl font-bold text-foreground mb-1">Motor & Pump Control</h3>
          <p className="text-xs text-muted-foreground mb-6">Sends real MQTT commands via agrimind/motor</p>

          <div className="flex items-center justify-between mb-6 p-4 bg-secondary rounded-lg border border-border">
            <span className="text-sm font-semibold text-foreground">Motor Status</span>
            <span
              className={`text-sm font-bold px-3 py-1 rounded-full ${
                (sensorOnline ? motorRunning : motorState === 'on') ? 'bg-primary/20 text-primary' : 'bg-muted text-muted-foreground'
              }`}
            >
              {(sensorOnline ? motorRunning : motorState === 'on') ? '🟢 ON' : '⚫ OFF'}
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
            <div className="p-3 bg-primary/10 border border-primary/20 rounded-lg text-sm text-primary">✓ {motorMessage}</div>
          )}
          {motorStatus === 'error' && (
            <div className="p-3 bg-destructive/10 border border-destructive rounded-lg text-sm text-destructive">{motorMessage}</div>
          )}
        </div>

        <details className="bg-card rounded-lg p-4 border border-border">
          <summary className="cursor-pointer text-sm font-semibold text-muted-foreground">
            Debug: raw sensor endpoint response
          </summary>
          <pre className="mt-3 text-xs overflow-auto p-3 bg-secondary rounded-lg text-foreground max-h-96">
            {JSON.stringify(sensorRaw, null, 2)}
          </pre>
        </details>
      </div>
    </div>
  )
}