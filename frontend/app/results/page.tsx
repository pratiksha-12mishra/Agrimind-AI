import Link from "next/link"
import { ArrowLeft, Droplets, Gauge, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AnalyticsCharts } from "@/components/analytics-charts"
import { mockResult } from "@/lib/agrimind-data"

export default function ResultsPage() {
  const r = mockResult
  return (
    <main className="min-h-screen px-5 py-8 md:px-8">
      <div className="mx-auto max-w-3xl space-y-6">
        <Link
          href="/"
          className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="size-4" /> Back
        </Link>

        <div className="text-center">
          <h1 className="font-heading text-3xl font-bold capitalize text-balance">
            Recommendation for {r.crop}
          </h1>
        </div>

        {/* Decision banner */}
        <Card className="border-2 border-primary bg-primary text-primary-foreground">
          <CardContent className="flex flex-col gap-4 py-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm opacity-90">Today&apos;s decision</p>
              <h2 className="font-heading text-2xl font-bold">{r.decision}</h2>
              <p className="mt-2 max-w-md text-sm opacity-90 leading-relaxed">
                {r.explanation}
              </p>
            </div>
            <div className="flex items-center gap-3 rounded-2xl bg-primary-foreground/15 px-5 py-4">
              <Droplets className="size-7" />
              <div>
                <p className="font-heading text-2xl font-bold">
                  {r.water_required}
                </p>
                <p className="text-xs opacity-90">Water required</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick stats */}
        <div className="grid gap-4 sm:grid-cols-3">
          <Stat icon={Gauge} label="AI Confidence" value={`${r.confidence}%`} />
          <Stat
            icon={Droplets}
            label="Humidity"
            value={`${r.weather.humidity}%`}
          />
          <Stat
            icon={Sparkles}
            label="Rain Chance"
            value={`${r.weather.rain_probability}%`}
          />
        </div>

        {/* Current weather */}
        <Card>
          <CardHeader>
            <CardTitle className="font-heading text-lg">Current Weather</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-3 gap-2 text-center">
            <Weather value={`${r.weather.temperature}°C`} label="Temperature" />
            <Weather value={`${r.weather.humidity}%`} label="Humidity" />
            <Weather
              value={`${r.weather.rain_probability}%`}
              label="Rain Chance"
            />
          </CardContent>
        </Card>

        {/* Analytics: pie + moving graphs */}
        <div>
          <h2 className="mb-3 font-heading text-xl font-semibold">Analytics</h2>
          <AnalyticsCharts />
        </div>

        <Button asChild className="w-full" size="lg">
          <Link href="/predict">New Prediction</Link>
        </Button>
      </div>
    </main>
  )
}

function Stat({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ className?: string }>
  label: string
  value: string
}) {
  return (
    <Card className="texture-field">
      <CardContent className="flex items-center gap-3 py-4">
        <Icon className="size-6 text-primary" />
        <div>
          <p className="font-heading text-xl font-bold">{value}</p>
          <p className="text-xs text-muted-foreground">{label}</p>
        </div>
      </CardContent>
    </Card>
  )
}

function Weather({ value, label }: { value: string; label: string }) {
  return (
    <div>
      <p className="font-heading text-2xl font-bold text-primary">{value}</p>
      <p className="text-xs text-muted-foreground">{label}</p>
    </div>
  )
}
