import { useEffect, ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/lib/stores/authStore'
import { Card } from '@/components/ui/card'
import { Heart } from 'lucide-react'

export function ProtectedRoute({ children }: { children: ReactNode }) {
  const navigate = useNavigate()
  const { isAuthenticated, isLoading } = useAuthStore()

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate('/login')
    }
  }, [isAuthenticated, isLoading, navigate])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="p-8">
          <div className="flex flex-col items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-linear-to-br from-blue-600 to-indigo-600 flex items-center justify-center">
              <Heart className="w-6 h-6 text-white animate-pulse" />
            </div>
            <p className="text-muted-foreground">Loading...</p>
          </div>
        </Card>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  return <>{children}</>
}
