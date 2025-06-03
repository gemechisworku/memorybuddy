'use client'

import { useEffect, useState } from 'react'
import { Auth } from '@supabase/auth-ui-react'
import { ThemeSupa } from '@supabase/auth-ui-shared'
import { supabase } from '../../lib/supabase'
import { useRouter, useSearchParams } from 'next/navigation'
import { useAuth } from '../../contexts/AuthContext'
import Logo from '../../components/Logo'

export default function LoginPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { user, loading } = useAuth()
  const redirectTo = searchParams.get('redirectTo') || '/'
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Check for auth callback
    const handleAuthCallback = async () => {
      const { data: { session }, error } = await supabase.auth.getSession()
      if (session) {
        console.log('LoginPage: Session found after auth callback, redirecting to:', redirectTo)
        router.push(redirectTo)
      }
    }

    handleAuthCallback()
  }, [router, redirectTo])

  useEffect(() => {
    if (user && !loading) {
      console.log('LoginPage: User authenticated, redirecting to:', redirectTo)
      router.push(redirectTo)
    }
  }, [user, loading, router, redirectTo])

  const handleEmailSignUp = async (email: string) => {
    try {
      const response = await fetch('/api/auth/check-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      })

      const data = await response.json()

      if (data.isGoogleUser) {
        setError('This email is already registered with Google. Please sign in with Google instead.')
        return false
      }

      return true
    } catch (error) {
      console.error('Error checking email:', error)
      return true // Allow sign up if check fails
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  if (user) {
    return null
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 px-4">
      {/* Header */}
      <div className="mb-8">
        <Logo size="large" className="text-white" />
      </div>

      {/* Login Container */}
      <div className="w-full max-w-[340px]">
        <div className="bg-gray-800 rounded-xl px-6 py-8 shadow-lg border border-gray-700">
          <h2 className="text-xl font-semibold text-white mb-6">Sign in to MemoryBuddy</h2>
          
          {error && (
            <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
              <p className="text-sm text-red-400">{error}</p>
            </div>
          )}

          <Auth
            supabaseClient={supabase}
            providers={['google']}
            redirectTo={`${window.location.origin}${redirectTo}`}
            view="sign_in"
            showLinks={true}
            appearance={{
              theme: ThemeSupa,
              variables: {
                default: {
                  colors: {
                    brand: '#2F81F7',
                    brandAccent: '#2267D1',
                    inputBackground: '#1f2937',
                    inputBorder: '#374151',
                    inputBorderHover: '#4b5563',
                    inputBorderFocus: '#2F81F7',
                    inputText: 'white',
                  },
                  borderWidths: {
                    buttonBorderWidth: '1px',
                    inputBorderWidth: '1px',
                  },
                  radii: {
                    borderRadiusButton: '0.75rem',
                    buttonBorderRadius: '0.75rem',
                    inputBorderRadius: '0.75rem',
                  },
                },
              },
              className: {
                container: 'w-full',
                button: 'w-full px-4 py-2 text-sm font-medium border focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 focus:ring-offset-gray-800',
                input: 'w-full px-3 py-2 text-sm border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-700 text-white placeholder-gray-400',
                label: 'block text-sm font-medium text-gray-200 mb-1',
                anchor: 'text-sm text-blue-400 hover:text-blue-300',
              },
            }}
            localization={{
              variables: {
                sign_in: {
                  email_label: 'Email address',
                  password_label: 'Password',
                },
                sign_up: {
                  email_label: 'Email address',
                  password_label: 'Password',
                },
              },
            }}
            additionalData={{
              email: {
                validate: handleEmailSignUp
              }
            }}
          />
        </div>
      </div>
    </div>
  )
} 