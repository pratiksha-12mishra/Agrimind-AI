'use client'

import { LogOut, Menu, X } from 'lucide-react'
import { useState } from 'react'
import { useLanguage } from '@/lib/language-context'

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
  const { t } = useLanguage()

  const tabs = [
    { id: 'home', label: t('nav_home') },
    { id: 'login', label: t('nav_login') },
    { id: 'predict', label: t('nav_predict') },
    { id: 'results', label: t('nav_results') },
    { id: 'dashboard', label: t('nav_dashboard') },
    { id: 'weather', label: t('nav_weather') },
    { id: 'voice', label: t('nav_voice') },
    { id: 'history', label: t('nav_history') },
    { id: 'notifications', label: t('nav_notifications') },
    { id: 'settings', label: t('nav_settings') },
    { id: 'contact', label: t('nav_contact') },
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
          <div className="flex items-center gap-2">
            <div className="text-2xl font-bold text-primary">🌾</div>
            <span className="text-xl font-bold text-primary">AgriMind</span>
          </div>

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

          <div className="flex items-center gap-4">
            {isLoggedIn && (
              <button
                onClick={handleLogout}
                className="hidden md:flex items-center gap-2 px-4 py-2 rounded-md bg-red-100 text-red-700 hover:bg-red-200 text-sm font-medium transition-colors"
              >
                <LogOut size={16} />
                {t('nav_logout')}
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
                {t('nav_logout')}
              </button>
            )}
          </div>
        )}
      </div>
    </nav>
  )
}