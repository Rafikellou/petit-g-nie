'use client'

import { Dialog } from '@headlessui/react'
import { X, User, Mail, Key, Eye, EyeOff } from 'lucide-react'
import { useState } from 'react'

interface UserProfile {
  name: string
  email: string
  pin: string
}

interface EditUserProfileProps {
  isOpen: boolean
  onClose: () => void
  onSave: (profile: UserProfile) => void
  profile: UserProfile
}

export default function EditUserProfile({
  isOpen,
  onClose,
  onSave,
  profile
}: EditUserProfileProps) {
  const [formData, setFormData] = useState(profile)
  const [showPin, setShowPin] = useState(false)
  const [errors, setErrors] = useState({
    name: '',
    email: '',
    pin: ''
  })

  const validateForm = () => {
    const newErrors = {
      name: '',
      email: '',
      pin: ''
    }

    if (!formData.name.trim()) {
      newErrors.name = 'Le nom est requis'
    }

    if (!formData.email.trim()) {
      newErrors.email = 'L\'email est requis'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'L\'email n\'est pas valide'
    }

    if (!formData.pin.trim()) {
      newErrors.pin = 'Le PIN est requis'
    } else if (!/^\d{4}$/.test(formData.pin)) {
      newErrors.pin = 'Le PIN doit contenir 4 chiffres'
    }

    setErrors(newErrors)
    return !Object.values(newErrors).some(error => error)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (validateForm()) {
      onSave(formData)
      onClose()
    }
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
              Modifier le profil
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
                <User className="w-10 h-10 text-[var(--primary)]" />
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-white/80 mb-2">
                  Nom complet
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="w-5 h-5 text-white/40" />
                  </div>
                  <input
                    type="text"
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="input-modern pl-10"
                    placeholder="Entrez votre nom"
                  />
                </div>
                {errors.name && (
                  <p className="mt-1 text-sm text-[var(--accent)]">{errors.name}</p>
                )}
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-white/80 mb-2">
                  Email
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="w-5 h-5 text-white/40" />
                  </div>
                  <input
                    type="email"
                    id="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="input-modern pl-10"
                    placeholder="votre@email.com"
                  />
                </div>
                {errors.email && (
                  <p className="mt-1 text-sm text-[var(--accent)]">{errors.email}</p>
                )}
              </div>

              <div>
                <label htmlFor="pin" className="block text-sm font-medium text-white/80 mb-2">
                  PIN de sécurité
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Key className="w-5 h-5 text-white/40" />
                  </div>
                  <input
                    type={showPin ? 'text' : 'password'}
                    id="pin"
                    value={formData.pin}
                    onChange={(e) => setFormData({ ...formData, pin: e.target.value })}
                    className="input-modern pl-10 pr-10"
                    placeholder="****"
                    maxLength={4}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPin(!showPin)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    {showPin ? (
                      <EyeOff className="w-5 h-5 text-white/40 hover:text-white/60" />
                    ) : (
                      <Eye className="w-5 h-5 text-white/40 hover:text-white/60" />
                    )}
                  </button>
                </div>
                {errors.pin && (
                  <p className="mt-1 text-sm text-[var(--accent)]">{errors.pin}</p>
                )}
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
                <span className="relative z-10">Enregistrer</span>
              </button>
            </div>
          </form>
        </Dialog.Panel>
      </div>
    </Dialog>
  )
}
