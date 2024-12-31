'use client'

import { useEffect } from 'react'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Loguer l'erreur sur un service d'erreur
    console.error(error)
  }, [error])

  return (
    <div className="min-h-[50vh] flex flex-col items-center justify-center p-6">
      <div className="glass-card p-8 max-w-lg w-full text-center">
        <h2 className="text-2xl font-bold text-gradient mb-4">
          Une erreur est survenue
        </h2>
        <p className="text-white/70 mb-6">
          Nous nous excusons pour ce désagrément. Notre équipe a été notifiée et travaille sur la résolution du problème.
        </p>
        <button
          onClick={reset}
          className="btn-modern"
        >
          <span className="relative z-10">Réessayer</span>
        </button>
      </div>
    </div>
  )
}
