'use client'

import { useEffect } from 'react'

export default function RegisterSW() {
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker
        .register('/sw.js')
        .then((registration) => {
          console.log('[v0] Service worker registered:', registration.scope)
        })
        .catch((error) => {
          console.error('[v0] Service worker registration failed:', error)
        })
    } else {
      console.log('[v0] Service workers not supported in this browser')
    }
  }, [])

  return null
}