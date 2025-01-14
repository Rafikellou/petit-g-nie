import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/ios-button'
import { Loader2 } from 'lucide-react'
import { authService } from '@/lib/auth'
import { UserRole } from '@/types/auth'
import { supabase } from '@/lib/supabase'

export default function SignUpForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [invitationCode, setInvitationCode] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      setLoading(true)
      setError(null)

      const { user, error } = await authService.signUp({
        email,
        password,
        role: 'parent', // Par défaut, seuls les parents peuvent s'inscrire directement
        invitation_code: invitationCode
      })

      if (error) {
        setError(error)
        return
      }

      // Créer l'entrée dans user_details
      if (user) {
        const { error: detailsError } = await supabase
          .from('user_details')
          .insert({
            user_id: user.id,
            surname_child: name
          })

        if (detailsError) {
          setError(detailsError.message)
          return
        }
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
            htmlFor="name" 
            className="block text-sm font-medium text-white/70 mb-2"
          >
            Nom de l'enfant
          </label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
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
          disabled={loading}
          className="w-full"
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
      </form>

      {error && (
        <div className="p-3 rounded bg-red-500/20 border border-red-500 text-red-200">
          {error}
        </div>
      )}
    </div>
  )
}
