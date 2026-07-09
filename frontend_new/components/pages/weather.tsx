'use client'

import { Cloud, CloudRain, Sun, Wind } from 'lucide-react'

interface WeatherProps {
  isLoggedIn: boolean
}

export default function Weather({ isLoggedIn }: WeatherProps) {
  if (!isLoggedIn) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="text-center">
          <p className="text-foreground text-lg">Please login to access weather</p>
        </div>
      </div>
    )
  }

  const currentWeather = {
    temp: 28,
    condition: 'Partly Cloudy',
    humidity: 65,
    windSpeed: 12,
    location: 'Your Farm, District, State',
    feelsLike: 30,
    uv: 6,
    visibility: 10,
  }

  const forecast = [
    { day: 'Today', high: 32, low: 24, condition: 'Sunny', icon: '☀️', rain: '0%' },
    { day: 'Tomorrow', high: 31, low: 23, condition: 'Partly Cloudy', icon: '⛅', rain: '10%' },
    { day: 'Thursday', high: 28, low: 22, condition: 'Rainy', icon: '🌧️', rain: '80%' },
    { day: 'Friday', high: 29, low: 21, condition: 'Sunny', icon: '☀️', rain: '5%' },
    { day: 'Saturday', high: 30, low: 22, condition: 'Partly Cloudy', icon: '⛅', rain: '20%' },
    { day: 'Sunday', high: 32, low: 24, condition: 'Sunny', icon: '☀️', rain: '0%' },
    { day: 'Monday', high: 31, low: 23, condition: 'Partly Cloudy', icon: '⛅', rain: '15%' },
  ]

  return (
    <div className="min-h-screen bg-background p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">Weather Forecast</h1>
          <p className="text-muted-foreground">Auto-detected location: {currentWeather.location}</p>
        </div>

        {/* Current Weather */}
        <div className="bg-gradient-to-br from-primary/10 to-primary/5 border border-border rounded-lg p-8 mb-8">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Left side - Main weather */}
            <div className="flex flex-col justify-center">
              <div className="text-6xl font-bold text-foreground mb-2">{currentWeather.temp}°C</div>
              <div className="text-2xl text-muted-foreground mb-4">{currentWeather.condition}</div>
              <div className="text-sm text-muted-foreground">Feels like {currentWeather.feelsLike}°C</div>
            </div>

            {/* Right side - Details */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-card border border-border rounded-lg p-4">
                <div className="text-sm text-muted-foreground mb-1">Humidity</div>
                <div className="text-3xl font-bold text-foreground">{currentWeather.humidity}%</div>
              </div>
              <div className="bg-card border border-border rounded-lg p-4">
                <div className="text-sm text-muted-foreground mb-1">Wind Speed</div>
                <div className="text-3xl font-bold text-foreground">{currentWeather.windSpeed} km/h</div>
              </div>
              <div className="bg-card border border-border rounded-lg p-4">
                <div className="text-sm text-muted-foreground mb-1">UV Index</div>
                <div className="text-3xl font-bold text-foreground">{currentWeather.uv}</div>
              </div>
              <div className="bg-card border border-border rounded-lg p-4">
                <div className="text-sm text-muted-foreground mb-1">Visibility</div>
                <div className="text-3xl font-bold text-foreground">{currentWeather.visibility} km</div>
              </div>
            </div>
          </div>
        </div>

        {/* 7-Day Forecast */}
        <div>
          <h2 className="text-2xl font-bold text-foreground mb-6">7-Day Forecast</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {forecast.map((day, idx) => (
              <div key={idx} className="bg-card border border-border rounded-lg p-6">
                <div className="text-lg font-bold text-foreground mb-4">{day.day}</div>
                <div className="text-4xl mb-4">{day.icon}</div>
                <div className="mb-4">
                  <p className="text-sm text-muted-foreground mb-2">{day.condition}</p>
                  <div className="flex justify-between">
                    <span className="font-semibold text-foreground">{day.high}°C</span>
                    <span className="text-muted-foreground">{day.low}°C</span>
                  </div>
                </div>
                <div className="pt-4 border-t border-border">
                  <div className="flex items-center gap-2">
                    <CloudRain size={16} className="text-blue-500" />
                    <span className="text-sm text-muted-foreground">Rain: {day.rain}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Weather Alerts */}
        <div className="mt-8 bg-yellow-50 border border-yellow-200 rounded-lg p-6">
          <h3 className="text-lg font-bold text-yellow-900 mb-4">Weather Alerts</h3>
          <div className="space-y-2 text-yellow-800 text-sm">
            <p>• Light rain expected on Thursday. Adjust your irrigation schedule accordingly.</p>
            <p>• High UV index today. Ensure proper crop protection if needed.</p>
            <p>• Wind speed may increase tomorrow. Monitor for potential crop damage.</p>
          </div>
        </div>
      </div>
    </div>
  )
}
