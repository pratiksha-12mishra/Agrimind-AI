'use client'

import { useState, useEffect } from 'react'
import { Cloud, Droplets, AlertCircle, Loader2 } from 'lucide-react'
import { apiClient } from '@/lib/api'
import { useLanguage } from '@/lib/language-context'
import { Droplets as DropletsIcon, RefreshCw } from 'lucide-react'

export default function Predict({ setCurrentTab }: { setCurrentTab: (tab: string) => void }) {
  const { t } = useLanguage()

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
  const [liveSensor, setLiveSensor] = useState<any>(null)
  const [sensorFetchError, setSensorFetchError] = useState<string | null>(null)
  const [sensorLoading, setSensorLoading] = useState(true)

  useEffect(() => {
    const fetchSensor = async () => {
      setSensorLoading(true)
      setSensorFetchError(null)
      try {
        const res = await fetch('/api/sensors/latest')
        const data = await res.json()
        if (!res.ok) {
          setSensorFetchError(data.error || 'No live sensor available yet')
          setSensorLoading(false)
          return
        }
        setLiveSensor(data)
      } catch (err: any) {
        setSensorFetchError('Could not reach sensor endpoint')
      } finally {
        setSensorLoading(false)
      }
    }
    fetchSensor()
  }, [])

  const applySensorReading = () => {
    if (liveSensor && typeof liveSensor.soil_moisture === 'number') {
      setFormData((prev) => ({ ...prev, soil_moisture: liveSensor.soil_moisture }))
    }
  }

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

      sessionStorage.setItem('irrigationResult', JSON.stringify(recResult.data))
      sessionStorage.setItem('weatherData', JSON.stringify(weatherResult.data))
      sessionStorage.setItem('soilMoistureInput', String(formData.soil_moisture))
      setSuccess(true)

      setTimeout(() => {
        setCurrentTab('results')
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
        <h1 className="text-4xl font-bold text-foreground mb-2">{t('predict_title')}</h1>
        <p className="text-muted-foreground mb-12">{t('predict_subtitle')}</p>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Form */}
          <div className="lg:col-span-1">
            <div className="bg-card rounded-lg p-8 border border-border sticky top-24">
              <h2 className="text-2xl font-bold text-foreground mb-6">{t('predict_field_info')}</h2>

              {/* Live sensor reading card */}
              {!sensorLoading && liveSensor && typeof liveSensor.soil_moisture === 'number' && (
                <div className="mb-5 p-4 rounded-lg border border-primary/20 bg-primary/5">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm font-semibold text-foreground flex items-center gap-2">
                      <DropletsIcon size={16} className="text-primary" />
                      Live sensor reading: {liveSensor.soil_moisture}%
                    </p>
                    <button
                      type="button"
                      onClick={applySensorReading}
                      className="text-xs px-3 py-1 rounded-full bg-primary text-primary-foreground font-semibold hover:opacity-90"
                    >
                      Use this reading
                    </button>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    From device {liveSensor.device_id}. You can still adjust the slider below manually.
                  </p>
                </div>
              )}

              {!sensorLoading && sensorFetchError && (
                <div className="mb-5 p-3 rounded-lg border border-border bg-secondary text-xs text-muted-foreground flex items-center gap-2">
                  <RefreshCw size={14} />
                  No live sensor connected yet — enter soil moisture manually below.
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    {t('predict_crop_type')}
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
                    {t('predict_growth_stage')}
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
                      <Droplets className="inline mr-2" size={16} /> {t('predict_soil_moisture')}
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
                    <Cloud className="inline mr-2" size={16} /> {t('predict_city')}
                  </label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    placeholder={t('predict_city_placeholder')}
                    className="w-full px-4 py-2 rounded-lg border border-border bg-input text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                {error && (
                  <div className="bg-destructive/10 border border-destructive rounded-lg p-3 flex gap-3">
                    <AlertCircle className="text-destructive flex-shrink-0" size={20} />
                    <div className="text-sm text-destructive">
                      <p className="font-semibold">
                        {error.toLowerCase().includes('timeout') || error.toLowerCase().includes('took too long')
                          ? 'Service is waking up — please try again in a few seconds'
                          : error.toLowerCase().includes('city') || error.toLowerCase().includes('weather')
                          ? 'Weather service unavailable for this location — check the city name'
                          : 'Unable to get a recommendation right now'}
                      </p>
                      <details className="mt-1">
                        <summary className="cursor-pointer text-xs opacity-75">Technical details</summary>
                        <p className="mt-1 break-words text-xs">{error}</p>
                      </details>
                    </div>
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
                      {t('predict_analyzing')}
                    </>
                  ) : (
                    t('predict_submit')
                  )}
                </button>
              </form>
            </div>
          </div>

          {/* Info Section */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-card rounded-lg p-8 border border-border">
              <h3 className="text-xl font-bold text-foreground mb-4">{t('predict_how_title')}</h3>
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