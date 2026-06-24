"use client"

import { useEffect, useState } from "react"
import {
  Area,
  AreaChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { moistureTrend, rainForecast, waterBudget } from "@/lib/agrimind-data"

const PIE_COLORS = [
  "var(--chart-1)",
  "var(--chart-2)",
  "var(--chart-3)",
  "var(--chart-5)",
]

function ChartTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null
  return (
    <div className="rounded-lg border border-border bg-popover px-3 py-2 text-xs shadow-md">
      {label ? <p className="mb-1 font-medium">{label}</p> : null}
      {payload.map((p: any) => (
        <p key={p.dataKey ?? p.name} className="text-muted-foreground">
          <span className="font-semibold text-foreground">
            {p.name ?? p.dataKey}
          </span>
          : {p.value}
          {typeof p.value === "number" && p.value <= 100 ? "" : ""}
        </p>
      ))}
    </div>
  )
}

export function AnalyticsCharts() {
  // Live "moving" line chart — appends a new soil-moisture reading every 2s
  const [live, setLive] = useState(() =>
    Array.from({ length: 10 }, (_, i) => ({
      t: i,
      value: 24 + Math.round(Math.sin(i / 1.5) * 6 + Math.random() * 3),
    })),
  )

  useEffect(() => {
    const id = setInterval(() => {
      setLive((prev) => {
        const last = prev[prev.length - 1]
        const next = {
          t: last.t + 1,
          value: Math.max(
            12,
            Math.min(48, last.value + Math.round((Math.random() - 0.5) * 8)),
          ),
        }
        return [...prev.slice(1), next]
      })
    }, 2000)
    return () => clearInterval(id)
  }, [])

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {/* Live moving sensor graph */}
      <Card className="md:col-span-2">
        <CardHeader className="flex-row items-center justify-between space-y-0">
          <CardTitle className="font-heading text-lg">
            Live Soil Moisture
          </CardTitle>
          <span className="flex items-center gap-2 text-xs text-muted-foreground">
            <span className="size-2 animate-pulse rounded-full bg-primary" />
            streaming
          </span>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={live} margin={{ left: -20, right: 8 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="t" tick={false} stroke="var(--border)" />
              <YAxis
                domain={[0, 60]}
                tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
                stroke="var(--border)"
              />
              <Tooltip content={<ChartTooltip />} />
              <Line
                type="monotone"
                dataKey="value"
                stroke="var(--chart-1)"
                strokeWidth={2.5}
                dot={false}
                isAnimationActive
                animationDuration={800}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Water budget pie */}
      <Card>
        <CardHeader>
          <CardTitle className="font-heading text-lg">
            Water Budget Breakdown
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie
                data={waterBudget}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius={48}
                outerRadius={80}
                paddingAngle={3}
                animationDuration={900}
              >
                {waterBudget.map((entry, i) => (
                  <Cell key={entry.name} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip content={<ChartTooltip />} />
            </PieChart>
          </ResponsiveContainer>
          <ul className="mt-2 grid grid-cols-2 gap-1 text-xs text-muted-foreground">
            {waterBudget.map((w, i) => (
              <li key={w.name} className="flex items-center gap-2">
                <span
                  className="size-2.5 rounded-full"
                  style={{ background: PIE_COLORS[i % PIE_COLORS.length] }}
                />
                {w.name}
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      {/* 7-day moisture trend area */}
      <Card>
        <CardHeader>
          <CardTitle className="font-heading text-lg">
            7-Day Moisture Trend
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={moistureTrend} margin={{ left: -20, right: 8 }}>
              <defs>
                <linearGradient id="moistureFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--chart-1)" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="var(--chart-1)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis
                dataKey="day"
                tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
                stroke="var(--border)"
              />
              <YAxis
                tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
                stroke="var(--border)"
              />
              <Tooltip content={<ChartTooltip />} />
              <Area
                type="monotone"
                dataKey="moisture"
                stroke="var(--chart-1)"
                strokeWidth={2.5}
                fill="url(#moistureFill)"
                animationDuration={900}
              />
              <Line
                type="monotone"
                dataKey="ideal"
                stroke="var(--chart-3)"
                strokeWidth={2}
                strokeDasharray="5 4"
                dot={false}
              />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Rain probability bars-as-area for next 24h */}
      <Card className="md:col-span-2">
        <CardHeader>
          <CardTitle className="font-heading text-lg">
            Rain Probability — Next 24h
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={180}>
            <AreaChart data={rainForecast} margin={{ left: -20, right: 8 }}>
              <defs>
                <linearGradient id="rainFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--chart-2)" stopOpacity={0.45} />
                  <stop offset="95%" stopColor="var(--chart-2)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis
                dataKey="time"
                tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
                stroke="var(--border)"
              />
              <YAxis
                tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
                stroke="var(--border)"
              />
              <Tooltip content={<ChartTooltip />} />
              <Area
                type="monotone"
                dataKey="rain"
                stroke="var(--chart-2)"
                strokeWidth={2.5}
                fill="url(#rainFill)"
                animationDuration={900}
              />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  )
}
