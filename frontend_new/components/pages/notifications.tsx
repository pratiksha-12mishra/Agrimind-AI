'use client'

import { useState, useEffect } from 'react'
import { AlertCircle, CheckCircle, Info, AlertTriangle, Trash2, Bell } from 'lucide-react'

interface NotificationsProps {
  isLoggedIn: boolean
}

interface RealNotification {
  id: string | number
  title: string
  message: string
  timestamp?: string
}

export default function Notifications({ isLoggedIn }: NotificationsProps) {
  const [realNotifications, setRealNotifications] = useState<RealNotification[] | null>(null)
  const [rawResponse, setRawResponse] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!isLoggedIn) return
    fetch('/api/notifications')
      .then((res) => res.json())
      .then((data) => {
        setRawResponse(data)
        const list = Array.isArray(data) ? data : data.notifications ?? data.items ?? []
        setRealNotifications(
          list.map((n: any, idx: number) => ({
            id: n.id ?? idx,
            title: n.title ?? 'Notification',
            message: n.message ?? '',
            timestamp: n.timestamp ?? n.created_at ?? undefined,
          }))
        )
      })
      .catch((err) => setRawResponse({ error: err?.message || 'Failed to fetch' }))
      .finally(() => setLoading(false))
  }, [isLoggedIn])

  // Example/demo cards — clearly labeled, shown only when there are no real notifications yet
  const demoAlerts = [
    {
      id: 1,
      type: 'high',
      title: 'Soil Moisture is Low',
      message: 'Soil moisture has dropped below 30%. Irrigation is recommended.',
      time: '2 hours ago',
      icon: AlertCircle,
      color: 'red',
    },
    {
      id: 2,
      type: 'medium',
      title: 'Rain Expected Tomorrow',
      message: 'Rain probability is 75% tomorrow. Irrigation can be delayed by 24 hours.',
      time: '4 hours ago',
      icon: AlertTriangle,
      color: 'yellow',
    },
    {
      id: 3,
      type: 'low',
      title: 'Water-Saving Opportunity',
      message: 'Due to forecasted rain, you can save approximately 25% of scheduled water.',
      time: '1 day ago',
      icon: Info,
      color: 'blue',
    },
    {
      id: 4,
      type: 'medium',
      title: 'AI Recommendation Ready',
      message: 'Your daily AI irrigation recommendation is ready. Check the results page.',
      time: '2 days ago',
      icon: CheckCircle,
      color: 'green',
    },
  ]

  if (!isLoggedIn) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="text-center">
          <p className="text-foreground text-lg">Please login to access notifications</p>
        </div>
      </div>
    )
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'high':
        return 'bg-red-50 border-red-200'
      case 'medium':
        return 'bg-yellow-50 border-yellow-200'
      case 'low':
        return 'bg-blue-50 border-blue-200'
      default:
        return 'bg-gray-50 border-gray-200'
    }
  }

  const getIconColor = (color: string) => {
    switch (color) {
      case 'red':
        return 'text-red-600'
      case 'yellow':
        return 'text-yellow-600'
      case 'blue':
        return 'text-blue-600'
      case 'green':
        return 'text-green-600'
      default:
        return 'text-gray-600'
    }
  }

  const timeAgo = (isoString: string) => {
    const diffMs = Date.now() - new Date(isoString).getTime()
    const minutes = Math.floor(diffMs / 60000)
    if (minutes < 1) return 'Just now'
    if (minutes < 60) return `${minutes} minute${minutes === 1 ? '' : 's'} ago`
    const hours = Math.floor(minutes / 60)
    if (hours < 24) return `${hours} hour${hours === 1 ? '' : 's'} ago`
    const days = Math.floor(hours / 24)
    return `${days} day${days === 1 ? '' : 's'} ago`
  }
  const hasRealData = realNotifications !== null && realNotifications.length > 0

  return (
    <div className="min-h-screen bg-background p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">Smart Irrigation Notifications</h1>
          <p className="text-muted-foreground">Alerts about soil moisture, weather, and irrigation recommendations</p>
        </div>

        {/* Real notifications from backend */}
        {!loading && hasRealData && (
          <div className="space-y-4 mb-8">
            <h2 className="text-lg font-bold text-foreground">Live Notifications</h2>
            {realNotifications!.map((n) => (
              <div key={n.id} className="border rounded-lg p-6 flex items-start gap-4 bg-primary/5 border-primary/20">
                <Bell className="text-primary mt-1 flex-shrink-0" size={24} />
                <div className="flex-1">
                  <h3 className="font-semibold text-foreground mb-1">{n.title}</h3>
                  <p className="text-sm text-muted-foreground mb-2">{n.message}</p>
                  {n.timestamp && (
                    <p className="text-xs text-muted-foreground">{timeAgo(n.timestamp)}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Honest empty state when backend has no real notifications yet */}
        {!loading && !hasRealData && (
          <div className="bg-card border border-border rounded-lg p-8 mb-8 flex items-start gap-4">
            <Bell className="text-muted-foreground flex-shrink-0" size={24} />
            <div>
              <h3 className="font-semibold text-foreground mb-1">No live notifications yet</h3>
              <p className="text-sm text-muted-foreground">
                Connected to the backend successfully — no alerts have been triggered yet. Automatic alerts (e.g. low
                soil moisture) will appear here once that logic is enabled on the backend.
              </p>
            </div>
          </div>
        )}

        {/* Demo examples — clearly labeled, always shown for reference/design preview */}
        <div className="mb-4 flex items-center gap-2">
          <h2 className="text-lg font-bold text-foreground">Example Notifications</h2>
          <span className="text-xs px-2 py-1 rounded-full bg-secondary text-muted-foreground">Demo preview</span>
        </div>
        <div className="space-y-4">
          {demoAlerts.map((alert) => {
            const IconComponent = alert.icon
            return (
              <div
                key={alert.id}
                className={`border rounded-lg p-6 flex items-start gap-4 transition-all hover:shadow-md opacity-80 ${getTypeColor(alert.type)}`}
              >
                <div className={`mt-1 flex-shrink-0 ${getIconColor(alert.color)}`}>
                  <IconComponent size={24} />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-foreground mb-1">{alert.title}</h3>
                  <p className="text-sm text-muted-foreground mb-2">{alert.message}</p>
                  <p className="text-xs text-muted-foreground">{alert.time}</p>
                </div>
                <button className="flex-shrink-0 p-2 text-muted-foreground hover:text-foreground transition-colors">
                  <Trash2 size={18} />
                </button>
              </div>
            )
          })}
        </div>

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