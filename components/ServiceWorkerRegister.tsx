import { useEffect } from 'react'
import { useNotificationStore } from '@/lib/stores/notificationStore'

/**
 * Sends a postMessage to the active Service Worker which calls
 * self.registration.showNotification() — works without a push server.
 * Call this whenever you want a native browser notification toast.
 */
export function showLocalNotification(title: string, body: string, tag = 'medicare-local') {
  if (!('serviceWorker' in navigator)) return
  if (Notification.permission !== 'granted') return

  navigator.serviceWorker.ready.then((registration) => {
    registration.active?.postMessage({
      type: 'SHOW_NOTIFICATION',
      title,
      body,
      tag,
    })
  })
}

export function ServiceWorkerRegister() {
  const { addNotification } = useNotificationStore()

  useEffect(() => {
    if (typeof window === 'undefined' || !('serviceWorker' in navigator)) return

    const registerSW = async () => {
      try {
        const registration = await navigator.serviceWorker.register('/sw.js', {
          scope: '/',
        })
        console.log('[MediCare] Service Worker registered:', registration.scope)

        // Request notification permission on first load
        if ('Notification' in window && Notification.permission === 'default') {
          const permission = await Notification.requestPermission()
          if (permission === 'granted') {
            // Add to in-app notification feed
            addNotification({
              title: 'Notifications Enabled',
              message: 'You will now receive real-time healthcare alerts.',
              type: 'success',
            })
            // Fire a real native notification as a welcome message
            showLocalNotification(
              'MediCare SaaS',
              'Notifications are now enabled. You\'ll receive healthcare alerts here.'
            )
          }
        }

        // Auto-update: activate new SW without waiting for page reload
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing
          newWorker?.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              console.log('[MediCare] New Service Worker available')
            }
          })
        })
      } catch (error) {
        console.error('[MediCare] Service Worker registration failed:', error)
      }
    }

    // Register after page load to not block initial render
    if (document.readyState === 'complete') {
      registerSW()
    } else {
      window.addEventListener('load', registerSW, { once: true })
    }
  }, [addNotification])

  return null
}
