'use client'

import { useState } from 'react'
import SignInForm from '@/components/auth/SignInForm'
import { useRouter } from 'next/navigation'

export default function AuthPage() {
  const router = useRouter()
  return (
    <div className="min-h-screen flex flex-col justify-center bg-background px-4">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="text-center text-3xl font-bold text-white">
          Se connecter à Futur Génie
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="glass-card p-8 space-y-6 bg-gray-900/70 backdrop-blur-xl border border-white/10 rounded-2xl">
          <SignInForm />
          
          <div className="mt-6 text-center">
            <button
              onClick={() => router.push('/auth/signup')}
              className="text-sm text-white/70 hover:text-white transition-colors"
            >
              Pas encore de compte ? S'inscrire
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
