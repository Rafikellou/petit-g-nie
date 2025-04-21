import { Dialog } from '@headlessui/react'
import { X, User2 } from 'lucide-react'
import { useState, useEffect } from 'react'

interface ChildProfile {
  id?: string
  name: string
  class_level?: string // Marqué comme optionnel pour la migration
  class_id?: string // Nouvel identifiant de classe
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
    class_level: '', // Pour la compatibilité
    class_id: '', // Nouvel identifiant
    gender: 'Garçon',
    age: 6
  })

  useEffect(() => {
    if (profile) {
      setFormData(profile)
    }
  }, [profile])

  // État pour stocker les classes disponibles
  const [availableClasses, setAvailableClasses] = useState<Array<{ id: string, name: string, class_level: string }>>([]);
  
  // Charger les classes disponibles
  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const { data, error } = await fetch('/api/classes').then(res => res.json());
        
        if (error) throw error;
        
        if (data) {
          setAvailableClasses(data);
        }
      } catch (error) {
        console.error('Erreur lors du chargement des classes:', error);
      }
    };
    
    fetchClasses();
  }, []);

  // Mettre à jour class_id lorsque class_level change (pour la compatibilité)
  useEffect(() => {
    if (formData.class_level && availableClasses.length > 0) {
      const matchingClass = availableClasses.find(c => c.class_level === formData.class_level);
      if (matchingClass) {
        setFormData(prev => ({ ...prev, class_id: matchingClass.id }));
      }
    }
  }, [formData.class_level, availableClasses]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // S'assurer que class_id est défini si class_level est fourni
    if (formData.class_level && !formData.class_id && availableClasses.length > 0) {
      const matchingClass = availableClasses.find(c => c.class_level === formData.class_level);
      if (matchingClass) {
        const updatedFormData = { ...formData, class_id: matchingClass.id };
        onSave(updatedFormData);
        onClose();
        return;
      }
    }
    
    onSave(formData);
    onClose();
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
                <label htmlFor="class_display" className="block text-sm font-medium text-white/80 mb-2">
                  Classe
                </label>
                <div className="input-modern bg-opacity-50 py-2 px-3 flex items-center">
                  {formData.class_id ? (
                    <>
                      {availableClasses.find(c => c.id === formData.class_id)?.name || 'Classe inconnue'} 
                      ({availableClasses.find(c => c.id === formData.class_id)?.class_level || ''})
                    </>
                  ) : (
                    <span className="text-white/50">Aucune classe assignée</span>
                  )}
                </div>
                <p className="text-xs text-white/50 mt-1">
                  La classe est assignée par l'établissement et ne peut pas être modifiée ici.
                </p>
                
                {/* Champs cachés pour conserver les valeurs */}
                <input 
                  type="hidden" 
                  id="class_id" 
                  value={formData.class_id || ''} 
                />
                <input 
                  type="hidden" 
                  id="class_level" 
                  value={formData.class_level || ''} 
                />
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
