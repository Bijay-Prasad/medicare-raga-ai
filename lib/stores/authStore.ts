import { create } from 'zustand'
import { User } from 'firebase/auth'

interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
  setUser: (user: User | null) => void
  setIsLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  logout: () => void
  clearError: () => void
}

// No `persist` middleware — Firebase SDK natively persists the session
// (IndexedDB / localStorage via firebase/auth). Zustand-persisted user
// would go stale after signOut, causing ghost-login bugs.
export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true, // true on mount — AuthProvider resolves it via onAuthStateChanged
  error: null,
  setUser: (user) =>
    set({
      user,
      isAuthenticated: !!user,
      isLoading: false,
    }),
  setIsLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error }),
  logout: () =>
    set({
      user: null,
      isAuthenticated: false,
      error: null,
    }),
  clearError: () => set({ error: null }),
}))
