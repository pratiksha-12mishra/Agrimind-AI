'use client'

import { LogOut, Menu, X } from 'lucide-react'
import { useState } from 'react'

interface NavbarProps {
  currentTab: string
  setCurrentTab: (tab: string) => void
  isLoggedIn: boolean
  setIsLoggedIn: (logged: boolean) => void
}

export default function Navbar({
  currentTab,
  setCurrentTab,
  isLoggedIn,
  setIsLoggedIn,
}: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const tabs = [
    { id: 'home', label: '🏠 Home' },
    { id: 'login', label: '🔐 Login' },
    { id: 'predict', label: '🤖 Predict' },
    { id: 'results', label: '📊 Results' },
    { id: 'dashboard', label: '📡 Dashboard' },
    { id: 'weather', label: '🌤️ Weather' },
    { id: 'voice', label: '🎤 Voice' },
    { id: 'history', label: '🕐 History' },
    { id: 'notifications', label: '🔔 Notifications' },
    { id: 'settings', label: '⚙️ Settings' },
    { id: 'contact', label: '📞 Contact Us' },
  ]

  const handleTabClick = (tabId: string) => {
    setCurrentTab(tabId)
    setMobileMenuOpen(false)
  }

  const handleLogout = () => {
    setIsLoggedIn(false)
    setCurrentTab('home')
    setMobileMenuOpen(false)
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-card border-b border-border shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="text-2xl font-bold text-primary">🌾</div>
            <span className="text-xl font-bold text-primary">AgriMind</span>
          </div>

          {/* Desktop Menu */}
          <div className="hidden lg:flex items-center gap-1 overflow-x-auto max-w-2xl">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => handleTabClick(tab.id)}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors whitespace-nowrap ${
                  currentTab === tab.id
                    ? 'bg-primary text-primary-foreground'
                    : 'text-foreground hover:bg-secondary'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Logout and Mobile Menu */}
          <div className="flex items-center gap-4">
            {isLoggedIn && (
              <button
                onClick={handleLogout}
                className="hidden md:flex items-center gap-2 px-4 py-2 rounded-md bg-red-100 text-red-700 hover:bg-red-200 text-sm font-medium transition-colors"
              >
                <LogOut size={16} />
                Logout
              </button>
            )}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-md text-foreground hover:bg-secondary transition-colors"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden pb-4 space-y-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => handleTabClick(tab.id)}
                className={`w-full text-left px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  currentTab === tab.id
                    ? 'bg-primary text-primary-foreground'
                    : 'text-foreground hover:bg-secondary'
                }`}
              >
                {tab.label}
              </button>
            ))}
            {isLoggedIn && (
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-2 px-4 py-2 rounded-md bg-red-100 text-red-700 hover:bg-red-200 text-sm font-medium transition-colors"
              >
                <LogOut size={16} />
                Logout
              </button>
            )}
          </div>
        )}
      </div>
    </nav>
  )
}
