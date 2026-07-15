self.addEventListener('push', function (event) {
  const data = event.data ? event.data.json() : {}

  const options = {
    body: data.body || 'New update from AgriMind AI',
    icon: '/icon-192.png',
    badge: '/icon-192.png',
    tag: 'agrimind-alert',
    data: { decision: data.decision || null },
  }

  event.waitUntil(self.registration.showNotification(data.title || 'AgriMind AI', options))
})

self.addEventListener('notificationclick', function (event) {
  event.notification.close()
  event.waitUntil(clients.openWindow('/'))
})