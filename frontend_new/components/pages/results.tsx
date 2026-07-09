'use client'

import { useState, useEffect } from 'react'
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { GripVertical, RotateCcw } from 'lucide-react'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core'
import { SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { arrayMove } from '@dnd-kit/sortable'

const CHARTS_DATA = [
  {
    id: 'yield-trend',
    title: 'Yield Trend',
    data: [
      { month: 'Jan', yield: 3500 },
      { month: 'Feb', yield: 3800 },
      { month: 'Mar', yield: 4200 },
      { month: 'Apr', yield: 4100 },
      { month: 'May', yield: 4500 },
      { month: 'Jun', yield: 4700 },
    ],
  },
  {
    id: 'crop-distribution',
    title: 'Crop Distribution',
    data: [
      { name: 'Rice', value: 45 },
      { name: 'Wheat', value: 30 },
      { name: 'Corn', value: 15 },
      { name: 'Other', value: 10 },
    ],
  },
  {
    id: 'weather-impact',
    title: 'Weather Impact on Yield',
    data: [
      { factor: 'Rainfall', value: 65 },
      { factor: 'Temperature', value: 55 },
      { factor: 'Humidity', value: 48 },
      { factor: 'Sunlight', value: 72 },
    ],
  },
  {
    id: 'soil-quality',
    title: 'Soil Quality Metrics',
    data: [
      { metric: 'Nitrogen', value: 65 },
      { metric: 'Phosphorus', value: 58 },
      { metric: 'Potassium', value: 72 },
      { metric: 'pH Level', value: 68 },
    ],
  },
]

const COLORS = ['#6b8c42', '#556b2f', '#8b9d6f', '#c5b99a']

interface ChartItemProps {
  chart: (typeof CHARTS_DATA)[0]
}

function ChartItem({ chart }: ChartItemProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: chart.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 10 : 0,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="bg-card border border-border rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow"
    >
      {/* Header with drag handle */}
      <div className="flex items-center justify-between mb-6 group">
        <h3 className="text-lg font-bold text-foreground">{chart.title}</h3>
        <div
          {...attributes}
          {...listeners}
          className="p-2 rounded-md text-muted-foreground hover:bg-secondary cursor-grab active:cursor-grabbing transition-colors"
        >
          <GripVertical size={20} />
        </div>
      </div>

      {/* Chart */}
      <div className="w-full h-64">
        {chart.id === 'yield-trend' && (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chart.data}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis stroke="var(--muted-foreground)" />
              <YAxis stroke="var(--muted-foreground)" />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="yield" stroke="var(--primary)" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        )}

        {chart.id === 'crop-distribution' && (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={chart.data} cx="50%" cy="50%" labelLine={false} label={({ name, value }) => `${name}: ${value}%`} outerRadius={80} fill="var(--primary)" dataKey="value">
                {chart.data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        )}

        {(chart.id === 'weather-impact' || chart.id === 'soil-quality') && (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chart.data}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis stroke="var(--muted-foreground)" />
              <YAxis stroke="var(--muted-foreground)" />
              <Tooltip />
              <Legend />
              <Bar dataKey="value" fill="var(--primary)" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  )
}

export default function Results() {
  const [charts, setCharts] = useState(CHARTS_DATA)
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  )

  // Load saved layout from localStorage
  useEffect(() => {
    const savedOrder = localStorage.getItem('agrimind-chart-order')
    if (savedOrder) {
      try {
        const order = JSON.parse(savedOrder)
        const reordered = order.map((id: string) => CHARTS_DATA.find((c) => c.id === id)).filter(Boolean)
        if (reordered.length === CHARTS_DATA.length) {
          setCharts(reordered)
        }
      } catch (e) {
        // Ignore parsing errors
      }
    }
  }, [])

  const handleDragEnd = (event: any) => {
    const { active, over } = event

    if (over && active.id !== over.id) {
      const activeIndex = charts.findIndex((c) => c.id === active.id)
      const overIndex = charts.findIndex((c) => c.id === over.id)
      const newCharts = arrayMove(charts, activeIndex, overIndex)
      setCharts(newCharts)
      // Save to localStorage
      localStorage.setItem(
        'agrimind-chart-order',
        JSON.stringify(newCharts.map((c) => c.id)),
      )
    }
  }

  const handleResetLayout = () => {
    setCharts(CHARTS_DATA)
    localStorage.removeItem('agrimind-chart-order')
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-12">
          <div>
            <h1 className="text-4xl font-bold text-foreground mb-2">Prediction Results</h1>
            <p className="text-muted-foreground">Drag charts to reorder them. Layout is saved automatically.</p>
          </div>
          <button
            onClick={handleResetLayout}
            className="mt-4 sm:mt-0 inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-secondary text-foreground hover:opacity-80 font-medium transition-opacity"
          >
            <RotateCcw size={16} />
            Reset Layout
          </button>
        </div>

        {/* Prediction Summary */}
        <div className="grid md:grid-cols-4 gap-4 mb-12">
          <div className="bg-card border border-border rounded-lg p-6">
            <p className="text-muted-foreground text-sm font-medium mb-2">Current Yield</p>
            <p className="text-3xl font-bold text-primary">4,725 kg/ha</p>
          </div>
          <div className="bg-card border border-border rounded-lg p-6">
            <p className="text-muted-foreground text-sm font-medium mb-2">Confidence</p>
            <p className="text-3xl font-bold text-primary">92.5%</p>
          </div>
          <div className="bg-card border border-border rounded-lg p-6">
            <p className="text-muted-foreground text-sm font-medium mb-2">Risk Level</p>
            <p className="text-3xl font-bold text-accent">Low</p>
          </div>
          <div className="bg-card border border-border rounded-lg p-6">
            <p className="text-muted-foreground text-sm font-medium mb-2">Last Updated</p>
            <p className="text-3xl font-bold text-primary">2 hrs</p>
          </div>
        </div>

        {/* Draggable Charts */}
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={charts.map((c) => c.id)} strategy={verticalListSortingStrategy}>
            <div className="grid md:grid-cols-2 gap-8">
              {charts.map((chart) => (
                <ChartItem key={chart.id} chart={chart} />
              ))}
            </div>
          </SortableContext>
        </DndContext>

        {/* Recommendations */}
        <div className="mt-12 bg-secondary rounded-lg p-8 border border-border">
          <h2 className="text-2xl font-bold text-foreground mb-6">Key Recommendations</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-card rounded-lg p-4 border border-border">
              <p className="font-semibold text-foreground mb-2">Soil Optimization</p>
              <p className="text-muted-foreground text-sm">Increase potassium levels to improve crop quality and yield.</p>
            </div>
            <div className="bg-card rounded-lg p-4 border border-border">
              <p className="font-semibold text-foreground mb-2">Irrigation Schedule</p>
              <p className="text-muted-foreground text-sm">Maintain consistent moisture levels during critical growth phases.</p>
            </div>
            <div className="bg-card rounded-lg p-4 border border-border">
              <p className="font-semibold text-foreground mb-2">Pest Control</p>
              <p className="text-muted-foreground text-sm">Monitor for early signs of pests given favorable weather conditions.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
