import { Dialog } from '@headlessui/react'
import { X, User2 } from 'lucide-react'
import { useState, useEffect } from 'react'

interface ChildProfile {
  id?: string
  name: string
  class: string
  gender: 'Garçon' | 'Fille'
  age: number
}

interface EditChildProfileProps {
  isOpen: boolean
  onClose: () => void
  onSave: (profile: ChildProfile) => void
  profile?: ChildProfile
}

export default function EditChildProfile({
  isOpen,
  onClose,
  onSave,
  profile
}: EditChildProfileProps) {
  const [formData, setFormData] = useState<ChildProfile>({
    name: '',
    class: '',
    gender: 'Garçon',
    age: 6
  })

  useEffect(() => {
    if (profile) {
      setFormData(profile)
    }
  }, [profile])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave(formData)
    onClose()
  }

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      className="relative z-50"
    >
      <div className="fixed inset-0 bg-black/70 backdrop-blur-sm" aria-hidden="true" />

      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="relative overflow-hidden rounded-2xl bg-[var(--background-dark)] border border-[var(--card-border)] w-full max-w-lg">
          {/* Header */}
          <div className="relative p-6 border-b border-[var(--card-border)]">
            <Dialog.Title className="text-2xl font-bold text-gradient">
              {profile ? 'Modifier le profil' : 'Ajouter un enfant'}
            </Dialog.Title>
            <button
              onClick={onClose}
              className="absolute right-6 top-6 icon-container hover:text-[var(--primary)]"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            <div className="flex justify-center">
              <div className="icon-container w-20 h-20">
                <User2 className="w-10 h-10 text-[var(--primary)]" />
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-white/80 mb-2">
                  Nom
                </label>
                <input
                  type="text"
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="input-modern"
                  placeholder="Entrez le nom de l'enfant"
                  required
                />
              </div>

              <div>
                <label htmlFor="age" className="block text-sm font-medium text-white/80 mb-2">
                  Âge
                </label>
                <input
                  type="number"
                  id="age"
                  min="3"
                  max="18"
                  value={formData.age}
                  onChange={(e) => setFormData({ ...formData, age: parseInt(e.target.value) })}
                  className="input-modern"
                  required
                />
              </div>

              <div>
                <label htmlFor="class" className="block text-sm font-medium text-white/80 mb-2">
                  Classe
                </label>
                <select
                  id="class"
                  value={formData.class}
                  onChange={(e) => setFormData({ ...formData, class: e.target.value })}
                  className="input-modern"
                  required
                >
                  <option value="">Sélectionnez une classe</option>
                  <option value="CP">CP</option>
                  <option value="CE1">CE1</option>
                  <option value="CE2">CE2</option>
                  <option value="CM1">CM1</option>
                  <option value="CM2">CM2</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-white/80 mb-2">
                  Genre
                </label>
                <div className="grid grid-cols-2 gap-4">
                  {['Garçon', 'Fille'].map((gender) => (
                    <button
                      key={gender}
                      type="button"
                      onClick={() => setFormData({ ...formData, gender: gender as 'Garçon' | 'Fille' })}
                      className={`p-3 rounded-xl border transition-all duration-300 ${
                        formData.gender === gender
                          ? 'border-[var(--primary)] bg-[var(--primary)]/10 text-white'
                          : 'border-[var(--card-border)] text-white/60 hover:border-[var(--primary)]/50'
                      }`}
                    >
                      {gender}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-2 rounded-xl border border-[var(--card-border)] text-white/60 hover:text-white hover:border-white/30 transition-colors"
              >
                Annuler
              </button>
              <button
                type="submit"
                className="flex-1 btn-modern"
              >
                <span className="relative z-10">
                  {profile ? 'Enregistrer' : 'Ajouter'}
                </span>
              </button>
            </div>
          </form>
        </Dialog.Panel>
      </div>
    </Dialog>
  )
}
