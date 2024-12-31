'use client'

import { useState } from 'react'
import SignInForm from '@/components/auth/SignInForm'
import SignUpForm from '@/components/auth/SignUpForm'

export default function AuthPage() {
  const [mode, setMode] = useState<'signin' | 'signup'>('signin')

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          {mode === 'signin' ? 'Se connecter à Petit Génie' : 'Créer un compte Petit Génie'}
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        {mode === 'signin' ? <SignInForm /> : <SignUpForm />}
        
        <div className="mt-6 text-center">
          <button
            onClick={() => setMode(mode === 'signin' ? 'signup' : 'signin')}
            className="text-sm text-blue-600 hover:text-blue-500"
          >
            {mode === 'signin' 
              ? "Pas encore de compte ? S'inscrire" 
              : 'Déjà un compte ? Se connecter'}
          </button>
        </div>
      </div>
    </div>
  )
}
