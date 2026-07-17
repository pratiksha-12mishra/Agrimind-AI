'use client'

import { useState } from 'react'
import { Check, AlertCircle, Loader2 } from 'lucide-react'

interface LoginProps {
  setIsLoggedIn: (logged: boolean) => void
  setCurrentTab: (tab: string) => void
}

export default function Login({ setIsLoggedIn, setCurrentTab }: LoginProps) {
  const [isLogin, setIsLogin] = useState(true)
  const [showSuccess, setShowSuccess] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!isLogin && formData.password !== formData.confirmPassword) {
      setError('Passwords do not match')
      return
    }

    setLoading(true)

    try {
      const endpoint = isLogin ? '/api/auth/login' : '/api/auth/signup'
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: formData.email, password: formData.password }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || (isLogin ? 'Login failed' : 'Signup failed'))
        setLoading(false)
        return
      }

      // Store JWT for future authenticated requests
      localStorage.setItem('agrimind-token', data.access_token)
      localStorage.setItem('agrimind-email', formData.email)

      setShowSuccess(true)
      setTimeout(() => {
        setIsLoggedIn(true)
        setCurrentTab('predict')
        setShowSuccess(false)
      }, 1000)
    } catch (err: any) {
      setError(err?.message || 'Network error — please try again')
      setLoading(false)
    }
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
                setError(null)
                setFormData({ email: '', password: '', confirmPassword: '' })
              }}
              className={`flex-1 py-2 px-4 rounded-md font-medium transition-colors ${
                isLogin ? 'bg-card text-primary shadow-sm' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Login
            </button>
            <button
              onClick={() => {
                setIsLogin(false)
                setError(null)
                setFormData({ email: '', password: '', confirmPassword: '' })
              }}
              className={`flex-1 py-2 px-4 rounded-md font-medium transition-colors ${
                !isLogin ? 'bg-card text-primary shadow-sm' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Register
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                autoComplete="email"
                placeholder="your@email.com"
                className="w-full px-4 py-2 rounded-lg border border-border bg-input text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                minLength={6}
                autoComplete={isLogin ? 'current-password' : 'new-password'}
                placeholder="••••••••"
                className="w-full px-4 py-2 rounded-lg border border-border bg-input text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            {!isLogin && (
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Confirm Password</label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required={!isLogin}
                  autoComplete="new-password"
                  placeholder="••••••••"
                  className="w-full px-4 py-2 rounded-lg border border-border bg-input text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            )}

            {error && (
              <div className="p-3 rounded-lg bg-destructive/10 border border-destructive flex gap-3">
                <AlertCircle className="text-destructive flex-shrink-0" size={18} />
                <p className="text-sm text-destructive">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-lg bg-primary text-primary-foreground font-semibold hover:opacity-90 transition-opacity mt-6 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  {isLogin ? 'Logging in...' : 'Creating account...'}
                </>
              ) : isLogin ? (
                'Login'
              ) : (
                'Register'
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}