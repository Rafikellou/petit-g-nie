'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function AdminLoading() {
  const router = useRouter()

  useEffect(() => {
    // Rediriger vers le dashboard après un court délai
    // Cela permet de s'assurer que la page est rendue avant de charger le dashboard
    const timer = setTimeout(() => {
      router.push('/admin/dashboard')
    }, 1000)

    return () => clearTimeout(timer)
  }, [router])

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white">
      <div className="flex justify-center items-center h-screen flex-col">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
        <p className="text-white">Chargement du tableau de bord administrateur...</p>
      </div>
    </div>
  )
}
