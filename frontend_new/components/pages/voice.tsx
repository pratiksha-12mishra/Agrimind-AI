'use client'

import { useState, useRef } from 'react'
import { Mic, Square, AlertCircle, Volume2 } from 'lucide-react'

interface VoiceProps {
  isLoggedIn: boolean
}

// All 6 languages Harsh's Gemini voice model supports
const languages = [
  { code: 'en', name: 'English', flag: '🇬🇧', speechCode: 'en-IN' },
  { code: 'hi', name: 'हिंदी', flag: '🇮🇳', speechCode: 'hi-IN' },
  { code: 'mr', name: 'मराठी', flag: '🇮🇳', speechCode: 'mr-IN' },
  { code: 'bn', name: 'বাংলা', flag: '🇮🇳', speechCode: 'bn-IN' },
  { code: 'ta', name: 'தமிழ்', flag: '🇮🇳', speechCode: 'ta-IN' },
  { code: 'gu', name: 'ગુજરાતી', flag: '🇮🇳', speechCode: 'gu-IN' },
]

export default function Voice({ isLoggedIn }: VoiceProps) {
  const [isListening, setIsListening] = useState(false)
  const [language, setLanguage] = useState('hi')
  const [transcript, setTranscript] = useState('')
  const [aiResponse, setAiResponse] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const recognitionRef = useRef<any>(null)

  const currentLang = languages.find((l) => l.code === language)!

  const askBackend = async (query: string) => {
    setLoading(true)
    setError(null)
    setAiResponse('')

    // Pull last known farm context from a recent Predict submission, if available
    let farm_context = { soil_moisture: 50, crop: 'wheat', decision: 'unknown' }
    try {
      const lastResult = sessionStorage.getItem('irrigationResult')
      const lastMoisture = sessionStorage.getItem('soilMoistureInput')
      if (lastResult) {
        const parsed = JSON.parse(lastResult)
        farm_context = {
          soil_moisture: lastMoisture ? parseFloat(lastMoisture) : 50,
          crop: 'wheat',
          decision: parsed.recommendation ?? 'unknown',
        }
      }
    } catch {
      // ignore, use defaults
    }

    try {
      const res = await fetch('/api/voice', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query, language, farm_context }),
      })
      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Voice assistant is temporarily unavailable')
        setLoading(false)
        return
      }

      const responseText = data.response ?? data.message ?? ''
      setAiResponse(responseText)

      // Speak the response aloud
      if (responseText && 'speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(responseText)
        utterance.lang = currentLang.speechCode
        window.speechSynthesis.cancel()
        window.speechSynthesis.speak(utterance)
      }
    } catch (err: any) {
      setError(err?.message || 'Network error contacting voice assistant')
    } finally {
      setLoading(false)
    }
  }

  const handleMicClick = () => {
    if (isListening) {
      recognitionRef.current?.stop()
      setIsListening(false)
      return
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition

    if (!SpeechRecognition) {
      setError('Voice input is not supported in this browser. Try Chrome on Android or desktop.')
      return
    }

    setError(null)
    setTranscript('')
    setAiResponse('')

    const recognition = new SpeechRecognition()
    recognition.lang = currentLang.speechCode
    recognition.interimResults = false
    recognition.maxAlternatives = 1

    recognition.onstart = () => setIsListening(true)

    recognition.onresult = (event: any) => {
      const text = event.results[0][0].transcript
      setTranscript(text)
      askBackend(text)
    }

    recognition.onerror = (event: any) => {
      setIsListening(false)
      if (event.error === 'not-allowed') {
        setError('Microphone permission denied. Allow mic access in your browser settings.')
      } else if (event.error === 'no-speech') {
        setError('No speech detected. Try again.')
      } else {
        setError(`Voice input error: ${event.error}`)
      }
    }

    recognition.onend = () => setIsListening(false)

    recognitionRef.current = recognition
    recognition.start()
  }

  const trySampleQuery = (query: string) => {
    setTranscript(query)
    askBackend(query)
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
          <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
            {languages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => setLanguage(lang.code)}
                className={`p-3 rounded-lg border-2 transition-all ${
                  language === lang.code
                    ? 'border-primary bg-primary/10'
                    : 'border-border bg-background hover:border-primary/50'
                }`}
              >
                <div className="text-xl mb-1">{lang.flag}</div>
                <div className="text-xs font-medium text-foreground">{lang.name}</div>
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
              {isListening ? <Square className="text-white" size={40} /> : <Mic className="text-white" size={40} />}
            </button>
          </div>

          <p className="text-muted-foreground mb-4">
            {isListening ? 'Listening... Speak now' : loading ? 'Thinking...' : 'Tap the microphone to start speaking'}
          </p>

          {transcript && (
            <div className="bg-background border border-border rounded-lg p-4 mt-6">
              <p className="text-sm text-muted-foreground mb-2">Your question:</p>
              <p className="text-lg text-foreground font-medium">"{transcript}"</p>
            </div>
          )}

          {aiResponse && (
            <div className="bg-primary/10 border border-primary/20 rounded-lg p-4 mt-4 text-left">
              <p className="text-sm text-primary font-semibold mb-2 flex items-center gap-2">
                <Volume2 size={16} /> AgriMind says:
              </p>
              <p className="text-lg text-foreground">{aiResponse}</p>
            </div>
          )}

          {error && (
            <div className="bg-destructive/10 border border-destructive rounded-lg p-4 mt-4 flex gap-3 items-start text-left">
              <AlertCircle className="text-destructive flex-shrink-0" size={20} />
              <p className="text-sm text-destructive">{error}</p>
            </div>
          )}
        </div>

        {/* Sample Queries */}
        <div className="bg-card border border-border rounded-lg p-6 mb-8">
          <h2 className="text-lg font-semibold text-foreground mb-4">Try These Voice Commands</h2>
          <div className="space-y-3">
            {[
              { icon: '💧', q: 'What is the soil moisture level?', desc: 'Get current soil moisture data' },
              { icon: '🌤️', q: 'Show me the weather forecast', desc: 'Get live weather and rain probability' },
              { icon: '🚿', q: 'Should I irrigate today?', desc: 'Get irrigation recommendation' },
              { icon: '📊', q: 'How much water do I need?', desc: 'Get water requirement in L/m²' },
            ].map((item) => (
              <button
                key={item.q}
                onClick={() => trySampleQuery(item.q)}
                className="w-full flex items-start gap-3 p-3 bg-background rounded-lg hover:border-primary/50 cursor-pointer transition-all border border-border text-left"
              >
                <span className="text-xl">{item.icon}</span>
                <div>
                  <p className="font-medium text-foreground">{item.q}</p>
                  <p className="text-sm text-muted-foreground">{item.desc}</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}