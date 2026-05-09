// Service Worker for MediCare SaaS
const CACHE_NAME = 'medicare-v3'
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
      icon: '/favicon.svg',
      badge: '/favicon.svg',
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
      icon: '/favicon.svg',
      badge: '/favicon.svg',
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

// ─── Fetch (Network First for HTML, Cache First for Assets) ───────────────────
self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return

  // For HTML navigation requests (like loading the app), always go to network first!
  // This ensures the user always gets the latest index.html with the newest JS hashes.
  if (event.request.mode === 'navigate' || event.request.headers.get('accept')?.includes('text/html')) {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          // Clone and update cache with the fresh HTML
          const responseClone = response.clone()
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, responseClone))
          return response
        })
        .catch(() => caches.match(event.request)) // Fallback to cache ONLY if offline
    )
    return
  }

  // For static assets (JS, CSS, images), try cache first, then network
  event.respondWith(
    caches.match(event.request).then((cached) => {
      if (cached) return cached

      return fetch(event.request).then((response) => {
        // Don't cache if not a valid response
        if (!response || response.status !== 200 || response.type !== 'basic') {
          return response
        }
        
        const responseClone = response.clone()
        caches.open(CACHE_NAME).then((cache) => cache.put(event.request, responseClone))
        return response
      }).catch(() => undefined)
    })
  )
})
