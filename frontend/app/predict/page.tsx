"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Droplets, Leaf, MapPin, Sprout, Wheat } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { CROPS, STAGES } from "@/lib/agrimind-data"

export default function PredictPage() {
  const router = useRouter()
  const [crop, setCrop] = useState<string>("wheat")
  const [stage, setStage] = useState<string>("seedling")
  const [moisture, setMoisture] = useState<number>(30)
  const [location, setLocation] = useState<string>("")
  const [loading, setLoading] = useState(false)

  function handleSubmit() {
    setLoading(true)
    setTimeout(() => router.push("/results"), 600)
  }

  return (
    <main className="min-h-screen px-5 py-8 md:px-8">
      <div className="mx-auto max-w-xl">
        <Link
          href="/"
          className="mb-6 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="size-4" /> Back
        </Link>

        <div className="mb-6 text-center">
          <span className="mx-auto mb-3 flex size-12 items-center justify-center rounded-2xl bg-primary text-primary-foreground animate-floaty">
            <Sprout className="size-6" />
          </span>
          <h1 className="font-heading text-3xl font-bold text-balance">
            Enter Field Details
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Tell us about your field — we&apos;ll do the thinking.
          </p>
        </div>

        {/* Textured, creative form card */}
        <Card className="texture-field relative overflow-hidden border-2 p-6 md:p-8">
          {/* decorative corner leaves */}
          <Leaf className="pointer-events-none absolute -right-4 -top-4 size-24 rotate-12 text-primary/10" />
          <Leaf className="pointer-events-none absolute -bottom-6 -left-4 size-24 -rotate-12 text-primary/10" />

          <div className="relative space-y-6">
            <Field icon={Wheat} label="Crop">
              <Select value={crop} onValueChange={setCrop}>
                <SelectTrigger className="bg-background">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {CROPS.map((c) => (
                    <SelectItem key={c} value={c} className="capitalize">
                      {c}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>

            <Field icon={Sprout} label="Growth Stage">
              <Select value={stage} onValueChange={setStage}>
                <SelectTrigger className="bg-background">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {STAGES.map((s) => (
                    <SelectItem key={s} value={s} className="capitalize">
                      {s}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>

            <Field icon={Droplets} label={`Soil Moisture: ${moisture}%`}>
              <Slider
                value={[moisture]}
                onValueChange={(v) => setMoisture(v[0])}
                min={0}
                max={100}
                step={1}
                className="py-2"
              />
            </Field>

            <Field icon={MapPin} label="Location (City)">
              <Input
                placeholder="e.g. Jabalpur"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="bg-background"
              />
            </Field>

            <Button
              onClick={handleSubmit}
              disabled={loading || !location}
              className="w-full"
              size="lg"
            >
              {loading ? "Analyzing field…" : "Get Recommendation"}
            </Button>
          </div>
        </Card>
      </div>
    </main>
  )
}

function Field({
  icon: Icon,
  label,
  children,
}: {
  icon: React.ComponentType<{ className?: string }>
  label: string
  children: React.ReactNode
}) {
  return (
    <div className="space-y-2">
      <Label className="flex items-center gap-2 text-sm font-medium">
        <Icon className="size-4 text-primary" />
        {label}
      </Label>
      {children}
    </div>
  )
}
