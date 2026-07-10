'use client'

import { Droplets, Cloud, Thermometer, AlertCircle } from 'lucide-react'

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
                <p className="text-3xl font-bold text-foreground">45%</p>
                <p className="text-xs text-muted-foreground mt-1">Moderate</p>
              </div>
              <div className="p-3 rounded-lg bg-primary/10">
                <Droplets className="text-primary" size={24} />
              </div>
            </div>
            <p className="text-xs text-muted-foreground bg-secondary p-2 rounded">Demo sensor data</p>
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
                <p className="text-sm font-semibold text-foreground">Status</p>
                <p className="text-muted-foreground mt-1">Sensor integration coming soon</p>
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
            <h3 className="text-xl font-bold text-foreground mb-6">Motor & Pump Control</h3>
            <div className="space-y-4">
              <div className="p-4 bg-secondary rounded-lg border border-border">
                <p className="text-sm font-semibold text-foreground">Status</p>
                <p className="text-muted-foreground mt-1">Motor automation is planned for the next phase</p>
              </div>
              <div className="p-4 bg-secondary rounded-lg border border-border">
                <p className="text-sm font-semibold text-foreground">Setup Required</p>
                <p className="text-muted-foreground mt-1">Connect an IoT relay and water pump to enable automatic irrigation scheduling</p>
              </div>
              <div className="p-4 bg-secondary rounded-lg border border-border">
                <p className="text-sm font-semibold text-foreground">Future Feature</p>
                <p className="text-muted-foreground mt-1">Auto-scheduling based on AI recommendations and weather alerts</p>
              </div>
            </div>
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
