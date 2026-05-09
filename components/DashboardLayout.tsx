'use client'

import { ReactNode, useState, useRef, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { signOut } from 'firebase/auth'
import { auth } from '@/lib/firebase'
import { useAuthStore } from '@/lib/stores/authStore'
import { useNotificationStore } from '@/lib/stores/notificationStore'
import { ThemeToggle } from '@/components/ui/theme-toggle'
import { Button } from '@/components/ui/button'
import {
  Heart,
  LayoutDashboard,
  Users,
  BarChart3,
  LogOut,
  Menu,
  X,
  Bell,
  CheckCheck,
  Info,
  CheckCircle2,
  AlertTriangle,
  XCircle,
} from 'lucide-react'
import { toast } from 'sonner'

// ── Notification type helpers ──────────────────────────────────────────────────
function getNotificationIcon(type: string) {
  switch (type) {
    case 'success':
      return <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />
    case 'warning':
      return <AlertTriangle className="w-4 h-4 text-yellow-500 shrink-0 mt-0.5" />
    case 'error':
      return <XCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
    default:
      return <Info className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
  }
}

function formatTime(timestamp: number): string {
  const diff = Date.now() - timestamp
  const mins = Math.floor(diff / 60000)
  const hrs = Math.floor(diff / 3600000)
  if (mins < 1) return 'just now'
  if (mins < 60) return `${mins}m ago`
  if (hrs < 24) return `${hrs}h ago`
  return new Date(timestamp).toLocaleDateString()
}

// ── Main Component ─────────────────────────────────────────────────────────────
export function DashboardLayout({ children }: { children: ReactNode }) {
  const navigate = useNavigate()
  const location = useLocation()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [notifOpen, setNotifOpen] = useState(false)
  const notifRef = useRef<HTMLDivElement>(null)

  const { user, logout } = useAuthStore()
  const { notifications, getUnreadCount, markAllRead, removeNotification } =
    useNotificationStore()

  const unreadCount = getUnreadCount()

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setNotifOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleLogout = async () => {
    try {
      await signOut(auth)
      logout()
      toast.success('Logged out successfully')
      navigate('/login')
    } catch {
      toast.error('Failed to logout. Please try again.')
    }
  }

  const navItems = [
    { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/patients', label: 'Patients', icon: Users },
    { href: '/analytics', label: 'Analytics', icon: BarChart3 },
  ]

  const isActive = (href: string) => location.pathname === href

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-card border-r border-border transform transition-transform duration-300 ease-in-out md:relative md:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-6 border-b border-border flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-linear-to-br from-blue-600 to-indigo-600 flex items-center justify-center">
              <Heart className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-xl font-bold">MediCare</h1>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto p-4 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon
              const active = isActive(item.href)
              return (
                <Link
                  key={item.href}
                  to={item.href}
                  className={`
                    group flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium
                    transition-all duration-200 relative
                    ${
                      active
                        ? 'bg-primary text-primary-foreground shadow-sm'
                        : 'text-muted-foreground hover:text-foreground hover:bg-blue-50 dark:hover:bg-blue-950/40'
                    }
                  `}
                >
                  {/* Active left accent bar */}
                  {active && (
                    <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-white/60 rounded-r-full" />
                  )}

                  {/* Icon */}
                  <Icon
                    className={`w-5 h-5 shrink-0 transition-colors duration-200 ${
                      active
                        ? 'text-primary-foreground'
                        : 'text-muted-foreground group-hover:text-blue-600 dark:group-hover:text-blue-400'
                    }`}
                  />

                  {/* Label */}
                  <span className={active ? '' : 'group-hover:translate-x-0.5 transition-transform duration-200'}>
                    {item.label}
                  </span>
                </Link>
              )
            })}
          </nav>

          {/* User Section */}
          <div className="border-t border-border p-4 space-y-3">
            <div className="px-2">
              <p className="text-xs text-muted-foreground">Logged in as</p>
              <p className="text-sm font-semibold truncate">{user?.email}</p>
            </div>
            <Button
              variant="outline"
              className="w-full justify-start gap-2"
              onClick={handleLogout}
            >
              <LogOut className="w-4 h-4" />
              Logout
            </Button>
          </div>
        </div>
      </aside>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="border-b border-border bg-card sticky top-0 z-30">
          <div className="flex items-center justify-between h-16 px-4 md:px-6">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="md:hidden"
              >
                {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </Button>
              <h2 className="text-lg font-semibold hidden sm:block">
                {navItems.find((item) => isActive(item.href))?.label || 'Dashboard'}
              </h2>
            </div>

            <div className="flex items-center gap-4">

              {/* ── Notification Bell + Dropdown ──────────────────────────── */}
              <div className="relative" ref={notifRef}>
                {/* Bell button */}
                <button
                  onClick={() => setNotifOpen((prev) => !prev)}
                  className={`
                    group relative flex items-center justify-center w-9 h-9 rounded-lg
                    transition-all duration-200
                    hover:bg-blue-50 dark:hover:bg-blue-950/50
                    hover:ring-2 hover:ring-blue-200 dark:hover:ring-blue-800
                    hover:scale-105
                    ${notifOpen ? 'bg-blue-50 dark:bg-blue-950/50 ring-2 ring-blue-200 dark:ring-blue-800' : ''}
                  `}
                  aria-label="Notifications"
                >
                  <Bell
                    className={`w-5 h-5 transition-colors duration-200 ${
                      notifOpen
                        ? 'text-blue-600 dark:text-blue-400'
                        : 'group-hover:text-blue-600 dark:group-hover:text-blue-400'
                    }`}
                  />

                  {/* Badge — shows count, collapses to 99+ */}
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center leading-none shadow-sm">
                      {unreadCount > 99 ? '99+' : unreadCount}
                    </span>
                  )}
                </button>

                {/* Dropdown panel */}
                {notifOpen && (
                  <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-card border border-border rounded-xl shadow-2xl z-50 overflow-hidden">

                    {/* Header row */}
                    <div className="flex items-center justify-between px-4 py-3 border-b border-border">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-sm">Notifications</h3>
                        {unreadCount > 0 && (
                          <span className="bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                            {unreadCount}
                          </span>
                        )}
                      </div>
                      {unreadCount > 0 && (
                        <button
                          onClick={() => markAllRead()}
                          className="flex items-center gap-1 text-xs text-primary hover:text-primary/80 font-medium transition-colors"
                          title="Mark all as read"
                        >
                          <CheckCheck className="w-3.5 h-3.5" />
                          Mark all read
                        </button>
                      )}
                    </div>

                    {/* Notification list */}
                    <div className="max-h-[360px] overflow-y-auto divide-y divide-border">
                      {notifications.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-10 text-muted-foreground">
                          <Bell className="w-8 h-8 mb-2 opacity-30" />
                          <p className="text-sm">No notifications yet</p>
                        </div>
                      ) : (
                        notifications.map((n) => (
                          <div
                            key={n.id}
                            className={`flex items-start gap-3 px-4 py-3 hover:bg-muted/50 transition-colors group ${!n.read ? 'bg-blue-50/50 dark:bg-blue-900/10' : ''
                              }`}
                          >
                            {/* Type icon */}
                            {getNotificationIcon(n.type)}

                            {/* Content */}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between gap-2">
                                <p className={`text-sm leading-snug ${!n.read ? 'font-semibold' : 'font-medium'}`}>
                                  {n.title}
                                </p>
                                {/* Unread dot */}
                                {!n.read && (
                                  <span className="w-2 h-2 rounded-full bg-blue-500 shrink-0 mt-1.5" />
                                )}
                              </div>
                              <p className="text-xs text-muted-foreground mt-0.5 leading-snug">
                                {n.message}
                              </p>
                              <p className="text-[10px] text-muted-foreground/60 mt-1">
                                {formatTime(n.timestamp)}
                              </p>
                            </div>

                            {/* Dismiss button — appears on hover */}
                            <button
                              onClick={() => removeNotification(n.id)}
                              className="opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-foreground shrink-0 mt-0.5"
                              title="Dismiss"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ))
                      )}
                    </div>

                    {/* Footer — clear all */}
                    {notifications.length > 0 && (
                      <div className="px-4 py-2.5 border-t border-border bg-muted/30">
                        <button
                          onClick={() => {
                            useNotificationStore.getState().clearAll()
                          }}
                          className="text-xs text-muted-foreground hover:text-destructive transition-colors w-full text-center"
                        >
                          Clear all notifications
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
              {/* ─────────────────────────────────────────────────────────── */}

              {/* Theme Toggle */}
              <ThemeToggle />
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto bg-background">
          <div className="h-full">{children}</div>
        </main>
      </div>
    </div>
  )
}
