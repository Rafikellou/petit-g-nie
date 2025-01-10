'use client'

import { useState } from 'react'
import SignInForm from '@/components/auth/SignInForm'
import SignUpForm from '@/components/auth/SignUpForm'

export default function AuthPage() {
  const [mode, setMode] = useState<'signin' | 'signup'>('signin')

  return (
    <div className="min-h-screen flex flex-col justify-center bg-background px-4">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="text-center text-3xl font-bold text-white">
          {mode === 'signin' ? 'Se connecter à Petit Génie' : 'Créer un compte Petit Génie'}
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="glass-card p-8 space-y-6 bg-gray-950/50 backdrop-blur-xl border border-white/10 rounded-2xl">
          {mode === 'signin' ? <SignInForm /> : <SignUpForm />}
          
          <div className="mt-6 text-center">
            <button
              onClick={() => setMode(mode === 'signin' ? 'signup' : 'signin')}
              className="text-sm text-white/70 hover:text-white transition-colors"
            >
              {mode === 'signin' 
                ? "Pas encore de compte ? S'inscrire" 
                : 'Déjà un compte ? Se connecter'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
