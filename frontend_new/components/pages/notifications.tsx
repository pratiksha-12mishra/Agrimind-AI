'use client'

import { AlertCircle, CheckCircle, Info, AlertTriangle, Trash2 } from 'lucide-react'

interface NotificationsProps {
  isLoggedIn: boolean
}

export default function Notifications({ isLoggedIn }: NotificationsProps) {
  const alerts = [
    {
      id: 1,
      type: 'high',
      title: 'Soil Moisture Critical',
      message: 'Soil moisture has dropped below 40%. Irrigation needed immediately.',
      time: '2 hours ago',
      icon: AlertCircle,
      color: 'red',
    },
    {
      id: 2,
      type: 'medium',
      title: 'Weather Alert',
      message: 'Heavy rain expected tomorrow. Consider postponing irrigation.',
      time: '4 hours ago',
      icon: AlertTriangle,
      color: 'yellow',
    },
    {
      id: 3,
      type: 'high',
      title: 'Motor Overheating',
      message: 'Motor temperature is rising. Check for blockages or reduce usage.',
      time: '6 hours ago',
      icon: AlertCircle,
      color: 'red',
    },
    {
      id: 4,
      type: 'low',
      title: 'System Update Available',
      message: 'A new version of AgriMind is available with improved features.',
      time: '1 day ago',
      icon: Info,
      color: 'blue',
    },
    {
      id: 5,
      type: 'medium',
      title: 'Humidity Optimal',
      message: 'Humidity levels are perfect for crop growth today.',
      time: '1 day ago',
      icon: CheckCircle,
      color: 'green',
    },
    {
      id: 6,
      type: 'medium',
      title: 'Prediction Ready',
      message: 'Your daily AI prediction is ready. Check the results for recommendations.',
      time: '2 days ago',
      icon: CheckCircle,
      color: 'green',
    },
    {
      id: 7,
      type: 'low',
      title: 'Weekly Summary',
      message: 'Your weekly farming summary is ready. Average yield: 2.4 tons/hectare.',
      time: '3 days ago',
      icon: Info,
      color: 'blue',
    },
    {
      id: 8,
      type: 'high',
      title: 'Soil Moisture Low',
      message: 'Soil moisture is at 45%. Recommended watering schedule updated.',
      time: '1 week ago',
      icon: AlertCircle,
      color: 'red',
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

  return (
    <div className="min-h-screen bg-background p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">Notifications</h1>
          <p className="text-muted-foreground">History of all alerts and updates</p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-card border border-border rounded-lg p-4 text-center">
            <div className="text-3xl font-bold text-red-600 mb-1">{alerts.filter((a) => a.type === 'high').length}</div>
            <p className="text-sm text-muted-foreground">Critical</p>
          </div>
          <div className="bg-card border border-border rounded-lg p-4 text-center">
            <div className="text-3xl font-bold text-yellow-600 mb-1">{alerts.filter((a) => a.type === 'medium').length}</div>
            <p className="text-sm text-muted-foreground">Warnings</p>
          </div>
          <div className="bg-card border border-border rounded-lg p-4 text-center">
            <div className="text-3xl font-bold text-green-600 mb-1">{alerts.filter((a) => a.type === 'low' && a.icon === CheckCircle).length}</div>
            <p className="text-sm text-muted-foreground">Success</p>
          </div>
          <div className="bg-card border border-border rounded-lg p-4 text-center">
            <div className="text-3xl font-bold text-blue-600 mb-1">{alerts.length}</div>
            <p className="text-sm text-muted-foreground">Total</p>
          </div>
        </div>

        {/* Alerts List */}
        <div className="space-y-4">
          {alerts.map((alert) => {
            const IconComponent = alert.icon
            return (
              <div
                key={alert.id}
                className={`border rounded-lg p-6 flex items-start gap-4 transition-all hover:shadow-md ${getTypeColor(alert.type)}`}
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

        {/* Clear All Button */}
        <div className="mt-8 text-center">
          <button className="px-6 py-2 text-muted-foreground hover:text-foreground transition-colors text-sm">
            Clear all notifications
          </button>
        </div>
      </div>
    </div>
  )
}
