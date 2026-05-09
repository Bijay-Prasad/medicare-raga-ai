import { create } from 'zustand'
import { v4 as uuidv4 } from 'uuid'

export interface Notification {
  id: string
  title: string
  message: string
  type: 'info' | 'success' | 'warning' | 'error'
  timestamp: number
  read: boolean
}

interface NotificationState {
  notifications: Notification[]
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => void
  markAsRead: (id: string) => void
  markAllRead: () => void
  removeNotification: (id: string) => void
  clearAll: () => void
  getUnreadCount: () => number
}

/** Fire a real native browser notification via the Service Worker */
function triggerNativeBrowserNotification(title: string, body: string, type: string) {
  if (!('serviceWorker' in navigator) || !('Notification' in window)) return
  if (Notification.permission !== 'granted') return

  const tag = `medicare-${type}-${Date.now()}`
  navigator.serviceWorker.ready.then((registration) => {
    registration.active?.postMessage({
      type: 'SHOW_NOTIFICATION',
      title,
      body,
      tag,
    })
  })
}

export const useNotificationStore = create<NotificationState>((set, get) => ({
  notifications: [],

  addNotification: (notification) => {
    const newEntry: Notification = {
      ...notification,
      id: uuidv4(),
      timestamp: Date.now(),
      read: false,
    }

    // 1. Add to in-app notification feed (Zustand state)
    set((state) => ({
      notifications: [newEntry, ...state.notifications],
    }))

    // 2. Also fire a real native OS-level browser notification
    triggerNativeBrowserNotification(
      notification.title,
      notification.message,
      notification.type
    )
  },

  markAsRead: (id) =>
    set((state) => ({
      notifications: state.notifications.map((n) =>
        n.id === id ? { ...n, read: true } : n
      ),
    })),

  markAllRead: () =>
    set((state) => ({
      notifications: state.notifications.map((n) => ({ ...n, read: true })),
    })),

  removeNotification: (id) =>
    set((state) => ({
      notifications: state.notifications.filter((n) => n.id !== id),
    })),

  clearAll: () => set({ notifications: [] }),

  getUnreadCount: () => {
    const state = get()
    return state.notifications.filter((n) => !n.read).length
  },
}))
