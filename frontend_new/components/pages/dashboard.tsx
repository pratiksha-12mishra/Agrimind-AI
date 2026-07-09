'use client'

import { Power, AlertCircle } from 'lucide-react'

interface DashboardProps {
  isLoggedIn: boolean
}

export default function Dashboard({ isLoggedIn }: DashboardProps) {
  if (!isLoggedIn) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="text-center">
          <p className="text-foreground text-lg">Please login to access the dashboard</p>
        </div>
      </div>
    )
  }

  const sensors = [
    { name: 'Temperature', value: '28.5°C', status: 'normal', icon: '🌡️' },
    { name: 'Humidity', value: '65%', status: 'normal', icon: '💧' },
    { name: 'Soil Moisture', value: '45%', status: 'warning', icon: '🌱' },
    { name: 'Air Pressure', value: '1013.2 mb', status: 'normal', icon: '⚡' },
  ]

  const recommendations = [
    { title: 'Water Your Plants', desc: 'Soil moisture is at 45%. Optimal is 50-60%', priority: 'high' },
    { title: 'Check Weather', desc: 'Rain expected tomorrow. Adjust watering schedule.', priority: 'medium' },
    { title: 'System Status', desc: 'Motor is running smoothly. No issues detected.', priority: 'low' },
  ]

  return (
    <div className="min-h-screen bg-background p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">Live Sensor Feed</h1>
          <p className="text-muted-foreground">Real-time monitoring of your farm</p>
        </div>

        {/* Sensor Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {sensors.map((sensor) => (
            <div key={sensor.name} className="bg-card border border-border rounded-lg p-6">
              <div className="text-3xl mb-2">{sensor.icon}</div>
              <h3 className="text-sm font-medium text-muted-foreground mb-1">{sensor.name}</h3>
              <div className="text-2xl font-bold text-foreground mb-3">{sensor.value}</div>
              <div
                className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                  sensor.status === 'normal'
                    ? 'bg-primary/10 text-primary'
                    : 'bg-accent/10 text-accent'
                }`}
              >
                {sensor.status === 'normal' ? '✓ Normal' : '⚠ Warning'}
              </div>
            </div>
          ))}
        </div>

        {/* Motor Control */}
        <div className="bg-card border border-border rounded-lg p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-foreground">Motor Control</h2>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-primary rounded-full animate-pulse"></div>
              <span className="text-sm font-medium text-primary">Active</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button className="flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity font-medium">
              <Power size={20} />
              Turn Off
            </button>
            <p className="text-muted-foreground">Motor is running. Running time: 2h 15m</p>
          </div>
        </div>

        {/* Today's Recommendations */}
        <div className="bg-card border border-border rounded-lg p-6">
          <h2 className="text-xl font-bold text-foreground mb-6">Today&apos;s Recommendations</h2>
          <div className="space-y-4">
            {recommendations.map((rec, idx) => (
              <div key={idx} className="flex items-start gap-4 pb-4 border-b border-border last:border-0">
                <div
                  className={`mt-1 ${
                    rec.priority === 'high'
                      ? 'text-destructive'
                      : rec.priority === 'medium'
                        ? 'text-accent'
                        : 'text-primary'
                  }`}
                >
                  <AlertCircle size={20} />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-foreground mb-1">{rec.title}</h3>
                  <p className="text-muted-foreground text-sm">{rec.desc}</p>
                </div>
                <span
                  className={`text-xs font-medium px-2 py-1 rounded ${
                    rec.priority === 'high'
                      ? 'bg-destructive/10 text-destructive'
                      : rec.priority === 'medium'
                        ? 'bg-accent/10 text-accent'
                        : 'bg-primary/10 text-primary'
                  }`}
                >
                  {rec.priority}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
