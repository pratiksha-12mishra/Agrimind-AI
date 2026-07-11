'use client'

import { useState, useEffect } from 'react'
import Navbar from '@/components/navbar'
import Home from '@/components/pages/home'
import Login from '@/components/pages/login'
import Predict from '@/components/pages/predict'
import Results from '@/components/pages/results'
import Dashboard from '@/components/pages/dashboard'
import Weather from '@/components/pages/weather'
import Voice from '@/components/pages/voice'
import History from '@/components/pages/history'
import Notifications from '@/components/pages/notifications'
import Settings from '@/components/pages/settings'
import Contact from '@/components/pages/contact'

export default function Page() {
  const [currentTab, setCurrentTab] = useState('home')
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [isDarkMode, setIsDarkMode] = useState(false)

  // Load saved theme preference once, on first mount
  useEffect(() => {
    const saved = localStorage.getItem('agrimind-theme')
    if (saved === 'dark') setIsDarkMode(true)
  }, [])

  // Save theme preference whenever it changes
  useEffect(() => {
    localStorage.setItem('agrimind-theme', isDarkMode ? 'dark' : 'light')
  }, [isDarkMode])

  const renderPage = () => {
    switch (currentTab) {
      case 'home':
        return <Home setCurrentTab={setCurrentTab} />
      case 'login':
        return <Login setIsLoggedIn={setIsLoggedIn} setCurrentTab={setCurrentTab} />
      case 'predict':
        return isLoggedIn ? (
          <Predict setCurrentTab={setCurrentTab} />
        ) : (
          <Login setIsLoggedIn={setIsLoggedIn} setCurrentTab={setCurrentTab} />
        )
      case 'results':
        return isLoggedIn ? <Results /> : <Login setIsLoggedIn={setIsLoggedIn} setCurrentTab={setCurrentTab} />
      case 'dashboard':
        return <Dashboard isLoggedIn={isLoggedIn} />
      case 'weather':
        return <Weather isLoggedIn={isLoggedIn} />
      case 'voice':
        return <Voice isLoggedIn={isLoggedIn} />
      case 'history':
        return isLoggedIn ? <History /> : <Login setIsLoggedIn={setIsLoggedIn} setCurrentTab={setCurrentTab} />
      case 'notifications':
        return <Notifications isLoggedIn={isLoggedIn} />
      case 'settings':
        return <Settings isLoggedIn={isLoggedIn} isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} />
      case 'contact':
        return <Contact />
      default:
        return <Home setCurrentTab={setCurrentTab} />
    }
  }

  return (
    <div className={isDarkMode ? 'dark' : ''}>
      <div className="min-h-screen bg-background text-foreground">
        <Navbar currentTab={currentTab} setCurrentTab={setCurrentTab} isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
        <main className="pt-20">
          {renderPage()}
        </main>
      </div>
    </div>
  )
}