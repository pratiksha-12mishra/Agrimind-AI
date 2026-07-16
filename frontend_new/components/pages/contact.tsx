'use client'

import { useState } from 'react'
import { Mail, Phone, Clock, Check } from 'lucide-react'

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    mobile: '',
    subject: '',
    message: '',
  })
  const [showSuccess, setShowSuccess] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setShowSuccess(true)
    setTimeout(() => {
      setFormData({ name: '', mobile: '', subject: '', message: '' })
      setShowSuccess(false)
    }, 3000)
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-foreground mb-4">Contact AgriMind AI</h1>
          <p className="text-lg text-muted-foreground">Get support for smart irrigation setup, feedback, and agricultural insights</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 mb-16">
          {/* Contact Info Cards */}
          <div className="bg-card rounded-lg p-8 border border-border hover:shadow-lg transition-shadow">
            <div className="inline-block p-4 rounded-lg bg-primary/10 mb-6">
              <Mail className="text-primary" size={28} />
            </div>
            <h3 className="text-xl font-bold text-foreground mb-2">Email Support</h3>
            <p className="text-muted-foreground mb-4">Reach out to our support team via email</p>
            <a href="mailto:support@agrimind.com" className="text-primary font-semibold hover:underline">
              support@agrimind.com
            </a>
            <p className="text-sm text-muted-foreground mt-4">Response time: 2-4 hours</p>
          </div>

          <div className="bg-card rounded-lg p-8 border border-border hover:shadow-lg transition-shadow">
            <div className="inline-block p-4 rounded-lg bg-accent/10 mb-6">
              <Phone className="text-accent" size={28} />
            </div>
            <h3 className="text-xl font-bold text-foreground mb-2">Phone Support</h3>
            <p className="text-muted-foreground mb-4">Call our support team directly</p>
            <a href="tel:+919876543210" className="text-accent font-semibold hover:underline">
              +91-9876-543210
            </a>
            <p className="text-sm text-muted-foreground mt-4">Available Monday - Friday</p>
          </div>

          <div className="bg-card rounded-lg p-8 border border-border hover:shadow-lg transition-shadow">
            <div className="inline-block p-4 rounded-lg bg-primary/10 mb-6">
              <Clock className="text-primary" size={28} />
            </div>
            <h3 className="text-xl font-bold text-foreground mb-2">Working Hours</h3>
            <p className="text-muted-foreground mb-4">Our team is available during these hours</p>
            <div className="text-sm">
              <p className="font-semibold text-foreground">Mon - Fri: 9:00 AM - 6:00 PM</p>
              <p className="text-muted-foreground">Sat - Sun: 10:00 AM - 4:00 PM</p>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Form */}
          <div className="bg-card rounded-lg p-8 border border-border">
            <h2 className="text-2xl font-bold text-foreground mb-6">Send us a Message</h2>

            {showSuccess && (
              <div className="mb-6 p-4 rounded-lg bg-primary/10 border border-primary flex items-center gap-3">
                <Check className="text-primary" size={20} />
                <span className="text-primary font-medium">Message sent successfully! We&apos;ll get back to you soon.</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Full Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder="Your name"
                  className="w-full px-4 py-3 rounded-lg border border-border bg-input text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Mobile Number or Email</label>
                <input
                  type="text"
                  name="mobile"
                  value={formData.mobile}
                  onChange={handleChange}
                  required
                  placeholder="Your contact information"
                  className="w-full px-4 py-3 rounded-lg border border-border bg-input text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Subject</label>
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  placeholder="What is this about?"
                  className="w-full px-4 py-3 rounded-lg border border-border bg-input text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Message</label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  placeholder="Your message..."
                  rows={6}
                  className="w-full px-4 py-3 rounded-lg border border-border bg-input text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-lg bg-primary text-primary-foreground font-semibold hover:opacity-90 transition-opacity"
              >
                Send Message
              </button>
            </form>
          </div>

          {/* FAQ Section */}
          <div>
            <h2 className="text-2xl font-bold text-foreground mb-6">Frequently Asked Questions</h2>

            <div className="space-y-4">
              <div className="bg-card rounded-lg p-6 border border-border">
                <h3 className="font-bold text-foreground mb-2">How accurate are the predictions?</h3>
                <p className="text-muted-foreground text-sm">Our AI models are trained on historical agricultural data and typically achieve 85-95% accuracy. Accuracy improves with more data inputs.</p>
              </div>

              <div className="bg-card rounded-lg p-6 border border-border">
                <h3 className="font-bold text-foreground mb-2">Can I use AgriMind for multiple farms?</h3>
                <p className="text-muted-foreground text-sm">Yes! You can manage multiple farms and get separate predictions for each farm with different conditions and crops.</p>
              </div>

              <div className="bg-card rounded-lg p-6 border border-border">
                <h3 className="font-bold text-foreground mb-2">How often should I update my data?</h3>
                <p className="text-muted-foreground text-sm">For best results, update your sensor data weekly or after significant weather changes. Real-time sensors update automatically.</p>
              </div>

              <div className="bg-card rounded-lg p-6 border border-border">
                <h3 className="font-bold text-foreground mb-2">Is my data secure?</h3>
                <p className="text-muted-foreground text-sm">Yes, we use industry-standard encryption and follow data protection regulations to keep your farm data completely secure.</p>
              </div>

              <div className="bg-card rounded-lg p-6 border border-border">
                <h3 className="font-bold text-foreground mb-2">What crops are supported?</h3>
                <p className="text-muted-foreground text-sm">We currently support Rice, Wheat, Corn, Soybean, and other major crops. More crops are being added regularly.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
