'use client'

import { useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { authService } from '@/lib/auth'

export default function AuthCallbackPage() {
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        const { user, error } = await authService.getCurrentUser()
        
        if (error) throw error
        
        if (user) {
          // Récupérer l'URL de redirection si elle existe
          const redirectTo = searchParams.get('redirectTo')
          
          if (user.profiles.length > 1) {
            router.push('/profile-selector')
            return
          }

          // Rediriger vers la page appropriée selon le rôle
          const profile = user.profiles[0]
          if (profile) {
            if (redirectTo) {
              router.push(redirectTo)
            } else {
              switch (profile.role) {
                case 'super_admin':
                  router.push('/super-admin')
                  break
                case 'admin':
                  router.push('/admin')
                  break
                case 'teacher':
                  router.push('/teacher')
                  break
                case 'parent':
                  router.push('/parent')
                  break
                default:
                  router.push('/')
              }
            }
          } else {
            router.push('/')
          }
        } else {
          router.push('/auth?error=Authentication failed')
        }
      } catch (error) {
        console.error('Error in auth callback:', error)
        router.push('/auth?error=Authentication failed')
      }
    }

    handleAuthCallback()
  }, [router, searchParams])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="p-4 rounded-md bg-white shadow-sm">
        <p className="text-gray-500">Redirection en cours...</p>
      </div>
    </div>
  )
}
