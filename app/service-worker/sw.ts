declare let self: ServiceWorkerGlobalScope

/// <reference lib="webworker" />

self.addEventListener('push', (event) => {
  console.log('[SW] Push received:', event.data?.text())
  const data = event.data ? event.data.json() : {}
  event.waitUntil(
    self.registration.showNotification(data.title || 'Notification', {
      body: data.body || '',
      icon: '/pwa-192x192.png',
      badge: '/pwa-192x192.png',
    }),
  )
})

self.addEventListener('notificationclick', (event) => {
  event.notification.close()
  event.waitUntil(
    clients.openWindow('/'),
  )
})
