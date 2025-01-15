import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { authService } from '@/lib/auth'

export default function SignInForm() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [resetSent, setResetSent] = useState(false)

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      setLoading(true)
      setError('')

      if (!email || !password) {
        setError('Veuillez remplir tous les champs')
        return
      }

      const { user, error } = await authService.signIn(email, password)

      if (error) {
        let errorMessage = 'Email ou mot de passe incorrect'
        setError(errorMessage)
        return
      }

      if (!user) {
        setError('Une erreur est survenue lors de la connexion')
        return
      }

      // Rediriger vers la homepage par défaut
      router.push('/')

    } catch (error: any) {
      console.error('Error in handleSignIn:', error)
      setError('Une erreur est survenue lors de la connexion')
    } finally {
      setLoading(false)
    }
  }

  const handleResetPassword = async () => {
    if (!email) {
      setError('Veuillez entrer votre adresse email')
      return
    }
    
    setLoading(true)
    const { error } = await authService.resetPassword(email)
    setLoading(false)
    
    if (error) {
      setError('Erreur lors de l\'envoi du lien de réinitialisation')
      return
    }
    
    setResetSent(true)
    // toast.success('Un email de réinitialisation vous a été envoyé')
  }

  return (
    <div className="max-w-md w-full space-y-8">
      <div>
        <h3 className="text-xl font-medium text-white">
          Connectez-vous à votre compte
        </h3>
        <p className="text-sm text-white/70">
          Entrez vos identifiants pour accéder à votre compte
        </p>
      </div>
      <form onSubmit={handleSignIn} className="space-y-6">
        <div className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-white">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full rounded-md border border-white/10 bg-white/5 px-3 py-2 text-white placeholder-white/50 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              placeholder="vous@exemple.com"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-white">
              Mot de passe
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full rounded-md border border-white/10 bg-white/5 px-3 py-2 text-white placeholder-white/50 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              placeholder="Votre mot de passe"
            />
          </div>
        </div>

        {error && (
          <div className="text-sm text-red-500">
            {error}
          </div>
        )}

        {resetSent && (
          <div className="text-sm text-green-500">
            Un email de réinitialisation vous a été envoyé
          </div>
        )}

        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={handleResetPassword}
            className="text-sm text-indigo-400 hover:text-indigo-300 transition-colors"
          >
            Mot de passe oublié ?
          </button>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Connexion...' : 'Se connecter'}
        </button>
      </form>
    </div>
  )
}
