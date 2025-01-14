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
          
          if (redirectTo) {
            router.push(redirectTo)
            return
          }

          // Rediriger vers la page appropriée selon le rôle
          switch (user.role) {
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
        } else {
          router.push('/')
        }
      } catch (error) {
        console.error('Erreur lors de la redirection:', error)
        router.push('/')
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
