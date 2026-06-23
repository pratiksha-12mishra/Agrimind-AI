"use client"

import Image from "next/image"
import Link from "next/link"
import {
  Bot,
  CloudRain,
  Code2,
  Droplets,
  History as HistoryIcon,
  Leaf,
  Mail,
  MapPin,
  Sprout,
  Trophy,
  Wheat,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function Page() {
  return (
    <main className="min-h-screen">
      {/* Top bar */}
      <header className="flex items-center justify-between px-5 py-4 md:px-8">
        <div className="flex items-center gap-2">
          <span className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Leaf className="size-5" />
          </span>
          <span className="font-heading text-xl font-semibold">
            AgriMind <span className="text-primary">AI</span>
          </span>
        </div>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span className="size-2 animate-pulse rounded-full bg-primary" />
          Live · Biothon 2026
        </div>
      </header>

      {/* Hero — full image */}
      <section className="relative mx-auto max-w-6xl overflow-hidden rounded-3xl px-0">
        <div className="relative h-[360px] w-full md:h-[460px]">
          <Image
            src="/hero.jpg"
            alt="Smart irrigation sprinkler watering a green crop field at sunset"
            fill
            priority
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-primary/85 via-primary/40 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-6 text-primary-foreground md:p-10">
            <Badge className="mb-3 bg-accent text-accent-foreground hover:bg-accent">
              <Sprout className="mr-1 size-3.5" /> Smart Irrigation Platform
            </Badge>
            <h1 className="font-heading text-3xl font-bold text-balance md:text-5xl">
              AgriMind AI — Smarter Farms
            </h1>
            <p className="mt-2 text-sm opacity-90 md:text-base">
              Soil · Weather · AI · Together
            </p>
          </div>
        </div>
      </section>

      {/* Tabs */}
      <section className="mx-auto max-w-6xl px-5 py-8 md:px-8">
        <Tabs defaultValue="about" className="w-full">
          <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4">
            <TabsTrigger value="about">About</TabsTrigger>
            <TabsTrigger value="how">How It Works</TabsTrigger>
            <TabsTrigger value="features">Features</TabsTrigger>
            <TabsTrigger value="menu">Menu</TabsTrigger>
          </TabsList>

          {/* ABOUT — punchline only */}
          <TabsContent value="about" className="mt-8">
            <div className="texture-leaf flex flex-col items-center justify-center rounded-3xl border border-border px-6 py-16 text-center">
              <Leaf className="mb-4 size-10 text-primary animate-floaty" />
              <p className="max-w-2xl font-heading text-2xl font-semibold leading-relaxed text-balance text-foreground md:text-4xl">
                Stop guessing. AgriMind AI tells you exactly{" "}
                <span className="text-primary">when to irrigate</span> and{" "}
                <span className="text-primary">how much water</span> to use — no
                wasted drops, no stressed crops.
              </p>
            </div>
          </TabsContent>

          {/* HOW IT WORKS — the information tab */}
          <TabsContent value="how" className="mt-8 space-y-6">
            <div className="grid gap-4 md:grid-cols-3">
              {[
                {
                  step: "1",
                  title: "Enter field details",
                  desc: "Pick your crop, growth stage, soil moisture, and city.",
                },
                {
                  step: "2",
                  title: "AI fetches live weather",
                  desc: "We pull real temperature, humidity and rain probability for your location.",
                },
                {
                  step: "3",
                  title: "Get your decision",
                  desc: "The engine combines everything: irrigate now, delay, or within 24 hours — with exact water quantity.",
                },
              ].map((s) => (
                <Card key={s.step} className="texture-field">
                  <CardContent className="pt-6">
                    <span className="flex size-9 items-center justify-center rounded-full bg-primary font-heading text-sm font-bold text-primary-foreground">
                      {s.step}
                    </span>
                    <h3 className="mt-4 font-heading text-lg font-semibold">
                      {s.title}
                    </h3>
                    <p className="mt-1 text-sm text-muted-foreground leading-relaxed">
                      {s.desc}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
            <Card className="overflow-hidden">
              <div className="relative h-48 w-full md:h-64">
                <Image
                  src="/architecture.png"
                  alt="Diagram of AgriMind AI smart irrigation architecture"
                  fill
                  className="object-cover"
                />
              </div>
              <CardContent className="py-4 text-sm text-muted-foreground">
                Built on Next.js · FastAPI · OpenWeather · SQLite — fetching live
                field and weather data in real time.
              </CardContent>
            </Card>
          </TabsContent>

          {/* FEATURES */}
          <TabsContent value="features" className="mt-8">
            <div className="grid gap-4 sm:grid-cols-2">
              {[
                {
                  icon: Droplets,
                  title: "Smart irrigation",
                  desc: "Tells you when and how much.",
                },
                {
                  icon: CloudRain,
                  title: "Weather aware",
                  desc: "Live forecast prevents waste.",
                },
                {
                  icon: Wheat,
                  title: "Crop specific",
                  desc: "Wheat, rice, cotton & more.",
                },
                {
                  icon: HistoryIcon,
                  title: "History",
                  desc: "Review past predictions.",
                },
              ].map((f) => (
                <Card key={f.title} className="texture-field">
                  <CardContent className="flex flex-col items-center gap-2 py-8 text-center">
                    <f.icon className="size-8 text-primary" />
                    <h3 className="font-heading text-lg font-semibold">
                      {f.title}
                    </h3>
                    <p className="text-sm text-muted-foreground">{f.desc}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* MENU */}
          <TabsContent value="menu" className="mt-8">
            <p className="mb-4 text-xs font-medium uppercase tracking-wider text-muted-foreground">
              What would you like to do?
            </p>
            <div className="grid gap-4 sm:grid-cols-2">
              <ActionCard
                href="/predict"
                icon={Bot}
                title="Get Prediction"
                desc="Enter field details and get an irrigation decision."
                featured
              />
              <ActionCard
                href="/results"
                icon={HistoryIcon}
                title="View Results"
                desc="See your last AI recommendation and analytics."
              />
              <ActionCard
                href="/results"
                icon={HistoryIcon}
                title="History"
                desc="All your past predictions."
              />

              {/* Contact Us card — full info inside */}
              <Card className="texture-field sm:col-span-2">
                <CardContent className="py-6">
                  <div className="mb-4 flex items-center gap-3">
                    <span className="flex size-10 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                      <Mail className="size-5" />
                    </span>
                    <div>
                      <h3 className="font-heading text-lg font-semibold">
                        Contact Us
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        Reach the Semicolon team.
                      </p>
                    </div>
                  </div>
                  <ul className="grid gap-3 sm:grid-cols-3">
                    <ContactItem
                      icon={Mail}
                      label="Email"
                      value="team.semicolon@agrimind.ai"
                    />
                    <ContactItem
                      icon={Trophy}
                      label="Hackathon"
                      value="Biothon 2026 · Team Semicolon"
                    />
                    <ContactItem
                      icon={Code2}
                      label="GitHub"
                      value="github.com/team-semicolon"
                    />
                  </ul>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </section>

      <footer className="border-t border-border px-5 py-6 text-center text-xs text-muted-foreground md:px-8">
        <span className="inline-flex items-center gap-1">
          <MapPin className="size-3.5" /> Save up to 40% water with AI-powered
          irrigation decisions.
        </span>
      </footer>
    </main>
  )
}

function ActionCard({
  href,
  icon: Icon,
  title,
  desc,
  featured,
}: {
  href: string
  icon: React.ComponentType<{ className?: string }>
  title: string
  desc: string
  featured?: boolean
}) {
  return (
    <Link href={href} className="group">
      <Card
        className={`h-full transition-colors group-hover:border-primary ${
          featured ? "bg-primary text-primary-foreground" : "texture-field"
        }`}
      >
        <CardContent className="py-6">
          <Icon
            className={`size-7 ${featured ? "text-primary-foreground" : "text-primary"}`}
          />
          <h3 className="mt-4 font-heading text-lg font-semibold">{title}</h3>
          <p
            className={`mt-1 text-sm ${
              featured ? "opacity-90" : "text-muted-foreground"
            }`}
          >
            {desc}
          </p>
        </CardContent>
      </Card>
    </Link>
  )
}

function ContactItem({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ className?: string }>
  label: string
  value: string
}) {
  return (
    <li className="flex items-start gap-3 rounded-xl border border-border bg-background/60 p-3">
      <Icon className="mt-0.5 size-4 shrink-0 text-primary" />
      <div className="min-w-0">
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="truncate text-sm font-medium">{value}</p>
      </div>
    </li>
  )
}
