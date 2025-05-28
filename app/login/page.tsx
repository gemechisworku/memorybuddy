'use client'

import { useEffect } from 'react'
import { Auth } from '@supabase/auth-ui-react'
import { ThemeSupa } from '@supabase/auth-ui-shared'
import { supabase } from '../../lib/supabase'
import { useRouter } from 'next/navigation'
import { useAuth } from '../../contexts/AuthContext'

export default function LoginPage() {
  const router = useRouter()
  const { user, loading } = useAuth()

  useEffect(() => {
    if (user && !loading) {
      router.push('/')
    }
  }, [user, loading, router])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  if (user) {
    return null
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow-lg">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900">Quick Notes</h2>
          <p className="mt-2 text-sm text-gray-600">Sign in to access your notes</p>
        </div>
        <Auth
          supabaseClient={supabase}
          redirectTo={`${window.location.origin}/`}
          view="sign_in"
          showLinks={true}
          appearance={{
            theme: ThemeSupa,
            variables: {
              default: {
                colors: {
                  brand: '#3B82F6',
                  brandAccent: '#2563EB',
                }
              }
            },
            className: {
              container: 'w-full',
              button: 'w-full px-4 py-2 text-white bg-blue-500 hover:bg-blue-600 rounded',
              input: 'w-full px-3 py-2 border rounded',
            }
          }}
        />
      </div>
    </div>
  )
} 