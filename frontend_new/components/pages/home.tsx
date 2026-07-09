'use client'

import Image from 'next/image'
import { ArrowRight, Leaf, TrendingUp, Shield, Zap } from 'lucide-react'

interface HomeProps {
  setCurrentTab: (tab: string) => void
}

export default function Home({ setCurrentTab }: HomeProps) {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section with Image */}
      <section className="relative w-full h-[400px] overflow-hidden rounded-2xl mx-4 sm:mx-6 lg:mx-8 mt-4">
        <Image
          src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/hero.jpg-bV06D2qTCv0aiblufAxGId27Ybhz0y.png"
          alt="Smart Irrigation System"
          fill
          className="object-cover"
          priority
        />
        {/* Overlay */}
        <div className="absolute inset-0 bg-black/30"></div>
        
        {/* Content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div className="mb-4">
            <span className="inline-block bg-white/25 backdrop-blur-md px-4 py-1.5 rounded-full text-white text-sm font-medium border border-white/40">
              🌱 Smart Irrigation Platform
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-2 drop-shadow-lg text-center px-4">
            AgriMind AI — Smarter Farms
          </h1>
          <p className="text-lg text-white/95 drop-shadow-lg text-center">
            Soil · Weather · AI · Together
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">

        {/* What would you like to do? Section */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-foreground mb-8">What would you like to do?</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <button
              onClick={() => setCurrentTab('predict')}
              className="bg-primary text-primary-foreground rounded-lg p-8 hover:shadow-lg transition-shadow text-left"
            >
              <div className="inline-block p-3 rounded-lg bg-white/10 mb-4">
                <Leaf className="text-primary-foreground" size={24} />
              </div>
              <h3 className="text-xl font-semibold text-primary-foreground mb-2">Get Prediction</h3>
              <p className="text-primary-foreground/90">Enter field details and get an irrigation decision.</p>
            </button>

            <button
              onClick={() => setCurrentTab('results')}
              className="bg-card text-card-foreground rounded-lg p-8 hover:shadow-lg transition-shadow text-left border border-border"
            >
              <div className="inline-block p-3 rounded-lg bg-primary/10 mb-4">
                <TrendingUp className="text-primary" size={24} />
              </div>
              <h3 className="text-xl font-semibold text-card-foreground mb-2">View Results</h3>
              <p className="text-muted-foreground">See your last AI recommendation and analytics.</p>
            </button>

            <button
              onClick={() => setCurrentTab('history')}
              className="bg-card text-card-foreground rounded-lg p-8 hover:shadow-lg transition-shadow text-left border border-border"
            >
              <div className="inline-block p-3 rounded-lg bg-primary/10 mb-4">
                <Shield className="text-primary" size={24} />
              </div>
              <h3 className="text-xl font-semibold text-card-foreground mb-2">History</h3>
              <p className="text-muted-foreground">All your past predictions.</p>
            </button>

            <button
              onClick={() => setCurrentTab('contact')}
              className="bg-card text-card-foreground rounded-lg p-8 hover:shadow-lg transition-shadow text-left border border-border"
            >
              <div className="inline-block p-3 rounded-lg bg-primary/10 mb-4">
                <Zap className="text-primary" size={24} />
              </div>
              <h3 className="text-xl font-semibold text-card-foreground mb-2">Contact Us</h3>
              <p className="text-muted-foreground">Reach the Semicolon team.</p>
            </button>
          </div>
        </div>

        {/* How It Works Section */}
        <div className="bg-card rounded-lg p-8 border border-border mb-20">
          <h2 className="text-3xl font-bold text-foreground mb-12 text-center">How AgriMind Works</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="inline-block px-4 py-3 rounded-full bg-primary/15 text-primary font-bold text-lg mb-4">1</div>
              <h3 className="text-xl font-semibold text-foreground mb-2">Login & Setup</h3>
              <p className="text-muted-foreground">Create your farmer account and add your farm details including location, crop type, and current conditions.</p>
            </div>
            <div className="text-center">
              <div className="inline-block px-4 py-3 rounded-full bg-primary/15 text-primary font-bold text-lg mb-4">2</div>
              <h3 className="text-xl font-semibold text-foreground mb-2">Input Data</h3>
              <p className="text-muted-foreground">Provide farm parameters like soil type, moisture, rainfall, and seasonal information for accurate predictions.</p>
            </div>
            <div className="text-center">
              <div className="inline-block px-4 py-3 rounded-full bg-primary/15 text-primary font-bold text-lg mb-4">3</div>
              <h3 className="text-xl font-semibold text-foreground mb-2">Get Predictions</h3>
              <p className="text-muted-foreground">Receive detailed yield predictions, confidence scores, and recommendations to optimize your harvest.</p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-primary rounded-lg p-12 text-center">
          <h2 className="text-3xl font-bold text-primary-foreground mb-4">Ready to Transform Your Farm?</h2>
          <p className="text-lg text-primary-foreground/95 mb-8">Join thousands of farmers using AgriMind to boost their productivity and yield.</p>
          <button
            onClick={() => setCurrentTab('login')}
            className="inline-flex items-center gap-2 px-8 py-4 rounded-lg bg-primary-foreground text-primary font-semibold hover:opacity-90 transition-opacity"
          >
            Get Started Now <ArrowRight size={20} />
          </button>
        </div>
      </section>
    </div>
  )
}
