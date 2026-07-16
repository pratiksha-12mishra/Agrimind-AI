'use client'

import { useState, useEffect, useMemo } from 'react'
import { Droplets, AlertCircle, Loader2 } from 'lucide-react'
import { Skeleton } from '@/components/ui/skeleton'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

// Backend field names aren't fully confirmed yet — normalize defensively
// so this page doesn't break if names differ slightly from what we expect.
function normalizeRecord(r: any, idx: number) {
  const rawWater = r.water_required_raw ?? r.water_required
  return {
    id: r.id ?? r._id ?? `record-${idx}`,
    timestamp: r.timestamp ?? r.created_at ?? r.createdAt ?? r.date ?? null,
    city: r.city ?? r.weather?.city ?? '—',
    crop: r.crop ?? r.crop_type ?? '—',
    growth_stage: r.growth_stage ?? '—',
    soil_moisture: typeof r.soil_moisture === 'number' ? r.soil_moisture : null,
    decision: r.decision ?? r.recommendation ?? '—',
    water_required: typeof rawWater === 'number' ? rawWater : parseFloat(rawWater) || 0,
    confidence: typeof r.confidence === 'number' ? r.confidence : null,
  }
}

export default function History() {
  const [records, setRecords] = useState<ReturnType<typeof normalizeRecord>[]>([])
  const [rawResponse, setRawResponse] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [view, setView] = useState<'weekly' | 'monthly'>('weekly')

  useEffect(() => {
    const fetchHistory = async () => {
      setLoading(true)
      setError(null)
      try {
        const res = await fetch('/api/history')
        const data = await res.json()
        setRawResponse(data)

        if (!res.ok) {
          setError(data.error || `Error: ${res.status}`)
          setRecords([])
          return
        }

        const list = Array.isArray(data) ? data : data.history ?? data.items ?? data.data ?? data.records ?? []
        setRecords(list.map(normalizeRecord))
      } catch (err: any) {
        setError(err?.message || 'Failed to load history')
      } finally {
        setLoading(false)
      }
    }

    fetchHistory()
  }, [])

  const filteredRecords = useMemo(() => {
    const now = Date.now()
    const windowMs = (view === 'weekly' ? 7 : 30) * 24 * 60 * 60 * 1000
    return records.filter((r) => {
      if (!r.timestamp) return true // keep records with no timestamp rather than hiding them
      const t = new Date(r.timestamp).getTime()
      return !isNaN(t) && now - t <= windowMs
    })
  }, [records, view])

  const chartData = useMemo(() => {
    const byDay: Record<string, number> = {}
    filteredRecords.forEach((r) => {
      const label = r.timestamp
        ? new Date(r.timestamp).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })
        : 'Unknown'
      byDay[label] = (byDay[label] || 0) + r.water_required
    })
    return Object.entries(byDay).map(([date, water]) => ({ date, water: Math.round(water * 10) / 10 }))
  }, [filteredRecords])

  const totalWater = filteredRecords.reduce((sum, r) => sum + r.water_required, 0)
  const avgConfidence =
    filteredRecords.filter((r) => r.confidence !== null).reduce((sum, r) => sum + (r.confidence ?? 0), 0) /
    (filteredRecords.filter((r) => r.confidence !== null).length || 1)

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <Skeleton className="h-10 w-72 mb-2" />
          <Skeleton className="h-5 w-96 mb-8" />
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <Skeleton className="h-28 w-full rounded-lg" />
            <Skeleton className="h-28 w-full rounded-lg" />
            <Skeleton className="h-28 w-full rounded-lg" />
          </div>
          <Skeleton className="h-64 w-full rounded-lg" />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-start justify-between flex-wrap gap-4 mb-2">
          <div>
            <h1 className="text-4xl font-bold text-foreground mb-2">Irrigation History</h1>
            <p className="text-muted-foreground">View your previous irrigation recommendations and decisions</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setView('weekly')}
              className={`px-4 py-2 rounded-lg text-sm font-semibold ${
                view === 'weekly' ? 'bg-primary text-primary-foreground' : 'bg-secondary text-foreground'
              }`}
            >
              Weekly
            </button>
            <button
              onClick={() => setView('monthly')}
              className={`px-4 py-2 rounded-lg text-sm font-semibold ${
                view === 'monthly' ? 'bg-primary text-primary-foreground' : 'bg-secondary text-foreground'
              }`}
            >
              Monthly
            </button>
          </div>
        </div>

        {error && (
          <div className="mt-6 bg-destructive/10 border border-destructive rounded-lg p-4 flex gap-3">
            <AlertCircle className="text-destructive flex-shrink-0" size={20} />
            <div>
              <p className="text-sm text-destructive font-semibold">Could not load history</p>
              <p className="text-sm text-destructive mt-1">{error}</p>
            </div>
          </div>
        )}

        {!error && filteredRecords.length === 0 && (
          <div className="mt-6 bg-card rounded-lg p-12 border border-border text-center">
            <div className="inline-block p-4 rounded-full bg-secondary mb-6">
              <Droplets className="text-primary" size={40} />
            </div>
            <h2 className="text-2xl font-bold text-foreground mb-3">No History Yet</h2>
            <p className="text-muted-foreground max-w-md mx-auto">
              Once you submit a few irrigation predictions, they'll show up here with charts and stats.
            </p>
          </div>
        )}

        {filteredRecords.length > 0 && (
          <>
            {/* Summary cards */}
            <div className="grid md:grid-cols-3 gap-6 mt-8 mb-8">
              <div className="bg-card rounded-lg p-6 border border-border">
                <p className="text-sm text-muted-foreground font-semibold uppercase mb-2">Total Water Used</p>
                <p className="text-3xl font-bold text-foreground">{totalWater.toFixed(1)} L/m²</p>
                <p className="text-xs text-muted-foreground mt-1">{view === 'weekly' ? 'This week' : 'This month'}</p>
              </div>
              <div className="bg-card rounded-lg p-6 border border-border">
                <p className="text-sm text-muted-foreground font-semibold uppercase mb-2">Recommendations Made</p>
                <p className="text-3xl font-bold text-foreground">{filteredRecords.length}</p>
                <p className="text-xs text-muted-foreground mt-1">{view === 'weekly' ? 'This week' : 'This month'}</p>
              </div>
              <div className="bg-card rounded-lg p-6 border border-border">
                <p className="text-sm text-muted-foreground font-semibold uppercase mb-2">Avg. AI Confidence</p>
                <p className="text-3xl font-bold text-foreground">{avgConfidence.toFixed(1)}%</p>
                <p className="text-xs text-muted-foreground mt-1">Across shown records</p>
              </div>
            </div>

            {/* Bar chart */}
            <div className="bg-card rounded-lg p-8 border border-border mb-8">
              <h3 className="text-xl font-bold text-foreground mb-6">Water Usage Over Time</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--color-muted)" />
                    <XAxis dataKey="date" stroke="var(--color-muted-foreground)" fontSize={12} />
                    <YAxis stroke="var(--color-muted-foreground)" fontSize={12} />
                    <Tooltip formatter={(value: number) => `${value} L/m²`} />
                    <Bar dataKey="water" fill="var(--color-primary)" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Record list */}
            <div className="bg-card rounded-lg border border-border overflow-hidden">
              <div className="p-6 border-b border-border">
                <h3 className="text-xl font-bold text-foreground">Recent Recommendations</h3>
              </div>
              <div className="divide-y divide-border">
                {filteredRecords.map((r) => (
                  <div key={r.id} className="p-6 flex items-center justify-between flex-wrap gap-4">
                    <div>
                      <p className="font-semibold text-foreground">
                        {r.crop} — {r.city}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {r.growth_stage} · Soil moisture: {r.soil_moisture ?? '—'}%
                        {r.timestamp && ` · ${new Date(r.timestamp).toLocaleString('en-IN')}`}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-primary">{r.decision}</p>
                      <p className="text-sm text-muted-foreground">
                        {r.water_required.toFixed(1)} L/m² {r.confidence !== null && `· ${r.confidence}% confidence`}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {/* Debug panel */}
        <details className="mt-10 bg-card rounded-lg p-4 border border-border">
          <summary className="cursor-pointer text-sm font-semibold text-muted-foreground">
            Debug: raw backend response
          </summary>
          <pre className="mt-3 text-xs overflow-auto p-3 bg-secondary rounded-lg text-foreground max-h-96">
            {JSON.stringify(rawResponse, null, 2)}
          </pre>
        </details>
      </div>
    </div>
  )
}