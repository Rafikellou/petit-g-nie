'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

// Constante pour les niveaux de classe
const CLASS_OPTIONS = ['CP', 'CE1', 'CE2', 'CM1', 'CM2'];

// Types d'utilisateurs
type UserRole = 'admin' | 'teacher' | 'parent';

// Interface pour les enfants (parent)
interface Child {
  id: string
  name: string
  class_level: string
}

// Validation d'email
const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export default function SignUpPage() {
  const router = useRouter()
  
  // Étape 1 - Informations de base
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [surname, setSurname] = useState('')
  const [familyName, setFamilyName] = useState('')
  
  // Étape 2 - Sélection du rôle
  const [role, setRole] = useState<UserRole>('parent')

  // Vérifier si un rôle est spécifié dans l'URL et récupérer le code d'invitation
  useEffect(() => {
    // Récupérer les paramètres de l'URL
    const params = new URLSearchParams(window.location.search)
    const roleParam = params.get('role')
    const codeParam = params.get('code')
    
    // Si un code est spécifié dans l'URL, le définir comme code d'invitation
    if (codeParam) {
      setInvitationCode(codeParam)
    }
    
    // Si un rôle valide est spécifié dans l'URL, le définir comme rôle sélectionné
    if (roleParam === 'parent' || roleParam === 'teacher' || roleParam === 'admin' || roleParam === 'super_admin') {
      setRole(roleParam as UserRole)
      // Passer directement à l'étape de sélection du rôle
      setStep(2)
    }
  }, [])
  
  // Étape 3 - Informations spécifiques par rôle
  // Admin
  const [schoolName, setSchoolName] = useState('')
  const [schoolAddress, setSchoolAddress] = useState('')
  const [schoolPostalCode, setSchoolPostalCode] = useState('')
  const [schoolCity, setSchoolCity] = useState('')
  const [schoolPhone, setSchoolPhone] = useState('')
  const [schoolEmail, setSchoolEmail] = useState('')
  
  // Enseignant
  const [invitationCode, setInvitationCode] = useState('')
  const [teachingLevels, setTeachingLevels] = useState<string[]>([])
  
  // Parent
  const [pinCode, setPinCode] = useState('')
  const [childFirstName, setChildFirstName] = useState('')
  
  // États généraux
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [step, setStep] = useState(1) // 1: Infos de base, 2: Sélection du rôle, 3: Infos spécifiques

  const handleNextStep = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (step === 1) {
      if (!email || !password || !confirmPassword || !surname || !familyName) {
        setError('Veuillez remplir tous les champs obligatoires')
        return
      }
      
      if (!isValidEmail(email)) {
        setError('Veuillez entrer une adresse email valide')
        return
      }
      
      if (password.length < 8) {
        setError('Le mot de passe doit contenir au moins 8 caractères')
        return
      }
      
      if (password !== confirmPassword) {
        setError('Les mots de passe ne correspondent pas')
        return
      }
      
      setError(null)
      setStep(2)
    } else if (step === 2) {
      setError(null)
      setStep(3)
    }
  }

  const handlePreviousStep = () => {
    setStep(step - 1)
  }

  // Gestion des niveaux d'enseignement pour les enseignants
  const handleTeachingLevelChange = (level: string) => {
    setTeachingLevels(prev => {
      if (prev.includes(level)) {
        return prev.filter(l => l !== level)
      } else {
        return [...prev, level]
      }
    })
  }

  // Pas besoin de fonctions de gestion des enfants multiples

  // Soumission du formulaire
  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      setLoading(true)
      setError(null)
      
      // Validation des champs selon le rôle
      if (role === 'admin') {
        if (!schoolName || !schoolAddress || !schoolPostalCode || !schoolCity) {
          setError('Veuillez remplir tous les champs obligatoires')
          return
        }
      } else if (role === 'teacher') {
        if (!invitationCode) {
          setError('Veuillez entrer le code d\'invitation')
          return
        }
      } else if (role === 'parent') {
        if (!pinCode || pinCode.length !== 4 || !/^\d{4}$/.test(pinCode)) {
          setError('Veuillez entrer un code PIN à 4 chiffres')
          return
        }
        
        if (!invitationCode) {
          setError('Veuillez entrer le code de classe fourni par l\'enseignant')
          return
        }
        
        // Vérifier que le prénom de l'enfant est renseigné
        if (!childFirstName) {
          setError('Veuillez entrer le prénom de votre enfant')
          return
        }
      }
      
      // Préparation des données selon le rôle
      const userData = {
        email,
        password,
        surname,
        family_name: familyName,
        role,
        // Données spécifiques au rôle
        ...(role === 'admin' && {
          school_name: schoolName,
          school_address: schoolAddress,
          school_postal_code: schoolPostalCode,
          school_city: schoolCity,
          school_phone: schoolPhone,
          school_email: schoolEmail
        }),
        ...(role === 'teacher' && {
          invitation_code: invitationCode
          // Les niveaux d'enseignement seront définis par l'administrateur
        }),
        ...(role === 'parent' && {
          pin_code: pinCode,
          children: [{ 
            name: childFirstName,
            class_level: 'CP' // Valeur par défaut pour maintenir la compatibilité avec l'API
          }]
        })
      }
      
      // Appel à l'API pour créer le compte
      // Utiliser l'URL complète en production et le chemin relatif en développement
      const apiUrl = process.env.NODE_ENV === 'production'
        ? `${window.location.origin}/api/auth/signup`
        : '/api/auth/signup';
      
      console.log('Calling API at:', apiUrl); // Log pour débogage
      
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(userData)
      })
      
      // Gérer la réponse de manière plus robuste
      let data;
      try {
        data = await response.json();
      } catch (jsonError) {
        console.error('Erreur lors du parsing JSON:', jsonError);
        console.error('Status:', response.status, response.statusText);
        console.error('Réponse brute:', await response.text());
        throw new Error(`Erreur lors du parsing de la réponse (${response.status}): ${response.statusText}`);
      }
      
      if (!response.ok) {
        console.error('Erreur API:', response.status, data);
        // Gérer spécifiquement l'erreur d'email déjà enregistré
        if (data.error && data.error.includes('already been registered')) {
          throw new Error('Un utilisateur avec cette adresse email existe déjà. Veuillez utiliser une autre adresse email ou vous connecter.')
        } else {
          throw new Error(data.error || `Erreur ${response.status}: ${response.statusText}`)
        }
      }
      
      // Stocker l'email dans le localStorage pour la page de vérification
      localStorage.setItem('signupEmail', email)
      
      // Redirection vers la page de vérification
      router.push('/auth/verify')
      
    } catch (err: any) {
      console.error('Erreur lors de l\'inscription:', err);
      setError(err.message || 'Une erreur est survenue lors de l\'inscription')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-gray-900 to-gray-800 p-4 md:p-8">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-white">Petit Génie</h1>
          <h2 className="mt-2 text-xl font-semibold text-white">Créer un compte</h2>
          <p className="mt-2 text-sm text-gray-400">
            Créez un compte pour accéder à Petit Génie
          </p>
        </div>

        {/* Indicateur d'étape */}
        <div className="flex justify-between mb-4">
          <div className={`w-1/3 text-center ${step >= 1 ? 'text-blue-400' : 'text-gray-500'}`}>
            <div className={`rounded-full h-8 w-8 flex items-center justify-center mx-auto mb-1 ${step >= 1 ? 'bg-blue-500' : 'bg-gray-700'}`}>1</div>
            <span className="text-xs">Informations de base</span>
          </div>
          <div className={`w-1/3 text-center ${step >= 2 ? 'text-blue-400' : 'text-gray-500'}`}>
            <div className={`rounded-full h-8 w-8 flex items-center justify-center mx-auto mb-1 ${step >= 2 ? 'bg-blue-500' : 'bg-gray-700'}`}>2</div>
            <span className="text-xs">Type de compte</span>
          </div>
          <div className={`w-1/3 text-center ${step >= 3 ? 'text-blue-400' : 'text-gray-500'}`}>
            <div className={`rounded-full h-8 w-8 flex items-center justify-center mx-auto mb-1 ${step >= 3 ? 'bg-blue-500' : 'bg-gray-700'}`}>3</div>
            <span className="text-xs">Informations spécifiques</span>
          </div>
        </div>

        <div className="rounded-lg border border-gray-700 bg-gray-800/50 p-6 backdrop-blur-sm">
          {/* Étape 1 - Informations de base */}
          {step === 1 && (
            <div className="space-y-6">
              <form onSubmit={handleNextStep} className="space-y-4">
                <div>
                  <label 
                    htmlFor="surname" 
                    className="block text-sm font-medium text-white/70 mb-2"
                  >
                    Prénom
                  </label>
                  <input
                    id="surname"
                    type="text"
                    value={surname}
                    onChange={(e) => setSurname(e.target.value)}
                    required
                    className="w-full px-3 py-2 rounded-md bg-gray-700 text-white border border-gray-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label 
                    htmlFor="familyName" 
                    className="block text-sm font-medium text-white/70 mb-2"
                  >
                    Nom de famille
                  </label>
                  <input
                    id="familyName"
                    type="text"
                    value={familyName}
                    onChange={(e) => setFamilyName(e.target.value)}
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
                    htmlFor="confirmPassword" 
                    className="block text-sm font-medium text-white/70 mb-2"
                  >
                    Confirmer le mot de passe
                  </label>
                  <input
                    id="confirmPassword"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    className="w-full px-3 py-2 rounded-md bg-gray-700 text-white border border-gray-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  />
                </div>

                <button 
                  type="submit" 
                  className="w-full px-3 py-2 rounded-md bg-blue-500 text-white hover:bg-blue-600 focus:ring-1 focus:ring-blue-500"
                >
                  Continuer
                </button>
              </form>

              {error && (
                <div className="p-3 rounded bg-red-500/20 border border-red-500 text-red-200">
                  {error}
                </div>
              )}
            </div>
          )}

          {/* Étape 2 - Sélection du rôle */}
          {step === 2 && (
            <div className="space-y-6">
              <h3 className="text-lg font-medium text-white">Choisissez votre type de compte</h3>
              
              <form onSubmit={handleNextStep} className="space-y-4">
                <div className="space-y-3">
                  <div 
                    className={`p-4 rounded-md cursor-pointer border ${role === 'parent' ? 'border-blue-500 bg-blue-500/10' : 'border-gray-600 bg-gray-700'}`}
                    onClick={() => setRole('parent')}
                  >
                    <div className="flex items-center">
                      <input 
                        type="radio" 
                        id="role-parent" 
                        name="role" 
                        checked={role === 'parent'} 
                        onChange={() => setRole('parent')} 
                        className="mr-2"
                      />
                      <label htmlFor="role-parent" className="font-medium">Parent</label>
                    </div>
                    <p className="text-sm text-gray-400 mt-1 ml-5">Suivez la scolarité de vos enfants</p>
                  </div>
                  
                  <div 
                    className={`p-4 rounded-md cursor-pointer border ${role === 'teacher' ? 'border-blue-500 bg-blue-500/10' : 'border-gray-600 bg-gray-700'}`}
                    onClick={() => setRole('teacher')}
                  >
                    <div className="flex items-center">
                      <input 
                        type="radio" 
                        id="role-teacher" 
                        name="role" 
                        checked={role === 'teacher'} 
                        onChange={() => setRole('teacher')} 
                        className="mr-2"
                      />
                      <label htmlFor="role-teacher" className="font-medium">Enseignant</label>
                    </div>
                    <p className="text-sm text-gray-400 mt-1 ml-5">Gérez vos classes et le suivi des élèves</p>
                  </div>
                  
                  <div 
                    className={`p-4 rounded-md cursor-pointer border ${role === 'admin' ? 'border-blue-500 bg-blue-500/10' : 'border-gray-600 bg-gray-700'}`}
                    onClick={() => setRole('admin')}
                  >
                    <div className="flex items-center">
                      <input 
                        type="radio" 
                        id="role-admin" 
                        name="role" 
                        checked={role === 'admin'} 
                        onChange={() => setRole('admin')} 
                        className="mr-2"
                      />
                      <label htmlFor="role-admin" className="font-medium">Administrateur d'école</label>
                    </div>
                    <p className="text-sm text-gray-400 mt-1 ml-5">Gérez votre établissement scolaire</p>
                  </div>
                </div>

                <div className="flex space-x-4 mt-6">
                  <button 
                    type="button" 
                    onClick={handlePreviousStep}
                    className="w-1/2 px-3 py-2 rounded-md bg-gray-700 text-white border border-gray-600 focus:ring-1 focus:ring-blue-500"
                  >
                    Retour
                  </button>
                  
                  <button 
                    type="submit" 
                    className="w-1/2 px-3 py-2 rounded-md bg-blue-500 text-white hover:bg-blue-600 focus:ring-1 focus:ring-blue-500"
                  >
                    Continuer
                  </button>
                </div>
              </form>

              {error && (
                <div className="p-3 rounded bg-red-500/20 border border-red-500 text-red-200">
                  {error}
                </div>
              )}
            </div>
          )}

          {/* Étape 3 - Informations spécifiques par rôle */}
          {step === 3 && (
            <div className="space-y-6">
              <h3 className="text-lg font-medium text-white">
                {role === 'admin' ? 'Informations de l\'école' : 
                 role === 'teacher' ? 'Informations enseignant' : 
                 'Informations parent'}
              </h3>
              
              {/* Formulaire Admin */}
              {role === 'admin' && (
                <form onSubmit={handleSignUp} className="space-y-4">
                  <div>
                    <label 
                      htmlFor="schoolName" 
                      className="block text-sm font-medium text-white/70 mb-2"
                    >
                      Nom de l'école *
                    </label>
                    <input
                      id="schoolName"
                      type="text"
                      value={schoolName}
                      onChange={(e) => setSchoolName(e.target.value)}
                      required
                      className="w-full px-3 py-2 rounded-md bg-gray-700 text-white border border-gray-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                  
                  <div>
                    <label 
                      htmlFor="schoolAddress" 
                      className="block text-sm font-medium text-white/70 mb-2"
                    >
                      Adresse *
                    </label>
                    <input
                      id="schoolAddress"
                      type="text"
                      value={schoolAddress}
                      onChange={(e) => setSchoolAddress(e.target.value)}
                      required
                      className="w-full px-3 py-2 rounded-md bg-gray-700 text-white border border-gray-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                  
                  <div className="flex space-x-4">
                    <div className="w-1/3">
                      <label 
                        htmlFor="schoolPostalCode" 
                        className="block text-sm font-medium text-white/70 mb-2"
                      >
                        Code postal *
                      </label>
                      <input
                        id="schoolPostalCode"
                        type="text"
                        value={schoolPostalCode}
                        onChange={(e) => setSchoolPostalCode(e.target.value)}
                        required
                        className="w-full px-3 py-2 rounded-md bg-gray-700 text-white border border-gray-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                      />
                    </div>
                    
                    <div className="w-2/3">
                      <label 
                        htmlFor="schoolCity" 
                        className="block text-sm font-medium text-white/70 mb-2"
                      >
                        Ville *
                      </label>
                      <input
                        id="schoolCity"
                        type="text"
                        value={schoolCity}
                        onChange={(e) => setSchoolCity(e.target.value)}
                        required
                        className="w-full px-3 py-2 rounded-md bg-gray-700 text-white border border-gray-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label 
                      htmlFor="schoolPhone" 
                      className="block text-sm font-medium text-white/70 mb-2"
                    >
                      Téléphone
                    </label>
                    <input
                      id="schoolPhone"
                      type="tel"
                      value={schoolPhone}
                      onChange={(e) => setSchoolPhone(e.target.value)}
                      className="w-full px-3 py-2 rounded-md bg-gray-700 text-white border border-gray-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                  
                  <div>
                    <label 
                      htmlFor="schoolEmail" 
                      className="block text-sm font-medium text-white/70 mb-2"
                    >
                      Email de l'école
                    </label>
                    <input
                      id="schoolEmail"
                      type="email"
                      value={schoolEmail}
                      onChange={(e) => setSchoolEmail(e.target.value)}
                      className="w-full px-3 py-2 rounded-md bg-gray-700 text-white border border-gray-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                  
                  <div className="flex space-x-4 mt-6">
                    <button 
                      type="button" 
                      onClick={handlePreviousStep}
                      className="w-1/2 px-3 py-2 rounded-md bg-gray-700 text-white border border-gray-600 focus:ring-1 focus:ring-blue-500"
                    >
                      Retour
                    </button>
                    
                    <button 
                      type="submit"
                      disabled={loading}
                      className="w-1/2 px-3 py-2 rounded-md bg-blue-500 text-white hover:bg-blue-600 focus:ring-1 focus:ring-blue-500 disabled:opacity-50"
                    >
                      {loading ? 'Chargement...' : 'Créer un compte'}
                    </button>
                  </div>
                </form>
              )}
              
              {/* Formulaire Enseignant */}
              {role === 'teacher' && (
                <form onSubmit={handleSignUp} className="space-y-4">
                  <div>
                    <label 
                      htmlFor="invitationCode" 
                      className="block text-sm font-medium text-white/70 mb-2"
                    >
                      Code d'invitation de l'école *
                    </label>
                    <input
                      id="invitationCode"
                      type="text"
                      value={invitationCode}
                      onChange={(e) => setInvitationCode(e.target.value)}
                      required
                      className="w-full px-3 py-2 rounded-md bg-gray-700 text-white border border-gray-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    />
                    <p className="text-xs text-gray-400 mt-1">Ce code vous a été fourni par l'administrateur de votre école</p>
                  </div>
                  
                  <div className="p-4 bg-blue-500/10 border border-blue-500/30 rounded-md">
                    <p className="text-sm text-blue-300">
                      <strong>Note :</strong> Le niveau de classe que vous enseignez sont définis par l'administrateur de votre école lors de votre affectation aux classes.
                    </p>
                  </div>
                  
                  <div className="flex space-x-4 mt-6">
                    <button 
                      type="button" 
                      onClick={handlePreviousStep}
                      className="w-1/2 px-3 py-2 rounded-md bg-gray-700 text-white border border-gray-600 focus:ring-1 focus:ring-blue-500"
                    >
                      Retour
                    </button>
                    
                    <button 
                      type="submit"
                      disabled={loading}
                      className="w-1/2 px-3 py-2 rounded-md bg-blue-500 text-white hover:bg-blue-600 focus:ring-1 focus:ring-blue-500 disabled:opacity-50"
                    >
                      {loading ? 'Chargement...' : 'Créer un compte'}
                    </button>
                  </div>
                </form>
              )}
              
              {/* Formulaire Parent */}
              {role === 'parent' && (
                <form onSubmit={handleSignUp} className="space-y-4">
                  <div>
                    <label 
                      htmlFor="pinCode" 
                      className="block text-sm font-medium text-white/70 mb-2"
                    >
                      Code PIN à 4 chiffres *
                    </label>
                    <input
                      id="pinCode"
                      type="text"
                      inputMode="numeric"
                      pattern="[0-9]{4}"
                      maxLength={4}
                      value={pinCode}
                      onChange={(e) => setPinCode(e.target.value)}
                      required
                      className="w-full px-3 py-2 rounded-md bg-gray-700 text-white border border-gray-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    />
                    <p className="text-xs text-gray-400 mt-1">Ce code vous permettra de vous connecter rapidement</p>
                  </div>
                  
                  <div>
                    <label 
                      htmlFor="parentInvitationCode" 
                      className="block text-sm font-medium text-white/70 mb-2"
                    >
                      Code de classe *
                    </label>
                    <input
                      id="parentInvitationCode"
                      type="text"
                      value={invitationCode}
                      onChange={(e) => setInvitationCode(e.target.value)}
                      required
                      className="w-full px-3 py-2 rounded-md bg-gray-700 text-white border border-gray-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    />
                    <p className="text-xs text-gray-400 mt-1">Ce code vous a été fourni par l'enseignant ou l'administrateur</p>
                  </div>
                  
                  <div>
                    <label 
                      htmlFor="childFirstName" 
                      className="block text-sm font-medium text-white/70 mb-2"
                    >
                      Prénom de l'enfant *
                    </label>
                    <input
                      id="childFirstName"
                      type="text"
                      value={childFirstName}
                      onChange={(e) => setChildFirstName(e.target.value)}
                      required
                      className="w-full px-3 py-2 rounded-md bg-gray-700 text-white border border-gray-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    />
                    <p className="text-xs text-gray-400 mt-1">Vous pourrez ajouter d'autres enfants après l'inscription</p>
                  </div>
                  
                  <div className="flex space-x-4 mt-6">
                    <button 
                      type="button" 
                      onClick={handlePreviousStep}
                      className="w-1/2 px-3 py-2 rounded-md bg-gray-700 text-white border border-gray-600 focus:ring-1 focus:ring-blue-500"
                    >
                      Retour
                    </button>
                    
                    <button 
                      type="submit"
                      disabled={loading}
                      className="w-1/2 px-3 py-2 rounded-md bg-blue-500 text-white hover:bg-blue-600 focus:ring-1 focus:ring-blue-500 disabled:opacity-50"
                    >
                      {loading ? 'Chargement...' : 'Créer un compte'}
                    </button>
                  </div>
                </form>
              )}

              {error && (
                <div className="p-3 rounded bg-red-500/20 border border-red-500 text-red-200">
                  {error}
                </div>
              )}
            </div>
          )}
        </div>

        <div className="text-center text-sm text-gray-400">
          <p>
            Déjà inscrit ?{' '}
            <Link href="/auth" className="text-blue-400 hover:text-blue-300">
              Connectez-vous
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
