"use client"

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/ios-button'
import { Loader2 } from 'lucide-react'
import { authService } from '@/lib/auth'
import { UserRole } from '@/types/auth'
import { supabase } from '@/lib/supabase'

interface SchoolData {
  name: string;
}

interface SchoolsResponse {
  // Dans la réponse de Supabase, schools est un tableau
  schools: { name: string }[];
}

interface ClassData {
  id: string;
  name: string;
  school_id: string;
  class_level: string;
  schools?: SchoolData;
}

// Constante pour les niveaux de classe (pour la compatibilité avec le code existant)
const CLASS_LEVELS = ['CP', 'CE1', 'CE2', 'CM1', 'CM2'];

export default function SignUpForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [childName, setChildName] = useState('')
  const [classCode, setClassCode] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [step, setStep] = useState(1) 
  const router = useRouter()
  const searchParams = useSearchParams()

  // Récupérer le code de classe depuis l'URL si présent
  useEffect(() => {
    const code = searchParams.get('code')
    if (code) {
      setClassCode(code)
    }
  }, [searchParams]);

  const handleNextStep = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (step === 1) {
      if (!email || !password || !fullName) {
        setError('Veuillez remplir tous les champs obligatoires')
        return
      }
      setError(null)
      setStep(2)
    } else if (step === 2) {
      if (!childName) {
        setError('Veuillez entrer le nom de l\'enfant')
        return
      }
      setError(null)
      setStep(3)
    }
  }

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      setLoading(true)
      setError(null)

      // Vérifier que le code de classe est fourni
      if (!classCode) {
        setError('Veuillez entrer le code de classe fourni par l\'enseignant')
        setLoading(false)
        return
      }

      const { user, error } = await authService.signUp({
        email,
        password,
        full_name: fullName,
        role: 'parent',
        invitation_code: classCode, // Utiliser le code de classe comme code d'invitation
        child_name: childName
      })

      if (error) {
        setError(error.message || String(error))
        return
      }

      router.push('/auth/verify')
    } catch (error: any) {
      setError(error.message || String(error))
    } finally {
      setLoading(false)
    }
  }

  if (step === 1) {
    return (
      <div className="space-y-6">
        <form onSubmit={handleNextStep} className="space-y-4">
          <div>
            <label 
              htmlFor="fullName" 
              className="block text-sm font-medium text-white/70 mb-2"
            >
              Nom complet
            </label>
            <input
              id="fullName"
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
              className="w-full px-3 py-2 rounded-md bg-gray-700 text-white border border-gray-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div>
            <label 
              htmlFor="email" 
              className="block text-sm font-medium text-white/70 mb-2"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-3 py-2 rounded-md bg-gray-700 text-white border border-gray-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div>
            <label 
              htmlFor="password" 
              className="block text-sm font-medium text-white/70 mb-2"
            >
              Mot de passe
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-3 py-2 rounded-md bg-gray-700 text-white border border-gray-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <Button 
            type="submit" 
            className="w-full"
          >
            Continuer
          </Button>
        </form>

        {error && (
          <div className="p-3 rounded bg-red-500/20 border border-red-500 text-red-200">
            {error}
          </div>
        )}
      </div>
    )
  }

  if (step === 2) {
    return (
      <div className="space-y-6">
        <form onSubmit={handleNextStep} className="space-y-4">
          <div>
            <label 
              htmlFor="childName" 
              className="block text-sm font-medium text-white/70 mb-2"
            >
              Nom de l'enfant
            </label>
            <input
              id="childName"
              type="text"
              value={childName}
              onChange={(e) => setChildName(e.target.value)}
              required
              className="w-full px-3 py-2 rounded-md bg-gray-700 text-white border border-gray-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div>
            <label 
              htmlFor="classCode" 
              className="block text-sm font-medium text-white/70 mb-2"
            >
              Code de classe *
            </label>
            <input
              id="classCode"
              type="text"
              value={classCode}
              onChange={(e) => setClassCode(e.target.value)}
              required
              className="w-full px-3 py-2 rounded-md bg-gray-700 text-white border border-gray-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
            <p className="text-xs text-gray-400 mt-1">Ce code vous a été fourni par l'enseignant ou l'administrateur</p>
          </div>

          <div className="flex space-x-4">
            <Button 
              type="button" 
              onClick={() => setStep(1)}
              className="w-1/2"
              variant="secondary"
            >
              Retour
            </Button>
            
            <Button 
              type="submit" 
              className="w-1/2"
            >
              Continuer
            </Button>
          </div>
        </form>

        {error && (
          <div className="p-3 rounded bg-red-500/20 border border-red-500 text-red-200">
            {error}
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium text-white">Finalisez l'inscription</h3>
      
      <form onSubmit={handleSignUp} className="space-y-4">
        <div>
          <label 
            htmlFor="classCode" 
            className="block text-sm font-medium text-white/70 mb-2"
          >
            Code de classe *
          </label>
          <input
            id="classCode"
            type="text"
            value={classCode}
            onChange={(e) => setClassCode(e.target.value)}
            required
            className="w-full px-3 py-2 rounded-md bg-gray-700 text-white border border-gray-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          />
          <p className="text-xs text-gray-400 mt-1">Ce code vous a été fourni par l'enseignant ou l'administrateur</p>
        </div>

        <div className="flex space-x-4">
          <Button 
            type="button" 
            onClick={() => setStep(2)}
            className="w-1/2"
            variant="secondary"
          >
            Retour
          </Button>
          
          <Button 
            type="submit" 
            disabled={loading}
            className="w-1/2"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Création du compte...
              </>
            ) : (
              'Créer un compte'
            )}
          </Button>
        </div>
      </form>

      {error && (
        <div className="p-3 rounded bg-red-500/20 border border-red-500 text-red-200">
          {error}
        </div>
      )}
    </div>
  )
}
