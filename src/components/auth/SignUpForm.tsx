"use client"

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/ios-button'
import { Loader2 } from 'lucide-react'
import { authService } from '@/lib/auth'
import { UserRole } from '@/types/auth'
import { supabase } from '@/lib/supabase'

interface SchoolData {
  name: string;
}

interface ClassData {
  id: string;
  name: string;
  school_id: string;
  schools?: SchoolData;
}

// Constante pour les niveaux de classe
const CLASS_OPTIONS = ['CP', 'CE1', 'CE2', 'CM1', 'CM2'];

export default function SignUpForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [childName, setChildName] = useState('')
  const [invitationCode, setInvitationCode] = useState('')
  const [selectedClass, setSelectedClass] = useState('')
  const [classes, setClasses] = useState<{ id: string; name: string; school_name: string }[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [step, setStep] = useState(1) // 1: Infos de base, 2: Sélection de classe
  const router = useRouter()

  // Récupérer la liste des classes disponibles
  useEffect(() => {
    if (step === 2) {
      const fetchClasses = async () => {
        try {
          const { data, error } = await supabase
            .from('classes')
            .select(`
              id,
              name,
              school_id,
              schools (
                name
              )
            `)
            .order('name', { ascending: true })

          if (error) throw error

          if (data) {
            // Conversion sûre des données
            const classesData = data as unknown as ClassData[];
            setClasses(classesData.map(c => ({
              id: c.id,
              name: c.name,
              school_name: c.schools ? c.schools.name : 'École inconnue'
            })))
          }
        } catch (error) {
          console.error('Erreur lors de la récupération des classes:', error)
        }
      }

      fetchClasses()
    }
  }, [step])

  const handleNextStep = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!email || !password || !childName) {
      setError('Veuillez remplir tous les champs obligatoires')
      return
    }
    
    setError(null)
    setStep(2)
  }

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      setLoading(true)
      setError(null)

      if (!selectedClass) {
        setError('Veuillez sélectionner une classe')
        setLoading(false)
        return
      }

      const { user, error } = await authService.signUp({
        email,
        password,
        role: 'parent',
        invitation_code: invitationCode,
        child_name: childName,
        class_level: selectedClass
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

          <div>
            <label 
              htmlFor="invitationCode" 
              className="block text-sm font-medium text-white/70 mb-2"
            >
              Code d'invitation (optionnel)
            </label>
            <input
              id="invitationCode"
              type="text"
              value={invitationCode}
              onChange={(e) => setInvitationCode(e.target.value)}
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

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium text-white">Sélectionnez la classe de votre enfant</h3>
      
      <form onSubmit={handleSignUp} className="space-y-4">
        <div>
          <label 
            htmlFor="class" 
            className="block text-sm font-medium text-white/70 mb-2"
          >
            Classe
          </label>
          <select
            id="class"
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
            required
            className="w-full px-3 py-2 rounded-md bg-gray-700 text-white border border-gray-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          >
            <option value="">Sélectionnez une classe</option>
            {CLASS_OPTIONS.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
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
