'use client'

import { useState, useEffect } from 'react'
import { Cloud, CloudRain, Loader2, MapPin, AlertCircle } from 'lucide-react'
import { Skeleton } from '@/components/ui/skeleton'
import { apiClient, WeatherData } from '@/lib/api'

interface WeatherProps {
  isLoggedIn: boolean
}

export default function Weather({ isLoggedIn }: WeatherProps) {
  const [weather, setWeather] = useState<WeatherData | null>(null)
  const [detectedCity, setDetectedCity] = useState<string | null>(null)
  const [manualCity, setManualCity] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchWeatherForCity = async (city: string) => {
    setLoading(true)
    setError(null)
    const result = await apiClient.getWeather(city)
    if (result.error || !result.data) {
      setError(result.error || 'Unable to fetch weather for this location')
      setWeather(null)
    } else {
      setWeather(result.data)
    }
    setLoading(false)
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
          const geoRes = await fetch(`/api/geocode?lat=${latitude}&lon=${longitude}`)
          const geoData = await geoRes.json()

          if (!geoRes.ok || !geoData.candidates || geoData.candidates.length === 0) {
            setError('Could not determine your city from your location. Enter a city manually below.')
            setLoading(false)
            return
          }

          // Try each candidate place name until the weather API accepts one
          let succeeded = false
          for (const candidate of geoData.candidates as string[]) {
            const result = await apiClient.getWeather(candidate)
            if (!result.error && result.data) {
              setDetectedCity(candidate)
              setWeather(result.data)
              succeeded = true
              break
            }
          }

          if (!succeeded) {
            setDetectedCity(geoData.city)
            setError(
              `Detected "${geoData.city}" but it isn't recognized by the weather service. Enter a nearby city manually below.`
            )
          }
        } catch (err: any) {
          setError('Location lookup failed. Enter a city manually below.')
        } finally {
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

  // Placeholder forecast — backend has no 7-day forecast endpoint yet
  const forecast = [
    { day: 'Today', condition: 'See current weather above', icon: '☀️' },
    { day: 'Tomorrow', condition: 'Forecast coming soon', icon: '⛅' },
    { day: 'Day 3', condition: 'Forecast coming soon', icon: '⛅' },
    { day: 'Day 4', condition: 'Forecast coming soon', icon: '⛅' },
  ]

  return (
    <div className="min-h-screen bg-background p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex items-start justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-4xl font-bold text-foreground mb-2">Live Weather Forecast</h1>
            <p className="text-muted-foreground flex items-center gap-2">
              <MapPin size={16} />
              {weather?.city || detectedCity || 'Detecting your location...'}
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
              <p className="text-sm text-destructive font-semibold">
                {error.toLowerCase().includes('permission')
                  ? 'Location access denied — enter your city manually below'
                  : error.toLowerCase().includes('timeout')
                  ? 'Weather service is waking up — please retry in a few seconds'
                  : 'Could not detect your location automatically — enter your city manually below'}
              </p>
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

        {/* 7-Day Forecast (placeholder until backend adds forecast endpoint) */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-foreground">7-Day Forecast</h2>
            <span className="text-xs px-3 py-1 rounded-full bg-secondary text-muted-foreground">
              Coming soon — backend forecast endpoint not built yet
            </span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {forecast.map((day, idx) => (
              <div key={idx} className="bg-card border border-border rounded-lg p-6 opacity-60">
                <div className="text-lg font-bold text-foreground mb-4">{day.day}</div>
                <div className="text-4xl mb-4">{day.icon}</div>
                <p className="text-sm text-muted-foreground">{day.condition}</p>
              </div>
            ))}
          </div>
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