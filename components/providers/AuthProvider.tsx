import { useEffect, ReactNode } from 'react'
import { onAuthStateChanged } from 'firebase/auth'
import { auth } from '@/lib/firebase'
import { useAuthStore } from '@/lib/stores/authStore'

export function AuthProvider({ children }: { children: ReactNode }) {
  const { setUser, setIsLoading } = useAuthStore()

  useEffect(() => {
    // Mark loading while Firebase resolves the persisted session
    setIsLoading(true)

    // Subscribe to Firebase auth state — fires immediately with current user
    // (null if logged out, User object if session still valid)
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser)   // null clears auth; User object restores session
      setIsLoading(false)
    })

    // Cleanup listener on unmount
    return () => unsubscribe()
  }, [setUser, setIsLoading])

  return <>{children}</>
}
