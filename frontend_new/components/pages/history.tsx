'use client'

import { useState } from 'react'
import { ChevronDown, Eye } from 'lucide-react'

interface HistoryRecord {
  id: string
  date: string
  crop: string
  location: string
  yield: number
  confidence: number
  recommendation: string
}

export default function History() {
  const [expandedId, setExpandedId] = useState<string | null>(null)

  const historyData: HistoryRecord[] = [
    {
      id: '1',
      date: '2024-07-08',
      crop: 'Rice',
      location: 'North India - Punjab',
      yield: 4850,
      confidence: 94.2,
      recommendation: 'Optimal conditions detected. Continue current practices.',
    },
    {
      id: '2',
      date: '2024-06-20',
      crop: 'Wheat',
      location: 'North India - Haryana',
      yield: 5200,
      confidence: 91.5,
      recommendation: 'Increase potassium for better grain quality.',
    },
    {
      id: '3',
      date: '2024-05-15',
      crop: 'Corn',
      location: 'South India - Karnataka',
      yield: 4100,
      confidence: 85.7,
      recommendation: 'Monitor soil moisture levels during dry season.',
    },
    {
      id: '4',
      date: '2024-04-10',
      crop: 'Rice',
      location: 'East India - West Bengal',
      yield: 3900,
      confidence: 82.3,
      recommendation: 'Improve irrigation infrastructure for better water management.',
    },
    {
      id: '5',
      date: '2024-03-05',
      crop: 'Soybean',
      location: 'Central India - Madhya Pradesh',
      yield: 2800,
      confidence: 79.1,
      recommendation: 'Rotate crops to improve soil health.',
    },
    {
      id: '6',
      date: '2024-02-12',
      crop: 'Wheat',
      location: 'North India - Uttar Pradesh',
      yield: 4700,
      confidence: 88.9,
      recommendation: 'Maintain current fertilizer schedule for consistent yields.',
    },
  ]

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 90) return 'text-primary bg-primary/10'
    if (confidence >= 80) return 'text-accent bg-accent/10'
    return 'text-muted-foreground bg-muted/10'
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-2">Prediction History</h1>
          <p className="text-muted-foreground">View and analyze your previous crop predictions</p>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-4 gap-6 mb-12">
          <div className="bg-card rounded-lg p-6 border border-border">
            <p className="text-muted-foreground text-sm font-medium mb-2">Total Predictions</p>
            <p className="text-3xl font-bold text-primary">6</p>
          </div>
          <div className="bg-card rounded-lg p-6 border border-border">
            <p className="text-muted-foreground text-sm font-medium mb-2">Avg Yield</p>
            <p className="text-3xl font-bold text-accent">4,308 kg/ha</p>
          </div>
          <div className="bg-card rounded-lg p-6 border border-border">
            <p className="text-muted-foreground text-sm font-medium mb-2">Avg Confidence</p>
            <p className="text-3xl font-bold text-accent">87.0%</p>
          </div>
          <div className="bg-card rounded-lg p-6 border border-border">
            <p className="text-muted-foreground text-sm font-medium mb-2">Best Yield</p>
            <p className="text-3xl font-bold text-primary">5,200 kg/ha</p>
          </div>
        </div>

        {/* History Table/Cards */}
        <div className="space-y-4">
          {historyData.length > 0 ? (
            historyData.map((record) => (
              <div
                key={record.id}
                className="bg-card rounded-lg border border-border overflow-hidden hover:shadow-lg transition-shadow"
              >
                {/* Main row */}
                <div className="p-6">
                  <div className="grid md:grid-cols-6 gap-4 items-center">
                    <div className="md:col-span-1">
                      <p className="text-xs text-muted-foreground uppercase font-semibold mb-1">Date</p>
                      <p className="font-semibold text-foreground">{new Date(record.date).toLocaleDateString()}</p>
                    </div>

                    <div className="md:col-span-1">
                      <p className="text-xs text-muted-foreground uppercase font-semibold mb-1">Crop</p>
                      <p className="font-semibold text-foreground">{record.crop}</p>
                    </div>

                    <div className="md:col-span-2">
                      <p className="text-xs text-muted-foreground uppercase font-semibold mb-1">Location</p>
                      <p className="text-muted-foreground">{record.location}</p>
                    </div>

                    <div className="md:col-span-1">
                      <p className="text-xs text-muted-foreground uppercase font-semibold mb-1">Yield</p>
                      <p className="font-bold text-lg text-primary">{record.yield} kg/ha</p>
                    </div>

                    <div className="md:col-span-1 flex items-end justify-between">
                      <div>
                        <p className="text-xs text-muted-foreground uppercase font-semibold mb-1">Confidence</p>
                        <p className={`font-bold text-lg px-3 py-1 rounded-lg ${getConfidenceColor(record.confidence)}`}>
                          {record.confidence}%
                        </p>
                      </div>
                      <button
                        onClick={() => setExpandedId(expandedId === record.id ? null : record.id)}
                        className="text-muted-foreground hover:text-foreground transition-colors"
                      >
                        <ChevronDown
                          size={20}
                          className={`transform transition-transform ${expandedId === record.id ? 'rotate-180' : ''}`}
                        />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Expanded details */}
                {expandedId === record.id && (
                  <div className="bg-secondary px-6 py-6 border-t border-border">
                    <div className="grid md:grid-cols-2 gap-8">
                      <div>
                        <h4 className="font-bold text-foreground mb-4">Prediction Details</h4>
                        <div className="space-y-3">
                          <div>
                            <p className="text-sm text-muted-foreground">Predicted Yield</p>
                            <p className="font-semibold text-foreground text-lg">{record.yield} kg/hectare</p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">Confidence Score</p>
                            <div className="mt-2 flex items-center gap-3">
                              <div className="flex-1 bg-muted rounded-full h-2">
                                <div
                                  className="bg-primary h-2 rounded-full transition-all"
                                  style={{ width: `${record.confidence}%` }}
                                />
                              </div>
                              <span className="font-semibold text-foreground">{record.confidence}%</span>
                            </div>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">Crop Type</p>
                            <p className="font-semibold text-foreground">{record.crop}</p>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h4 className="font-bold text-foreground mb-4">Recommendation</h4>
                        <div className="bg-card rounded-lg p-4 border border-border">
                          <p className="text-muted-foreground leading-relaxed">{record.recommendation}</p>
                          <button className="mt-4 inline-flex items-center gap-2 text-primary font-medium hover:opacity-80">
                            <Eye size={16} />
                            View Full Analysis
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="bg-card rounded-lg p-12 border border-border text-center">
              <p className="text-muted-foreground text-lg">No prediction history yet. Start your first prediction to see results here.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
