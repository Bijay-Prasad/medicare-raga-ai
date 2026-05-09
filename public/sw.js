// Service Worker for MediCare SaaS
const CACHE_NAME = 'medicare-v2'
const urlsToCache = ['/']

// ─── Install ──────────────────────────────────────────────────────────────────
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(urlsToCache).catch(() => {
        // Ignore failures for optional files
      })
    })
  )
  self.skipWaiting()
})

// ─── Activate ─────────────────────────────────────────────────────────────────
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) =>
      Promise.all(
        cacheNames.map((name) => {
          if (name !== CACHE_NAME) return caches.delete(name)
        })
      )
    )
  )
  self.clients.claim()
})

// ─── Message from client → show local notification ───────────────────────────
// Triggered by showLocalNotification() in ServiceWorkerRegister.tsx
self.addEventListener('message', (event) => {
  if (!event.data || event.data.type !== 'SHOW_NOTIFICATION') return

  const { title, body, tag } = event.data

  // Only show if permission is already granted (checked on client side)
  event.waitUntil(
    self.registration.showNotification(title || 'MediCare SaaS', {
      body: body || 'New notification',
      icon: '/icon-dark-32x32.png',
      badge: '/icon-light-32x32.png',
      tag: tag || 'medicare-local',
      requireInteraction: false,
    })
  )
})

// ─── Push Notification (server-sent) ─────────────────────────────────────────
self.addEventListener('push', (event) => {
  const data = event.data?.json().catch(() => null) || {}
  const title = data.title || 'MediCare SaaS'
  const body = data.body || 'New notification from MediCare'

  event.waitUntil(
    self.registration.showNotification(title, {
      body,
      icon: '/icon-dark-32x32.png',
      badge: '/icon-light-32x32.png',
      tag: 'medicare-push',
      requireInteraction: false,
    })
  )
})

// ─── Notification Click ───────────────────────────────────────────────────────
self.addEventListener('notificationclick', (event) => {
  event.notification.close()
  event.waitUntil(
    clients
      .matchAll({ type: 'window', includeUncontrolled: true })
      .then((clientList) => {
        if (clientList.length > 0) return clientList[0].focus()
        return clients.openWindow('/')
      })
  )
})

// ─── Fetch (network-first for API, cache-first for assets) ───────────────────
self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return

  event.respondWith(
    caches.match(event.request).then((cached) => {
      return cached || fetch(event.request).catch(() => undefined)
    })
  )
})
