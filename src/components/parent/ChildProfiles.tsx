'use client'

import { Pencil, Trash2, UserPlus } from 'lucide-react'

interface ChildProfile {
  id: string
  name: string
  class_level: string
  gender: 'Garçon' | 'Fille'
}

interface ChildProfilesProps {
  profiles: ChildProfile[]
  onAddProfile: () => void
  onEditProfile: (id: string) => void
  onDeleteProfile: (id: string) => void
}

export default function ChildProfiles({
  profiles,
  onAddProfile,
  onEditProfile,
  onDeleteProfile
}: ChildProfilesProps) {
  return (
    <div className="mt-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gradient">Profils enfants</h2>
        <button
          onClick={onAddProfile}
          className="btn-modern"
        >
          <span className="relative z-10 flex items-center gap-2">
            <UserPlus className="w-4 h-4" />
            Ajouter un profil
          </span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {profiles.map((profile) => (
          <div
            key={profile.id}
            className="glass-card p-6 hover:scale-[1.02]"
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-semibold">{profile.name}</h3>
                <p className="text-sm text-white/60">Classe : {profile.class_level}</p>
                <p className="text-sm text-white/60">Genre : {profile.gender}</p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => onEditProfile(profile.id)}
                  className="icon-container hover:text-[var(--primary)]"
                >
                  <Pencil className="w-4 h-4" />
                </button>
                <button
                  onClick={() => onDeleteProfile(profile.id)}
                  className="icon-container hover:text-[var(--accent)]"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
