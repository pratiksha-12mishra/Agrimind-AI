'use client'

import { useState, useEffect } from 'react'
import { Cloud, CloudRain, Sun, CloudSnow, MapPin, AlertCircle } from 'lucide-react'
import { apiClient, WeatherData } from '@/lib/api'
import { Skeleton } from '@/components/ui/skeleton'

interface WeatherProps {
  isLoggedIn: boolean
}

interface ForecastDay {
  date: string
  temperature: number
  humidity: number
  rain_probability: number
  weather: string
}

function getWeatherIcon(condition: string) {
  const c = condition.toLowerCase()
  if (c.includes('rain') || c.includes('drizzle')) return CloudRain
  if (c.includes('snow')) return CloudSnow
  if (c.includes('clear') || c.includes('sun')) return Sun
  return Cloud
}

export default function Weather({ isLoggedIn }: WeatherProps) {
  const [weather, setWeather] = useState<WeatherData | null>(null)
  const [forecast, setForecast] = useState<ForecastDay[]>([])
  const [forecastError, setForecastError] = useState<string | null>(null)
  const [manualCity, setManualCity] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchForecast = async (city: string) => {
    setForecastError(null)
    try {
      const res = await fetch(`/api/weather/forecast?city=${encodeURIComponent(city)}`)
      const data = await res.json()
      if (!res.ok) {
        setForecastError(data.error || 'Forecast unavailable')
        setForecast([])
        return
      }
      setForecast(Array.isArray(data) ? data : [])
    } catch (err: any) {
      setForecastError(err?.message || 'Failed to load forecast')
    }
  }

  const fetchWeatherForCity = async (city: string) => {
    setLoading(true)
    setError(null)
    const result = await apiClient.getWeather(city)
    if (result.error || !result.data) {
      setError(result.error || 'Unable to fetch weather for this location')
      setWeather(null)
      setLoading(false)
      return
    }
    setWeather(result.data)
    setLoading(false)
    fetchForecast(result.data.city)
  }

  const detectLocationAndFetch = () => {
    setError(null)
    setLoading(true)

    if (!navigator.geolocation) {
      setError('Your browser does not support location detection. Enter a city manually below.')
      setLoading(false)
      return
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords
          const res = await fetch(`/api/weather/location?latitude=${latitude}&longitude=${longitude}`)
          const data = await res.json()

          if (!res.ok) {
            setError(data.error || 'Could not fetch weather for your location. Enter a city manually below.')
            setLoading(false)
            return
          }

          setWeather(data)
          setLoading(false)
          fetchForecast(data.city)
        } catch (err: any) {
          setError('Location lookup failed. Enter a city manually below.')
          setLoading(false)
        }
      },
      () => {
        setError('Location permission denied. Enter a city manually below.')
        setLoading(false)
      }
    )
  }

  useEffect(() => {
    if (isLoggedIn) {
      detectLocationAndFetch()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoggedIn])

  if (!isLoggedIn) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="text-center">
          <p className="text-foreground text-lg">Please login to access weather</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex items-start justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-4xl font-bold text-foreground mb-2">Live Weather Forecast</h1>
            <p className="text-muted-foreground flex items-center gap-2">
              <MapPin size={16} />
              {weather?.city || 'Detecting your location...'}
            </p>
          </div>
          <button
            onClick={detectLocationAndFetch}
            disabled={loading}
            className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 disabled:opacity-50"
          >
            {loading ? 'Detecting...' : 'Refresh Location'}
          </button>
        </div>

        {/* Manual city fallback */}
        {error && (
          <div className="mb-6 bg-destructive/10 border border-destructive rounded-lg p-4 flex gap-3 items-start flex-wrap">
            <AlertCircle className="text-destructive flex-shrink-0" size={20} />
            <div className="flex-1 min-w-[200px]">
              <p className="text-sm text-destructive font-semibold">{error}</p>
              <div className="flex gap-2 mt-3">
                <input
                  type="text"
                  value={manualCity}
                  onChange={(e) => setManualCity(e.target.value)}
                  placeholder="Enter city name e.g. Bhopal"
                  className="flex-1 px-3 py-2 rounded-lg border border-border bg-input text-foreground text-sm"
                />
                <button
                  onClick={() => manualCity && fetchWeatherForCity(manualCity)}
                  disabled={!manualCity || loading}
                  className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 disabled:opacity-50"
                >
                  Get Weather
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Loading */}
        {loading && !weather && (
          <div className="mb-8">
            <Skeleton className="h-48 w-full rounded-lg" />
          </div>
        )}

        {/* Current Weather */}
        {weather && (
          <div className="bg-gradient-to-br from-primary/10 to-primary/5 border border-border rounded-lg p-8 mb-8">
            <div className="grid md:grid-cols-2 gap-8">
              <div className="flex flex-col justify-center">
                <div className="text-6xl font-bold text-foreground mb-2">{weather.temperature}°C</div>
                <div className="text-2xl text-muted-foreground mb-4 capitalize">{weather.weather_condition}</div>
                <div className="text-sm text-muted-foreground">Live data for {weather.city}</div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-card border border-border rounded-lg p-4">
                  <div className="text-sm text-muted-foreground mb-1">Humidity</div>
                  <div className="text-3xl font-bold text-foreground">{weather.humidity}%</div>
                </div>
                <div className="bg-card border border-border rounded-lg p-4">
                  <div className="text-sm text-muted-foreground mb-1">Rain Chance</div>
                  <div className="text-3xl font-bold text-foreground">{weather.rain_chance}%</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Real Forecast */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-foreground">Forecast</h2>
            {forecastError && (
              <span className="text-xs px-3 py-1 rounded-full bg-secondary text-muted-foreground">
                {forecastError}
              </span>
            )}
          </div>

          {forecast.length === 0 && !forecastError && weather && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-40 w-full rounded-lg" />
              ))}
            </div>
          )}

          {forecast.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              {forecast.map((day, idx) => {
                const Icon = getWeatherIcon(day.weather)
                const label =
                  idx === 0
                    ? 'Today'
                    : new Date(day.date).toLocaleDateString('en-IN', { weekday: 'short', day: '2-digit', month: 'short' })
                return (
                  <div key={day.date} className="bg-card border border-border rounded-lg p-6 text-center">
                    <div className="text-lg font-bold text-foreground mb-3">{label}</div>
                    <Icon className="mx-auto text-primary mb-3" size={36} />
                    <p className="text-2xl font-bold text-foreground mb-1">{day.temperature}°C</p>
                    <p className="text-sm text-muted-foreground capitalize mb-2">{day.weather}</p>
                    <div className="flex justify-between text-xs text-muted-foreground mt-3 pt-3 border-t border-border">
                      <span>💧 {day.humidity}%</span>
                      <span>🌧️ {day.rain_probability}%</span>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* Tips */}
        <div className="mt-8 bg-accent/10 border border-accent/20 rounded-lg p-6">
          <h3 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
            <CloudRain size={18} />
            Irrigation Planning Tip
          </h3>
          <div className="space-y-2 text-muted-foreground text-sm">
            {weather ? (
              <p>
                Current rain chance is {weather.rain_chance}%.{' '}
                {weather.rain_chance > 50
                  ? 'Consider delaying irrigation — rain is likely.'
                  : 'Low rain chance — irrigate if soil moisture is below 50%.'}
              </p>
            ) : (
              <p>Fetch live weather above to see a personalized irrigation tip.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}