'use client'

import { useState } from 'react'
import { Check } from 'lucide-react'

interface LoginProps {
  setIsLoggedIn: (logged: boolean) => void
  setCurrentTab: (tab: string) => void
}

export default function Login({ setIsLoggedIn, setCurrentTab }: LoginProps) {
  const [isLogin, setIsLogin] = useState(true)
  const [showSuccess, setShowSuccess] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobile: '',
    password: '',
    confirmPassword: '',
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setShowSuccess(true)
    setTimeout(() => {
      setIsLoggedIn(true)
      setCurrentTab('predict')
      setShowSuccess(false)
    }, 1500)
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-md mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-card rounded-lg shadow-lg border border-border p-8">
          {/* Success Message */}
          {showSuccess && (
            <div className="mb-6 p-4 rounded-lg bg-accent/10 border border-accent flex items-center gap-3">
              <Check className="text-accent" size={20} />
              <span className="text-accent font-medium">
                {isLogin ? 'Login' : 'Registration'} successful! Redirecting...
              </span>
            </div>
          )}

          {/* Title */}
          <h1 className="text-3xl font-bold text-foreground mb-2 text-center">
            {isLogin ? 'Welcome Back' : 'Join AgriMind'}
          </h1>
          <p className="text-muted-foreground text-center mb-8">
            {isLogin ? 'Login to your farmer account' : 'Create a new farmer account'}
          </p>

          {/* Tabs */}
          <div className="flex gap-2 mb-8 rounded-lg bg-secondary p-1">
            <button
              onClick={() => {
                setIsLogin(true)
                setFormData({ name: '', email: '', mobile: '', password: '', confirmPassword: '' })
              }}
              className={`flex-1 py-2 px-4 rounded-md font-medium transition-colors ${
                isLogin
                  ? 'bg-card text-primary shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Login
            </button>
            <button
              onClick={() => {
                setIsLogin(false)
                setFormData({ name: '', email: '', mobile: '', password: '', confirmPassword: '' })
              }}
              className={`flex-1 py-2 px-4 rounded-md font-medium transition-colors ${
                !isLogin
                  ? 'bg-card text-primary shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Register
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Farmer Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required={!isLogin}
                  placeholder="Enter your full name"
                  className="w-full px-4 py-2 rounded-lg border border-border bg-input text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Email or Mobile Number
              </label>
              <input
                type={isLogin ? 'text' : 'email'}
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder={isLogin ? 'Email or Mobile' : 'your@email.com'}
                className="w-full px-4 py-2 rounded-lg border border-border bg-input text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            {!isLogin && (
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Mobile Number
                </label>
                <input
                  type="tel"
                  name="mobile"
                  value={formData.mobile}
                  onChange={handleChange}
                  required={!isLogin}
                  placeholder="+1 (555) 000-0000"
                  className="w-full px-4 py-2 rounded-lg border border-border bg-input text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Password
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                placeholder="••••••••"
                className="w-full px-4 py-2 rounded-lg border border-border bg-input text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            {!isLogin && (
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Confirm Password
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required={!isLogin}
                  placeholder="••••••••"
                  className="w-full px-4 py-2 rounded-lg border border-border bg-input text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            )}

            <button
              type="submit"
              className="w-full py-3 rounded-lg bg-primary text-primary-foreground font-semibold hover:opacity-90 transition-opacity mt-6"
            >
              {isLogin ? 'Login' : 'Register'}
            </button>
          </form>

          {/* Info Message */}
          <p className="text-xs text-muted-foreground text-center mt-6">
            {isLogin ? 'No real authentication. Click login to continue.' : 'No real authentication. Click register to continue.'}
          </p>
        </div>
      </div>
    </div>
  )
}
