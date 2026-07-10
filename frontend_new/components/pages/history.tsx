'use client'

import { Droplets } from 'lucide-react'

export default function History() {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-4xl font-bold text-foreground mb-2">Irrigation History</h1>
        <p className="text-muted-foreground mb-12">View your previous irrigation recommendations and decisions</p>

        {/* Empty State */}
        <div className="bg-card rounded-lg p-12 border border-border text-center">
          <div className="inline-block p-4 rounded-full bg-secondary mb-6">
            <Droplets className="text-primary" size={40} />
          </div>
          <h2 className="text-2xl font-bold text-foreground mb-3">Irrigation History Coming Soon</h2>
          <p className="text-muted-foreground max-w-md mx-auto mb-6">
            Your irrigation recommendations and field decisions will appear here once you connect your farm records and start using the smart irrigation system.
          </p>
          <div className="bg-primary/5 rounded-lg p-4 border border-primary/20 inline-block">
            <p className="text-sm text-muted-foreground">
              <span className="font-semibold text-foreground">Current Status:</span> Backend integration in progress
            </p>
          </div>
        </div>

        {/* Features Info */}
        <div className="grid md:grid-cols-3 gap-6 mt-12">
          <div className="bg-card rounded-lg p-6 border border-border">
            <div className="p-3 rounded-lg bg-primary/10 mb-4 w-fit">
              <Droplets className="text-primary" size={24} />
            </div>
            <h3 className="font-bold text-foreground mb-2">Recommendation History</h3>
            <p className="text-sm text-muted-foreground">Track all irrigation decisions made for your fields</p>
          </div>

          <div className="bg-card rounded-lg p-6 border border-border">
            <div className="p-3 rounded-lg bg-primary/10 mb-4 w-fit">
              <Droplets className="text-primary" size={24} />
            </div>
            <h3 className="font-bold text-foreground mb-2">Water Usage Tracking</h3>
            <p className="text-sm text-muted-foreground">Monitor total water consumed and savings achieved</p>
          </div>

          <div className="bg-card rounded-lg p-6 border border-border">
            <div className="p-3 rounded-lg bg-primary/10 mb-4 w-fit">
              <Droplets className="text-primary" size={24} />
            </div>
            <h3 className="font-bold text-foreground mb-2">Performance Analytics</h3>
            <p className="text-sm text-muted-foreground">Analyze irrigation effectiveness and crop health trends</p>
          </div>
        </div>
      </div>
    </div>
  )
}
