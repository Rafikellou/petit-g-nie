'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export default function AuthCallbackPage() {
  const router = useRouter()

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession()
        
        if (error) throw error
        
        if (session) {
          // Redirect to home page or dashboard after successful authentication
          router.push('/')
        }
      } catch (error) {
        console.error('Error in auth callback:', error)
        router.push('/auth?error=Authentication failed')
      }
    }

    handleAuthCallback()
  }, [router])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
        <h2 className="mt-4 text-lg font-medium text-gray-900">Authentification en cours...</h2>
      </div>
    </div>
  )
}
