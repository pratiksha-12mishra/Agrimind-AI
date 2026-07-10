'use client'

import { useState } from 'react'
import { Cloud, Droplets, AlertCircle, Loader2 } from 'lucide-react'
import { apiClient } from '@/lib/api'

export default function Predict() {
  const [formData, setFormData] = useState({
    crop: 'wheat',
    growth_stage: 'vegetative',
    soil_moisture: 50,
    city: '',
  })

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [weather, setWeather] = useState<any>(null)

  const cropOptions = [
    { label: 'Wheat', value: 'wheat' },
    { label: 'Rice', value: 'rice' },
    { label: 'Cotton', value: 'cotton' },
    { label: 'Maize', value: 'maize' },
    { label: 'Sugarcane', value: 'sugarcane' },
    { label: 'Soybean', value: 'soybean' },
    { label: 'Groundnut', value: 'groundnut' },
    { label: 'Potato', value: 'potato' },
    { label: 'Tomato', value: 'tomato' },
    { label: 'Onion', value: 'onion' },
    { label: 'Chickpea', value: 'chickpea' },
    { label: 'Mustard', value: 'mustard' },
  ]

  const stageOptions = [
    { label: 'Seedling', value: 'seedling' },
    { label: 'Vegetative', value: 'vegetative' },
    { label: 'Flowering', value: 'flowering' },
    { label: 'Maturity', value: 'maturity' },
  ]

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: name === 'soil_moisture' ? parseFloat(value) : value,
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSuccess(false)
    setLoading(true)

    try {
      // Fetch weather first
      console.log('[v0] Starting form submission...')
      const weatherResult = await apiClient.getWeather(formData.city)
      
      if (weatherResult.error) {
        console.log('[v0] Weather error:', weatherResult.error)
        setError(`Weather service unavailable: ${weatherResult.error}`)
        setLoading(false)
        return
      }

      if (!weatherResult.data) {
        console.log('[v0] No weather data returned')
        setError('Live weather is currently unavailable for this city. Please check the city name.')
        setLoading(false)
        return
      }

      console.log('[v0] Weather data received successfully')
      setWeather(weatherResult.data)

      // Get recommendation
      console.log('[v0] Requesting recommendation...')
      const recResult = await apiClient.getRecommendation({
        crop: formData.crop,
        growth_stage: formData.growth_stage,
        soil_moisture: formData.soil_moisture,
        city: formData.city,
      })

      if (recResult.error) {
        console.log('[v0] Recommendation error:', recResult.error)
        setError(`Unable to get recommendation: ${recResult.error}`)
        setLoading(false)
        return
      }

      if (!recResult.data) {
        console.log('[v0] No recommendation data returned')
        setError('Failed to get irrigation recommendation. Please try again.')
        setLoading(false)
        return
      }

      console.log('[v0] Recommendation received successfully')

      // Store result in sessionStorage for results page
      sessionStorage.setItem('irrigationResult', JSON.stringify(recResult.data))
      sessionStorage.setItem('weatherData', JSON.stringify(weatherResult.data))
      setSuccess(true)

      // Redirect to results page after 1 second
      setTimeout(() => {
        window.location.href = '/?tab=results'
      }, 1000)
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'An unexpected error occurred'
      console.error('[v0] Form submission error:', errorMsg)
      setError(errorMsg)
    } finally {
      setLoading(false)
    }
  }

  const getMoistureStatus = (value: number) => {
    if (value < 30) return { label: 'Dry', color: 'text-destructive' }
    if (value < 50) return { label: 'Moderate', color: 'text-accent' }
    if (value <= 70) return { label: 'Optimal', color: 'text-primary' }
    return { label: 'Saturated', color: 'text-muted-foreground' }
  }

  const moistureStatus = getMoistureStatus(formData.soil_moisture)

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-4xl font-bold text-foreground mb-2">Irrigation Recommendation</h1>
        <p className="text-muted-foreground mb-12">Get AI-powered irrigation decisions based on your field conditions and live weather</p>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Form */}
          <div className="lg:col-span-1">
            <div className="bg-card rounded-lg p-8 border border-border sticky top-24">
              <h2 className="text-2xl font-bold text-foreground mb-6">Field Information</h2>
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Crop Type
                  </label>
                  <select
                    name="crop"
                    value={formData.crop}
                    onChange={handleChange}
                    className="w-full px-4 py-2 rounded-lg border border-border bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    {cropOptions.map((crop) => (
                      <option key={crop.value} value={crop.value}>
                        {crop.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Growth Stage
                  </label>
                  <select
                    name="growth_stage"
                    value={formData.growth_stage}
                    onChange={handleChange}
                    className="w-full px-4 py-2 rounded-lg border border-border bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    {stageOptions.map((stage) => (
                      <option key={stage.value} value={stage.value}>
                        {stage.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-sm font-medium text-foreground">
                      <Droplets className="inline mr-2" size={16} /> Soil Moisture
                    </label>
                    <span className={`text-sm font-semibold ${moistureStatus.color}`}>
                      {formData.soil_moisture}% - {moistureStatus.label}
                    </span>
                  </div>
                  <div className="space-y-2">
                    <input
                      type="range"
                      name="soil_moisture"
                      min="0"
                      max="100"
                      step="5"
                      value={formData.soil_moisture}
                      onChange={handleChange}
                      className="w-full accent-primary"
                    />
                    <div className="flex justify-between text-xs text-muted-foreground px-1">
                      <span>Dry 0%</span>
                      <span>Optimal 50–70%</span>
                      <span>Saturated 100%</span>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    <Cloud className="inline mr-2" size={16} /> City
                  </label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    placeholder="e.g. Bhopal, Jabalpur, Mumbai"
                    className="w-full px-4 py-2 rounded-lg border border-border bg-input text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                {error && (
                  <div className="bg-destructive/10 border border-destructive rounded-lg p-3 flex gap-3">
                    <AlertCircle className="text-destructive flex-shrink-0" size={20} />
                    <p className="text-sm text-destructive">{error}</p>
                  </div>
                )}

                {success && (
                  <div className="bg-primary/10 border border-primary rounded-lg p-3">
                    <p className="text-sm text-primary font-medium">✓ Recommendation received! Redirecting...</p>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading || !formData.city}
                  className="w-full py-3 rounded-lg bg-primary text-primary-foreground font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-6"
                >
                  {loading ? (
                    <>
                      <Loader2 size={18} className="animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    'Get AI Irrigation Recommendation'
                  )}
                </button>
              </form>
            </div>
          </div>

          {/* Info Section */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-card rounded-lg p-8 border border-border">
              <h3 className="text-xl font-bold text-foreground mb-4">How It Works</h3>
              <ul className="space-y-4 text-muted-foreground">
                <li className="flex gap-3">
                  <span className="font-bold text-primary flex-shrink-0">1.</span>
                  <span>Select your crop type and current growth stage</span>
                </li>
                <li className="flex gap-3">
                  <span className="font-bold text-primary flex-shrink-0">2.</span>
                  <span>Enter current soil moisture level and your location</span>
                </li>
                <li className="flex gap-3">
                  <span className="font-bold text-primary flex-shrink-0">3.</span>
                  <span>AgriMind fetches live weather data for your city</span>
                </li>
                <li className="flex gap-3">
                  <span className="font-bold text-primary flex-shrink-0">4.</span>
                  <span>Receive irrigation decision and required water quantity (L/m²)</span>
                </li>
              </ul>
            </div>

            <div className="bg-primary/5 rounded-lg p-8 border border-primary/20">
              <h3 className="text-lg font-bold text-foreground mb-3">💡 Smart Irrigation Benefits</h3>
              <ul className="space-y-2 text-muted-foreground text-sm">
                <li>✓ Know when to irrigate and how much water to apply</li>
                <li>✓ Live weather and rain forecast help prevent unnecessary irrigation</li>
                <li>✓ Recommendations adapt to crop type and growth stage</li>
                <li>✓ Reduce water wastage using moisture-based irrigation decisions</li>
                <li>✓ Designed to work with real-time soil moisture sensors</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
