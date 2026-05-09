import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/lib/stores/authStore'
import { Card } from '@/components/ui/card'
import { Heart } from 'lucide-react'

export default function HomePage() {
  const navigate = useNavigate()
  const { isAuthenticated, isLoading } = useAuthStore()

  useEffect(() => {
    if (!isLoading) {
      if (isAuthenticated) {
        navigate('/dashboard')
      } else {
        navigate('/login')
      }
    }
  }, [isAuthenticated, isLoading, navigate])

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-slate-800">
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
