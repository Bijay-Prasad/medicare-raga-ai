import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  AuthError,
} from 'firebase/auth'
import { auth } from '@/lib/firebase'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import { toast } from 'sonner'
import { Heart, Eye, EyeOff } from 'lucide-react'

/** Maps Firebase error codes to human-readable messages */
function getFirebaseErrorMessage(error: AuthError): string {
  switch (error.code) {
    case 'auth/invalid-credential':
    case 'auth/wrong-password':
    case 'auth/user-not-found':
      return 'Invalid email or password. Please try again.'
    case 'auth/email-already-in-use':
      return 'An account with this email already exists.'
    case 'auth/weak-password':
      return 'Password should be at least 6 characters.'
    case 'auth/invalid-email':
      return 'Please enter a valid email address.'
    case 'auth/too-many-requests':
      return 'Too many failed attempts. Please try again later.'
    case 'auth/network-request-failed':
      return 'Network error. Please check your connection.'
    case 'auth/api-key-not-valid':
    case 'auth/invalid-api-key':
      return 'Firebase is not configured. Please set up your .env file with valid Firebase credentials.'
    default:
      return error.message || 'Authentication failed. Please try again.'
  }
}


export default function LoginPage() {
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [isSignUp, setIsSignUp] = useState(false)
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // Client-side validation
      if (!formData.email || !formData.password) {
        toast.error('Please fill in all fields')
        setIsLoading(false)
        return
      }

      if (isSignUp) {
        if (formData.password !== formData.confirmPassword) {
          toast.error('Passwords do not match')
          setIsLoading(false)
          return
        }
        if (formData.password.length < 6) {
          toast.error('Password must be at least 6 characters')
          setIsLoading(false)
          return
        }

        // Real Firebase sign-up
        await createUserWithEmailAndPassword(auth, formData.email, formData.password)
        toast.success('Account created successfully!')
      } else {
        // Real Firebase sign-in
        await signInWithEmailAndPassword(auth, formData.email, formData.password)
        toast.success('Signed in successfully!')
      }

      // onAuthStateChanged in AuthProvider will update Zustand automatically
      // Small delay so toast is visible before navigation
      await new Promise((resolve) => setTimeout(resolve, 400))
      navigate('/dashboard')
    } catch (error: any) {
      const message = getFirebaseErrorMessage(error as AuthError)
      toast.error(message)
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <div className="w-12 h-12 rounded-full bg-linear-to-br from-blue-600 to-indigo-600 flex items-center justify-center shadow-lg">
            <Heart className="w-7 h-7 text-white" />
          </div>
        </div>

        {/* Card */}
        <Card className="p-8 shadow-2xl">
          <h1 className="text-3xl font-bold text-center mb-2 text-foreground">MediCare SaaS</h1>
          <p className="text-center text-muted-foreground mb-8">
            {isSignUp ? 'Create your account' : 'Welcome back'}
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div>
              <label className="block text-sm font-medium mb-2 text-foreground">Email</label>
              <Input
                type="email"
                name="email"
                placeholder="you@example.com"
                value={formData.email}
                onChange={handleInputChange}
                disabled={isLoading}
                required
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium mb-2 text-foreground">Password</label>
              <div className="relative">
                <Input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleInputChange}
                  disabled={isLoading}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            {isSignUp && (
              <div>
                <label className="block text-sm font-medium mb-2 text-foreground">
                  Confirm Password
                </label>
                <Input
                  type={showPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  placeholder="••••••••"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  disabled={isLoading}
                  required
                />
              </div>
            )}

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full mt-6 bg-blue-600 hover:bg-blue-700 text-white"
            >
              {isLoading ? 'Loading...' : isSignUp ? 'Create Account' : 'Sign In'}
            </Button>
          </form>

          {/* Toggle Mode */}
          <div className="mt-6 text-center">
            <p className="text-sm text-muted-foreground">
              {isSignUp ? 'Already have an account?' : "Don't have an account?"}
              <button
                onClick={() => setIsSignUp(!isSignUp)}
                className="ml-1 font-semibold text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
              >
                {isSignUp ? 'Sign In' : 'Sign Up'}
              </button>
            </p>
          </div>

          {/* Demo Credentials */}
          {!isSignUp && (
            <div className="mt-6 pt-6 border-t border-border">
              <p className="text-xs text-muted-foreground mb-3">
                Demo Credentials:
              </p>
              <p className="text-xs text-muted-foreground mb-1">
                Email: <span className="font-mono text-foreground">demo@example.com</span>
              </p>
              <p className="text-xs text-muted-foreground">
                Password: <span className="font-mono text-foreground">demo123</span>
              </p>
            </div>
          )}
        </Card>
      </div>
    </div>
  )
}
