"use client"

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/ios-button'
import { Loader2 } from 'lucide-react'
import { authService } from '@/lib/auth'
import { UserRole } from '@/types/auth'
import { supabase } from '@/lib/supabase'

interface SchoolData {
  id: string;
  nom_ecole: string;
}

export default function TeacherSignUpForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [invitationCode, setInvitationCode] = useState('')
  const [selectedSchool, setSelectedSchool] = useState('')
  const [schools, setSchools] = useState<SchoolData[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  // Récupérer la liste des écoles disponibles
  useEffect(() => {
    const fetchSchools = async () => {
      try {
        const { data, error } = await supabase
          .from('schools')
          .select('id, nom_ecole')
          .order('nom_ecole', { ascending: true })

        if (error) throw error

        if (data) {
          setSchools(data)
        }
      } catch (error) {
        console.error('Erreur lors de la récupération des écoles:', error)
      }
    }

    fetchSchools()
  }, [])

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      setLoading(true)
      setError(null)

      if (!email || !password || !fullName) {
        setError('Veuillez remplir tous les champs obligatoires')
        setLoading(false)
        return
      }

      // Si un code d'invitation est fourni, on ne vérifie pas l'école sélectionnée
      if (!invitationCode && !selectedSchool) {
        setError('Veuillez sélectionner une école ou saisir un code d\'invitation')
        setLoading(false)
        return
      }

      const { user, error } = await authService.signUp({
        email,
        password,
        role: 'teacher',
        full_name: fullName,
        invitation_code: invitationCode,
        school_id: selectedSchool || undefined
        // Pas de niveaux de classe enseignés - ils seront assignés par l'administrateur
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

  return (
    <div className="space-y-6">
      <form onSubmit={handleSignUp} className="space-y-4">
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

        <div className="pt-4 border-t border-gray-700">
          <p className="text-sm text-gray-400 mb-4">
            Vous pouvez soit sélectionner une école, soit saisir un code d'invitation fourni par un administrateur.
          </p>
          
          <div>
            <label 
              htmlFor="school" 
              className="block text-sm font-medium text-white/70 mb-2"
            >
              École
            </label>
            <select
              id="school"
              value={selectedSchool}
              onChange={(e) => setSelectedSchool(e.target.value)}
              className="w-full px-3 py-2 rounded-md bg-gray-700 text-white border border-gray-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              disabled={!!invitationCode}
            >
              <option value="">Sélectionnez une école</option>
              {schools.map((school) => (
                <option key={school.id} value={school.id}>
                  {school.nom_ecole}
                </option>
              ))}
            </select>
          </div>

          <div className="mt-4">
            <label 
              htmlFor="invitationCode" 
              className="block text-sm font-medium text-white/70 mb-2"
            >
              Code d'invitation
            </label>
            <input
              id="invitationCode"
              type="text"
              value={invitationCode}
              onChange={(e) => {
                setInvitationCode(e.target.value)
                // Si un code d'invitation est saisi, on désactive la sélection d'école
                if (e.target.value) {
                  setSelectedSchool('')
                }
              }}
              className="w-full px-3 py-2 rounded-md bg-gray-700 text-white border border-gray-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
          </div>
        </div>

        <Button 
          type="submit" 
          disabled={loading}
          className="w-full mt-4"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Création du compte...
            </>
          ) : (
            'Créer un compte enseignant'
          )}
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
