'use client'

import { useState } from 'react'
import { Moon, Sun, Globe } from 'lucide-react'

interface SettingsProps {
  isLoggedIn: boolean
  isDarkMode: boolean
  setIsDarkMode: (value: boolean) => void
}

export default function Settings({ isLoggedIn, isDarkMode, setIsDarkMode }: SettingsProps) {
  const [language, setLanguage] = useState('english')

  const languages = [
    { code: 'english', name: 'English', flag: '🇬🇧' },
    { code: 'hindi', name: 'हिंदी', flag: '🇮🇳' },
    { code: 'marathi', name: 'मराठी', flag: '🇮🇳' },
    { code: 'tamil', name: 'தமிழ்', flag: '🇮🇳' },
  ]

  if (!isLoggedIn) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="text-center">
          <p className="text-foreground text-lg">Please login to access settings</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background p-4 sm:p-6 lg:p-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-2">Settings</h1>
          <p className="text-muted-foreground">Customize your AgriMind experience</p>
        </div>

        {/* Theme Settings */}
        <div className="bg-card border border-border rounded-lg p-6 mb-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              {isDarkMode ? (
                <Moon className="text-primary" size={24} />
              ) : (
                <Sun className="text-primary" size={24} />
              )}
              <div>
                <h2 className="text-lg font-semibold text-foreground">Appearance</h2>
                <p className="text-sm text-muted-foreground">Choose your preferred theme</p>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <button
              onClick={() => setIsDarkMode(false)}
              className={`w-full p-4 rounded-lg border-2 transition-all text-left ${
                !isDarkMode
                  ? 'border-primary bg-primary/10'
                  : 'border-border bg-background hover:border-primary/50'
              }`}
            >
              <div className="flex items-center gap-3">
                <Sun size={20} />
                <div>
                  <p className="font-medium text-foreground">Light Mode</p>
                  <p className="text-xs text-muted-foreground">Bright and easy on the eyes</p>
                </div>
              </div>
            </button>

            <button
              onClick={() => setIsDarkMode(true)}
              className={`w-full p-4 rounded-lg border-2 transition-all text-left ${
                isDarkMode
                  ? 'border-primary bg-primary/10'
                  : 'border-border bg-background hover:border-primary/50'
              }`}
            >
              <div className="flex items-center gap-3">
                <Moon size={20} />
                <div>
                  <p className="font-medium text-foreground">Dark Mode</p>
                  <p className="text-xs text-muted-foreground">Easy on the eyes at night</p>
                </div>
              </div>
            </button>
          </div>
        </div>

        {/* Language Settings */}
        <div className="bg-card border border-border rounded-lg p-6 mb-6">
          <div className="flex items-center gap-3 mb-6">
            <Globe className="text-primary" size={24} />
            <div>
              <h2 className="text-lg font-semibold text-foreground">Language</h2>
              <p className="text-sm text-muted-foreground">Select your preferred language</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {languages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => setLanguage(lang.code)}
                className={`p-4 rounded-lg border-2 transition-all ${
                  language === lang.code
                    ? 'border-primary bg-primary/10'
                    : 'border-border bg-background hover:border-primary/50'
                }`}
              >
                <div className="text-2xl mb-2">{lang.flag}</div>
                <div className="text-sm font-medium text-foreground">{lang.name}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Notification Settings */}
        <div className="bg-card border border-border rounded-lg p-6 mb-6">
          <h2 className="text-lg font-semibold text-foreground mb-6">Notifications</h2>
          <div className="space-y-4">
            {[
              { name: 'Soil Moisture Alerts', desc: 'Get notified when soil moisture changes' },
              { name: 'Weather Updates', desc: 'Receive weather forecast notifications' },
              { name: 'Motor Status', desc: 'Get alerts when motor starts or stops' },
              { name: 'Daily Recommendations', desc: 'Receive daily farming recommendations' },
            ].map((notif, idx) => (
              <div key={idx} className="flex items-center justify-between p-4 bg-background rounded-lg border border-border">
                <div>
                  <p className="font-medium text-foreground">{notif.name}</p>
                  <p className="text-xs text-muted-foreground">{notif.desc}</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" defaultChecked />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/30 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                </label>
              </div>
            ))}
          </div>
        </div>

        {/* Account Settings */}
        <div className="bg-card border border-border rounded-lg p-6 mb-6">
          <h2 className="text-lg font-semibold text-foreground mb-6">Account</h2>
          <div className="space-y-4">
            <div className="p-4 bg-background rounded-lg border border-border">
              <p className="text-xs text-muted-foreground mb-1">Farmer Email</p>
              <p className="font-medium text-foreground">farmer@agrimind.com</p>
            </div>
            <div className="p-4 bg-background rounded-lg border border-border">
              <p className="text-xs text-muted-foreground mb-1">Farm Location</p>
              <p className="font-medium text-foreground">Maharashtra, India</p>
            </div>
            <button className="w-full px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors font-medium">
              Logout
            </button>
          </div>
        </div>

        {/* About */}
        <div className="bg-background border border-border rounded-lg p-6 text-center">
          <p className="text-sm text-muted-foreground mb-2">AgriMind v1.0</p>
          <p className="text-xs text-muted-foreground">Smart Agricultural Intelligence Platform</p>
        </div>
      </div>
    </div>
  )
}
