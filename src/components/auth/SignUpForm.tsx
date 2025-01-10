import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/ios-button'
import { Loader2 } from 'lucide-react'
import { authService } from '@/lib/auth'
import { UserRole } from '@/types/auth'

export default function SignUpForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [familyName, setFamilyName] = useState('')
  const [surname, setSurname] = useState('')
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
        family_name: familyName,
        surname: surname,
        role: 'parent', // Par défaut, seuls les parents peuvent s'inscrire directement
        invitation_code: invitationCode
      })

      if (error) {
        setError(error)
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
            htmlFor="familyName" 
            className="block text-sm font-medium text-white mb-2"
          >
            Nom
          </label>
          <input
            id="familyName"
            type="text"
            value={familyName}
            onChange={(e) => setFamilyName(e.target.value)}
            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            required
          />
        </div>

        <div>
          <label 
            htmlFor="surname" 
            className="block text-sm font-medium text-white mb-2"
          >
            Prénom
          </label>
          <input
            id="surname"
            type="text"
            value={surname}
            onChange={(e) => setSurname(e.target.value)}
            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            required
          />
        </div>

        <div>
          <label 
            htmlFor="email" 
            className="block text-sm font-medium text-white mb-2"
          >
            Email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            placeholder="votre@email.com"
            required
          />
        </div>

        <div>
          <label 
            htmlFor="password" 
            className="block text-sm font-medium text-white mb-2"
          >
            Mot de passe
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            placeholder="••••••••"
            required
          />
        </div>

        <div>
          <label 
            htmlFor="invitationCode" 
            className="block text-sm font-medium text-white mb-2"
          >
            Code d'invitation (optionnel)
          </label>
          <input
            id="invitationCode"
            type="text"
            value={invitationCode}
            onChange={(e) => setInvitationCode(e.target.value)}
            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            placeholder="Pour les enseignants uniquement"
          />
        </div>

        {error && (
          <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
            <p className="text-sm text-red-500">{error}</p>
          </div>
        )}

        <Button
          type="submit"
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 text-white font-medium py-3 rounded-lg transition-colors"
        >
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Inscription en cours...
            </>
          ) : (
            "S'inscrire"
          )}
        </Button>
      </form>
    </div>
  )
}
