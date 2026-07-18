function urlBase64ToUint8Array(base64String: string) {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4)
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/')
  const rawData = atob(base64)
  return Uint8Array.from([...rawData].map((char) => char.charCodeAt(0)))
}

export async function subscribeToPush(farmId: number) {
  if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
    console.log('[v0] Push notifications not supported in this browser')
    return
  }

  try {
    const registration = await navigator.serviceWorker.ready
    const permission = await Notification.requestPermission()

    if (permission !== 'granted') {
      console.log('[v0] Notification permission not granted')
      return
    }

    const vapidPublicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY
    if (!vapidPublicKey) {
      console.error('[v0] NEXT_PUBLIC_VAPID_PUBLIC_KEY is not set')
      return
    }

    const existing = await registration.pushManager.getSubscription()
    const subscription =
      existing ??
      (await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(vapidPublicKey),
      }))

    console.log('[v0] Push subscription created for farm', farmId, '— sending to backend...')

    // Subscription is scoped to a farm now, not just the account
    const subJson = subscription.toJSON()
    const payload = { ...subJson, farm_id: farmId }

    const res = await fetch('/api/push/subscribe', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })

    if (!res.ok) {
      console.error('[v0] Failed to register push subscription with backend')
    } else {
      console.log('[v0] Push subscription registered successfully for farm', farmId)
    }
  } catch (err) {
    console.error('[v0] Push subscription error:', err)
  }
}