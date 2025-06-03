import { NextResponse } from 'next/server'
import { supabase } from '../../../../lib/supabase'

export async function POST(request: Request) {
  try {
    const { email } = await request.json()

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      )
    }

    // Check if the email exists in auth.users
    const { data: user, error } = await supabase
      .from('auth.users')
      .select('id, email, provider')
      .eq('email', email)
      .single()

    if (error) {
      console.error('Error checking email:', error)
      return NextResponse.json(
        { error: 'Failed to check email' },
        { status: 500 }
      )
    }

    // If user exists and uses Google as provider
    if (user && user.provider === 'google') {
      return NextResponse.json({ isGoogleUser: true })
    }

    // If user doesn't exist or doesn't use Google
    return NextResponse.json({ isGoogleUser: false })
  } catch (error) {
    console.error('Error in check-email route:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 