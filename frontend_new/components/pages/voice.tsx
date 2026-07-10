'use client'

import { useState } from 'react'
import { Mic, Square } from 'lucide-react'

interface VoiceProps {
  isLoggedIn: boolean
}

export default function Voice({ isLoggedIn }: VoiceProps) {
  const [isListening, setIsListening] = useState(false)
  const [language, setLanguage] = useState('english')
  const [transcript, setTranscript] = useState('')

  const languages = [
    { code: 'english', name: 'English', flag: '🇬🇧' },
    { code: 'hindi', name: 'Hindi', flag: '🇮🇳' },
    { code: 'marathi', name: 'Marathi', flag: '🇮🇳' },
    { code: 'tamil', name: 'Tamil', flag: '🇮🇳' },
  ]

  const handleMicClick = () => {
    setIsListening(!isListening)
    if (!isListening) {
      // Simulate voice input
      setTimeout(() => {
        setTranscript('What is the soil moisture level?')
      }, 2000)
    } else {
      setTranscript('')
    }
  }

  if (!isLoggedIn) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="text-center">
          <p className="text-foreground text-lg">Please login to access voice assistant</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background p-4 sm:p-6 lg:p-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-2">Smart Irrigation Voice Assistant</h1>
          <p className="text-muted-foreground">Ask AgriMind about soil moisture, weather, watering schedule, and irrigation recommendations</p>
        </div>

        {/* Language Selection */}
        <div className="bg-card border border-border rounded-lg p-6 mb-8">
          <h2 className="text-lg font-semibold text-foreground mb-4">Select Language</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
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

        {/* Voice Input */}
        <div className="bg-gradient-to-br from-primary/10 to-primary/5 border border-border rounded-lg p-12 text-center mb-8">
          <div className="mb-8">
            <button
              onClick={handleMicClick}
              className={`mx-auto flex items-center justify-center w-32 h-32 rounded-full transition-all transform ${
                isListening
                  ? 'bg-red-500 scale-110 shadow-lg shadow-red-500/50'
                  : 'bg-primary hover:bg-primary/90 shadow-lg'
              }`}
            >
              {isListening ? (
                <Square className="text-white" size={40} />
              ) : (
                <Mic className="text-white" size={40} />
              )}
            </button>
          </div>

          <p className="text-muted-foreground mb-4">
            {isListening ? 'Listening... Speak now' : 'Tap the microphone to start speaking'}
          </p>

          {transcript && (
            <div className="bg-background border border-border rounded-lg p-4 mt-6">
              <p className="text-sm text-muted-foreground mb-2">Your question:</p>
              <p className="text-lg text-foreground font-medium">"{transcript}"</p>
            </div>
          )}
        </div>

        {/* Sample Queries */}
        <div className="bg-card border border-border rounded-lg p-6 mb-8">
          <h2 className="text-lg font-semibold text-foreground mb-4">Try These Voice Commands</h2>
          <div className="space-y-3">
            <div className="flex items-start gap-3 p-3 bg-background rounded-lg hover:border-primary/50 cursor-pointer transition-all border border-border">
              <span className="text-xl">💧</span>
              <div className="text-left">
                <p className="font-medium text-foreground">What is the soil moisture level?</p>
                <p className="text-sm text-muted-foreground">Get current soil moisture data</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 bg-background rounded-lg hover:border-primary/50 cursor-pointer transition-all border border-border">
              <span className="text-xl">🌤️</span>
              <div className="text-left">
                <p className="font-medium text-foreground">Show me the weather forecast</p>
                <p className="text-sm text-muted-foreground">Get live weather and rain probability</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 bg-background rounded-lg hover:border-primary/50 cursor-pointer transition-all border border-border">
              <span className="text-xl">🚿</span>
              <div className="text-left">
                <p className="font-medium text-foreground">Should I irrigate today?</p>
                <p className="text-sm text-muted-foreground">Get irrigation recommendation</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 bg-background rounded-lg hover:border-primary/50 cursor-pointer transition-all border border-border">
              <span className="text-xl">📊</span>
              <div className="text-left">
                <p className="font-medium text-foreground">How much water do I need?</p>
                <p className="text-sm text-muted-foreground">Get water requirement in L/m²</p>
              </div>
            </div>
          </div>
        </div>

        {/* Status */}
        <div className="bg-primary/5 border border-primary/20 rounded-lg p-6 text-center">
          <p className="text-muted-foreground text-sm">
            <span className="font-semibold">Voice Assistant Status:</span> Coming soon in {languages.find((l) => l.code === language)?.name}
          </p>
        </div>
      </div>
    </div>
  )
}
