'use client'

import { Pencil } from 'lucide-react'

interface UserInfoProps {
  name: string
  email: string
  pin: string
  onEdit: () => void
}

export default function UserInfo({ name, email, pin, onEdit }: UserInfoProps) {
  return (
    <div className="glass-card p-6">
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-xl font-semibold text-gradient mb-4">Informations personnelles</h2>
          <div className="space-y-2">
            <p>
              <span className="text-white/60">Nom :</span> {name}
            </p>
            <p>
              <span className="text-white/60">Email :</span> {email}
            </p>
            <p>
              <span className="text-white/60">PIN :</span> {pin}
            </p>
          </div>
        </div>
        <button
          onClick={onEdit}
          className="icon-container hover:text-[var(--primary)]"
        >
          <Pencil className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}
