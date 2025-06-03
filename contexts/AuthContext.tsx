'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { User, Session } from '@supabase/supabase-js'
import { supabase } from '../lib/supabase'
import { useRouter } from 'next/navigation'

interface AuthContextType {
  user: User | null
  session: Session | null
  loading: boolean
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    console.log('AuthProvider: Initializing')
    
    // Initialize auth state
    const initializeAuth = async () => {
      try {
        // Get initial session
        const { data: { session: initialSession }, error: sessionError } = await supabase.auth.getSession()
        if (sessionError) throw sessionError

        console.log('AuthProvider: Initial session:', initialSession?.user?.id)
        setSession(initialSession)
        setUser(initialSession?.user ?? null)

        // Listen for auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, currentSession) => {
          console.log('AuthProvider: Auth state changed:', event, currentSession?.user?.id)
          
          if (event === 'SIGNED_IN') {
            console.log('AuthProvider: User signed in')
            setSession(currentSession)
            setUser(currentSession?.user ?? null)
          } else if (event === 'SIGNED_OUT') {
            console.log('AuthProvider: User signed out')
            setSession(null)
            setUser(null)
            router.push('/login')
          } else if (event === 'TOKEN_REFRESHED') {
            console.log('AuthProvider: Token refreshed')
            setSession(currentSession)
            setUser(currentSession?.user ?? null)
          }
        })

        return () => {
          subscription.unsubscribe()
        }
      } catch (error) {
        console.error('AuthProvider: Error initializing auth:', error)
        setUser(null)
        setSession(null)
      } finally {
        setLoading(false)
      }
    }

    initializeAuth()
  }, [router])

  const signOut = async () => {
    try {
      await supabase.auth.signOut()
      setUser(null)
      setSession(null)
      router.push('/login')
    } catch (error) {
      console.error('AuthProvider: Error signing out:', error)
    }
  }

  const value = {
    user,
    session,
    loading,
    signOut
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
} 