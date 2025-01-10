import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { authService } from '@/lib/auth'

export default function SignInForm() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      setLoading(true)
      setError('')

      if (!email || !password) {
        setError('Veuillez remplir tous les champs')
        setLoading(false)
        return
      }

      const { user, error } = await authService.signIn(email, password)

      if (error) {
        let errorMessage = 'Une erreur est survenue lors de la connexion'
        
        // Messages d'erreur personnalisés
        if (error.message?.includes('Invalid login credentials')) {
          errorMessage = 'Email ou mot de passe incorrect'
        } else if (error.message?.includes('Email not confirmed')) {
          errorMessage = 'Veuillez confirmer votre email avant de vous connecter'
        } else if (error.message?.includes('Profil utilisateur non trouvé')) {
          errorMessage = 'Votre profil n\'a pas été trouvé. Veuillez contacter le support.'
        }
        
        setError(errorMessage)
        setLoading(false)
        return
      }

      if (!user) {
        setError('Une erreur est survenue lors de la connexion')
        setLoading(false)
        return
      }

      // Si l'utilisateur a plusieurs profils, on le redirige vers le sélecteur
      if (user.profiles.length > 1) {
        router.push('/profile-selector')
      } else {
        // Rediriger vers la page appropriée selon le rôle
        const profile = user.profiles[0]
        if (profile) {
          switch (profile.role) {
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
      }
    } catch (err: any) {
      console.error('Erreur inattendue lors de la connexion:', err)
      setError('Une erreur inattendue est survenue. Veuillez réessayer.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-md w-full space-y-8">
      <div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Connectez-vous à votre compte
        </h2>
      </div>
      <form className="mt-8 space-y-6" onSubmit={handleSignIn}>
        <div className="rounded-md shadow-sm -space-y-px">
          <div>
            <label htmlFor="email" className="sr-only">
              Adresse email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
              placeholder="Adresse email"
            />
          </div>
          <div>
            <label htmlFor="password" className="sr-only">
              Mot de passe
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
              placeholder="Mot de passe"
            />
          </div>
        </div>

        {error && (
          <div className="text-red-500 text-sm text-center">{error}</div>
        )}

        <div>
          <button
            type="submit"
            disabled={loading}
            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
          >
            {loading ? 'Connexion...' : 'Se connecter'}
          </button>
        </div>
      </form>
    </div>
  )
}
