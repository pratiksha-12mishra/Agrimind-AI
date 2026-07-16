'use client'

import { useState, useEffect } from 'react'
import { AlertCircle, Cloud, Droplets, Zap } from 'lucide-react'
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts'
import { Skeleton } from '@/components/ui/skeleton'

export default function Results() {
  const [result, setResult] = useState<any>(null)
  const [weather, setWeather] = useState<any>(null)
  const [soilMoistureInput, setSoilMoistureInput] = useState<number | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Load from sessionStorage
    const irrigationResult = sessionStorage.getItem('irrigationResult')
    const weatherData = sessionStorage.getItem('weatherData')
    const soilInput = sessionStorage.getItem('soilMoistureInput')

    if (irrigationResult) {
      setResult(JSON.parse(irrigationResult))
    }
    if (weatherData) {
      setWeather(JSON.parse(weatherData))
    }
    if (soilInput) {
      setSoilMoistureInput(parseFloat(soilInput))
    }

    setLoading(false)
  }, [])

 if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <Skeleton className="h-10 w-96 mb-2" />
          <Skeleton className="h-5 w-64 mb-12" />
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <Skeleton className="h-40 w-full rounded-lg" />
              <Skeleton className="h-32 w-full rounded-lg" />
              <Skeleton className="h-24 w-full rounded-lg" />
              <Skeleton className="h-64 w-full rounded-lg" />
            </div>
            <div className="space-y-6">
              <Skeleton className="h-52 w-full rounded-lg" />
              <Skeleton className="h-40 w-full rounded-lg" />
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!result) {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="bg-card rounded-lg p-12 border border-border text-center">
            <div className="inline-block p-4 rounded-full bg-secondary mb-6">
              <AlertCircle className="text-primary" size={32} />
            </div>
            <h2 className="text-2xl font-bold text-foreground mb-3">No Results Yet</h2>
            <p className="text-muted-foreground mb-6">Get an irrigation recommendation from the Predict page to see results here.</p>
            <button
              onClick={() => (window.location.href = '/#predict')}
              className="inline-flex items-center gap-2 px-8 py-3 rounded-lg bg-primary text-primary-foreground font-semibold hover:opacity-90"
            >
              Go to Predict
            </button>
          </div>
        </div>
      </div>
    )
  }

  const getRecommendationColor = (rec: string) => {
    if (rec.toLowerCase().includes('irrigate now')) return 'bg-destructive/10 border-destructive text-destructive'
    if (rec.toLowerCase().includes('within 24') || rec.toLowerCase().includes('24 hours'))
      return 'bg-accent/10 border-accent text-accent'
    if (rec.toLowerCase().includes('delay')) return 'bg-muted/10 border-muted text-muted-foreground'
    return 'bg-primary/10 border-primary text-primary'
  }

  // Backend field names may not exactly match what we expect.
  // Fall back safely instead of crashing the whole page.
  const recommendationText = result.recommendation ?? result.decision ?? 'No recommendation returned'
  const waterRequired =
    typeof result.water_required === 'number'
      ? result.water_required
      : typeof result.water_liters === 'number'
      ? result.water_liters
      : null
  const confidenceValue = typeof result.confidence === 'number' ? result.confidence : null
  const explanationText = result.explanation ?? result.reason ?? ''
  const moistureAnalysisText = result.soil_moisture_analysis ?? ''

  // Soil moisture pie chart data (real value from the form, falls back to 0 if missing)
  const moistureUsed = soilMoistureInput ?? 0
  const moistureRemaining = 100 - moistureUsed
  const moisturePieData = [
    { name: 'Current Moisture', value: moistureUsed },
    { name: 'Remaining Capacity', value: moistureRemaining },
  ]
  const MOISTURE_COLORS = ['var(--color-primary)', 'var(--color-muted)']

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-4xl font-bold text-foreground mb-2">Irrigation Recommendation Results</h1>
        <p className="text-muted-foreground mb-12">AI-powered irrigation decision based on your field conditions and live weather</p>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Result */}
          <div className="lg:col-span-2 space-y-6">
            {/* Recommendation Card */}
            <div className={`rounded-lg p-8 border-2 ${getRecommendationColor(recommendationText)}`}>
              <p className="text-sm font-semibold uppercase tracking-wide mb-2 opacity-75">Irrigation Decision</p>
              <h2 className="text-4xl font-bold mb-4">{recommendationText}</h2>
              <p className="text-base opacity-90">Based on current soil moisture, weather conditions, and crop requirements.</p>
            </div>

            {/* Water Required */}
            <div className="bg-card rounded-lg p-8 border border-border">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <p className="text-muted-foreground text-sm font-semibold uppercase mb-2">Water Required</p>
                  <p className="text-5xl font-bold text-foreground">
                    {waterRequired !== null ? waterRequired.toFixed(1) : '—'}
                  </p>
                  <p className="text-muted-foreground mt-1">Litres per square metre (L/m²)</p>
                </div>
                <div className="p-4 rounded-lg bg-primary/10">
                  <Droplets className="text-primary" size={32} />
                </div>
              </div>
            </div>

            {/* AI Explanation */}
            <div className="bg-card rounded-lg p-8 border border-border">
              <h3 className="text-xl font-bold text-foreground mb-4">AI Explanation</h3>
              <p className="text-muted-foreground leading-relaxed">
                {explanationText || 'No explanation provided by the backend.'}
              </p>
            </div>

            {/* Soil Moisture Analysis + Pie Chart */}
            <div className="bg-card rounded-lg p-8 border border-border">
              <h3 className="text-xl font-bold text-foreground mb-6">Soil Moisture Analysis</h3>
              <div className="grid sm:grid-cols-2 gap-6 items-center">
                <div className="space-y-4">
                  <p className="text-muted-foreground">
                    {moistureAnalysisText || 'No soil moisture analysis provided by the backend.'}
                  </p>
                  <div className="mt-4 p-4 bg-secondary rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium text-foreground">Current Soil Moisture</span>
                      <span className="text-lg font-bold text-foreground">
                        {soilMoistureInput !== null ? `${soilMoistureInput}%` : '—'}
                      </span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-3">
                      <div
                        className="bg-primary h-3 rounded-full transition-all"
                        style={{ width: `${Math.min(moistureUsed, 100)}%` }}
                      />
                    </div>
                    <div className="flex justify-between text-xs text-muted-foreground mt-2 px-1">
                      <span>Dry 0%</span>
                      <span>Optimal 50–70%</span>
                      <span>Saturated 100%</span>
                    </div>
                  </div>
                </div>

                {/* Pie chart */}
                <div className="h-56">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={moisturePieData}
                        dataKey="value"
                        nameKey="name"
                        innerRadius={50}
                        outerRadius={80}
                        paddingAngle={2}
                      >
                        {moisturePieData.map((entry, index) => (
                          <Cell key={entry.name} fill={MOISTURE_COLORS[index % MOISTURE_COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value: number) => `${value}%`} />
                      <Legend verticalAlign="bottom" height={36} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar - Weather & Info */}
          <div className="space-y-6">
            {/* Weather Card */}
            {weather && (
              <div className="bg-card rounded-lg p-6 border border-border">
                <h3 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
                  <Cloud size={20} />
                  Live Weather
                </h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-xs text-muted-foreground uppercase font-semibold mb-1">Location</p>
                    <p className="text-lg font-semibold text-foreground">{weather.city}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground uppercase font-semibold mb-1">Condition</p>
                    <p className="text-lg font-semibold text-foreground capitalize">{weather.weather_condition}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4 mt-4 pt-4 border-t border-border">
                    <div>
                      <p className="text-xs text-muted-foreground uppercase font-semibold mb-1">Temperature</p>
                      <p className="text-2xl font-bold text-foreground">{weather.temperature}°C</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground uppercase font-semibold mb-1">Humidity</p>
                      <p className="text-2xl font-bold text-foreground">{weather.humidity}%</p>
                    </div>
                  </div>
                  <div className="mt-4 p-3 rounded-lg bg-primary/10 border border-primary/20">
                    <p className="text-xs text-muted-foreground uppercase font-semibold mb-1">Rain Chance</p>
                    <p className="text-2xl font-bold text-primary">{weather.rain_chance}%</p>
                  </div>
                </div>
              </div>
            )}

            {/* Confidence Score */}
            {confidenceValue !== null && (
              <div className="bg-card rounded-lg p-6 border border-border">
                <h3 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
                  <Zap size={20} />
                  AI Confidence
                </h3>
                <div className="text-center">
                  <p className="text-5xl font-bold text-primary mb-2">{confidenceValue}%</p>
                  <p className="text-sm text-muted-foreground">AI Recommendation Confidence Score</p>
                </div>
              </div>
            )}

            {/* Next Steps */}
            <div className="bg-primary/5 rounded-lg p-6 border border-primary/20">
              <h3 className="text-lg font-bold text-foreground mb-4">Next Steps</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex gap-2">
                  <span className="text-primary font-bold">1.</span>
                  <span>Schedule irrigation based on recommendation</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-primary font-bold">2.</span>
                  <span>Apply recommended water quantity</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-primary font-bold">3.</span>
                  <span>Monitor soil moisture over next 24 hours</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-primary font-bold">4.</span>
                  <span>Get new recommendation after 24 hours</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Debug: raw backend response — remove before final demo */}
        <details className="mt-10 bg-card rounded-lg p-4 border border-border">
          <summary className="cursor-pointer text-sm font-semibold text-muted-foreground">
            Debug: raw backend response
          </summary>
          <pre className="mt-3 text-xs overflow-auto p-3 bg-secondary rounded-lg text-foreground">
            {JSON.stringify(result, null, 2)}
          </pre>
        </details>
      </div>
    </div>
  )
}