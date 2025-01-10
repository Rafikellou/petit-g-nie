import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/ios-button'
import { Loader2 } from 'lucide-react'
import { Profile } from '@/types/auth'
import { authService } from '@/lib/auth'

interface ProfileSelectorProps {
  userId: string
  profiles: Profile[]
}

export default function ProfileSelector({ userId, profiles }: ProfileSelectorProps) {
  const [selectedProfile, setSelectedProfile] = useState<string>()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const handleProfileSelect = async () => {
    if (!selectedProfile) return

    try {
      setLoading(true)
      setError(null)

      const { error } = await authService.setActiveProfile(userId, selectedProfile)
      if (error) throw new Error(error)

      // Rediriger vers la bonne page en fonction du rôle
      const profile = profiles.find(p => p.id === selectedProfile)
      switch (profile?.role) {
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
    } catch (error: any) {
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-white text-center">
        Sélectionnez votre profil
      </h2>

      <div className="grid gap-4">
        {profiles.map((profile) => (
          <button
            key={profile.id}
            onClick={() => setSelectedProfile(profile.id)}
            className={`p-4 rounded-lg transition-colors ${
              selectedProfile === profile.id
                ? 'bg-primary text-white'
                : 'bg-white/10 text-white/70 hover:text-white hover:bg-white/20'
            }`}
          >
            <div className="font-medium">
              {profile.family_name} {profile.surname}
            </div>
            <div className="text-sm opacity-70">
              {profile.role === 'super_admin' && 'Super Administrateur'}
              {profile.role === 'admin' && 'Administrateur'}
              {profile.role === 'teacher' && 'Enseignant'}
              {profile.role === 'parent' && 'Parent'}
            </div>
          </button>
        ))}
      </div>

      {error && (
        <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
          <p className="text-sm text-red-500">{error}</p>
        </div>
      )}

      <Button
        onClick={handleProfileSelect}
        disabled={!selectedProfile || loading}
        className="w-full flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 text-white font-medium py-3 rounded-lg transition-colors"
      >
        {loading ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            Chargement...
          </>
        ) : (
          'Continuer'
        )}
      </Button>
    </div>
  )
}
