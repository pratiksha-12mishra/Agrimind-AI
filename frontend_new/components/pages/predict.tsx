'use client'

import { useState } from 'react'
import { Cloud, Droplets, Thermometer, Zap } from 'lucide-react'

export default function Predict() {
  const [formData, setFormData] = useState({
    crop: 'rice',
    location: 'north-india',
    soilType: 'loamy',
    temperature: 25,
    humidity: 60,
    rainfall: 800,
    nitrogen: 50,
    phosphorus: 30,
    potassium: 40,
  })

  const [showResult, setShowResult] = useState(false)
  const [result, setResult] = useState<any>(null)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.type === 'number' ? parseFloat(e.target.value) : e.target.value,
    })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Mock prediction logic
    const baseYield = 4000 + Math.random() * 2000
    const tempFactor = Math.abs(formData.temperature - 25) < 5 ? 1.1 : 0.95
    const humidityFactor = Math.abs(formData.humidity - 60) < 20 ? 1.05 : 0.98
    const rainfallFactor = formData.rainfall > 600 ? 1.08 : 0.92
    const soilFactor = formData.soilType === 'loamy' ? 1.1 : formData.soilType === 'clay' ? 0.95 : 1.0

    const prediction = Math.round(baseYield * tempFactor * humidityFactor * rainfallFactor * soilFactor)
    const confidence = 75 + Math.random() * 20

    setResult({
      predictedYield: prediction,
      confidence: confidence.toFixed(1),
      recommendation: 'Optimal conditions detected. Increase nitrogen fertilizer for better yield.',
      riskLevel: confidence > 85 ? 'Low' : confidence > 70 ? 'Medium' : 'High',
    })
    setShowResult(true)
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-4xl font-bold text-foreground mb-2">Crop Prediction</h1>
        <p className="text-muted-foreground mb-12">Enter your farm details to get AI-powered yield predictions</p>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Form */}
          <div className="lg:col-span-1">
            <div className="bg-card rounded-lg p-8 border border-border sticky top-24">
              <h2 className="text-2xl font-bold text-foreground mb-6">Farm Details</h2>
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
                    <option value="rice">Rice</option>
                    <option value="wheat">Wheat</option>
                    <option value="corn">Corn</option>
                    <option value="soybean">Soybean</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Location
                  </label>
                  <select
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    className="w-full px-4 py-2 rounded-lg border border-border bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="north-india">North India</option>
                    <option value="south-india">South India</option>
                    <option value="east-india">East India</option>
                    <option value="west-india">West India</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Soil Type
                  </label>
                  <select
                    name="soilType"
                    value={formData.soilType}
                    onChange={handleChange}
                    className="w-full px-4 py-2 rounded-lg border border-border bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="loamy">Loamy</option>
                    <option value="clay">Clay</option>
                    <option value="sandy">Sandy</option>
                    <option value="silty">Silty</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    <Thermometer className="inline mr-2" size={16} /> Temperature (°C): {formData.temperature}
                  </label>
                  <input
                    type="range"
                    name="temperature"
                    min="5"
                    max="45"
                    step="1"
                    value={formData.temperature}
                    onChange={handleChange}
                    className="w-full accent-primary"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    <Droplets className="inline mr-2" size={16} /> Humidity (%): {formData.humidity}
                  </label>
                  <input
                    type="range"
                    name="humidity"
                    min="20"
                    max="100"
                    step="5"
                    value={formData.humidity}
                    onChange={handleChange}
                    className="w-full accent-primary"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    <Cloud className="inline mr-2" size={16} /> Rainfall (mm): {formData.rainfall}
                  </label>
                  <input
                    type="range"
                    name="rainfall"
                    min="200"
                    max="2000"
                    step="50"
                    value={formData.rainfall}
                    onChange={handleChange}
                    className="w-full accent-primary"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    <Zap className="inline mr-2" size={16} /> Nitrogen (kg/ha): {formData.nitrogen}
                  </label>
                  <input
                    type="range"
                    name="nitrogen"
                    min="0"
                    max="200"
                    step="5"
                    value={formData.nitrogen}
                    onChange={handleChange}
                    className="w-full accent-primary"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Phosphorus (kg/ha): {formData.phosphorus}
                  </label>
                  <input
                    type="range"
                    name="phosphorus"
                    min="0"
                    max="100"
                    step="5"
                    value={formData.phosphorus}
                    onChange={handleChange}
                    className="w-full accent-primary"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Potassium (kg/ha): {formData.potassium}
                  </label>
                  <input
                    type="range"
                    name="potassium"
                    min="0"
                    max="100"
                    step="5"
                    value={formData.potassium}
                    onChange={handleChange}
                    className="w-full accent-primary"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-lg bg-primary text-primary-foreground font-semibold hover:opacity-90 transition-opacity mt-6"
                >
                  Predict Yield
                </button>
              </form>
            </div>
          </div>

          {/* Results */}
          <div className="lg:col-span-2">
            {showResult && result ? (
              <div className="space-y-6">
                <div className="bg-primary text-primary-foreground rounded-lg p-8">
                  <h2 className="text-2xl font-bold mb-6">Prediction Results</h2>

                  <div className="grid md:grid-cols-2 gap-6 mb-6">
                    <div className="bg-white/15 rounded-lg p-6">
                      <p className="text-primary-foreground/80 mb-2">Predicted Yield</p>
                      <p className="text-5xl font-bold">{result.predictedYield}</p>
                      <p className="text-primary-foreground/80 text-sm mt-2">kg/hectare</p>
                    </div>

                    <div className="bg-white/15 rounded-lg p-6">
                      <p className="text-primary-foreground/80 mb-2">Confidence Score</p>
                      <p className="text-5xl font-bold">{result.confidence}%</p>
                      <div className="w-full bg-white/20 rounded-full h-2 mt-3">
                        <div
                          className="bg-white h-2 rounded-full transition-all"
                          style={{ width: `${result.confidence}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="flex-1 bg-white/15 rounded-lg p-4">
                      <p className="text-primary-foreground/80 text-sm mb-1">Risk Level</p>
                      <p className="font-bold text-lg">{result.riskLevel}</p>
                    </div>
                    <div className="flex-1 bg-white/15 rounded-lg p-4">
                      <p className="text-primary-foreground/80 text-sm mb-1">Status</p>
                      <p className="font-bold text-lg">Ready to Plant</p>
                    </div>
                  </div>
                </div>

                <div className="bg-card rounded-lg p-8 border border-border">
                  <h3 className="text-xl font-bold text-foreground mb-4">Recommendation</h3>
                  <p className="text-muted-foreground mb-6">{result.recommendation}</p>

                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="bg-secondary rounded-lg p-4 border border-border">
                      <p className="text-primary font-semibold text-sm">Next Step</p>
                      <p className="text-foreground mt-1">Check live sensor data</p>
                    </div>
                    <div className="bg-secondary rounded-lg p-4 border border-border">
                      <p className="text-primary font-semibold text-sm">Best Season</p>
                      <p className="text-foreground mt-1">June - September</p>
                    </div>
                    <div className="bg-secondary rounded-lg p-4 border border-border">
                      <p className="text-primary font-semibold text-sm">Optimization</p>
                      <p className="text-foreground mt-1">Increase irrigation</p>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-card rounded-lg p-12 border border-border text-center">
                <div className="inline-block p-4 rounded-full bg-secondary mb-6">
                  <Zap className="text-primary" size={32} />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2">Ready to Predict</h3>
                <p className="text-muted-foreground">Fill in your farm details on the left and click "Predict Yield" to see results</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
