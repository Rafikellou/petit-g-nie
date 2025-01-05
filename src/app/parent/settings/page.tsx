'use client';

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { UserPlus, School, UserX, User } from 'lucide-react';
import { useState } from 'react';

interface ChildProfile {
  id: string;
  firstName: string;
  lastName: string;
  class: string;
}

export default function SettingsPage() {
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [selectedChild, setSelectedChild] = useState<ChildProfile | null>(null);

  // Simuler des données d'enfants
  const [children, setChildren] = useState<ChildProfile[]>([
    { id: '1', firstName: 'Emma', lastName: 'Dupont', class: 'CE2' }
  ]);

  const handleClassChange = (childId: string, newClass: string) => {
    setSelectedChild(children.find(child => child.id === childId) || null);
    setShowConfirmation(true);
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">
          Paramètres
        </h1>
        <p className="text-gray-400">
          Gérez les profils et les paramètres des enfants
        </p>
      </div>

      <div className="space-y-6">
        {/* Profils des enfants */}
        {children.map(child => (
          <Card key={child.id}>
            <Card.Header>
              <div className="flex items-center gap-3">
                <User className="w-5 h-5 text-turquoise-500" />
                <Card.Title>Profil de {child.firstName}</Card.Title>
              </div>
            </Card.Header>
            <Card.Content>
              <div className="grid gap-6">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="text-sm font-medium mb-1.5 block">
                      Prénom
                    </label>
                    <Input
                      defaultValue={child.firstName}
                      className="bg-gray-900"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-1.5 block">
                      Nom
                    </label>
                    <Input
                      defaultValue={child.lastName}
                      className="bg-gray-900"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium mb-1.5 block">
                    Classe
                  </label>
                  <select
                    value={child.class}
                    onChange={(e) => handleClassChange(child.id, e.target.value)}
                    className="w-full px-3 py-2 bg-gray-900 border border-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-turquoise-500"
                  >
                    <option value="CP">CP</option>
                    <option value="CE1">CE1</option>
                    <option value="CE2">CE2</option>
                    <option value="CM1">CM1</option>
                    <option value="CM2">CM2</option>
                  </select>
                </div>

                <div className="flex justify-end">
                  <Button
                    variant="destructive"
                    onClick={() => setShowConfirmation(true)}
                    className="flex items-center gap-2"
                  >
                    <UserX className="w-4 h-4" />
                    Fermer le profil
                  </Button>
                </div>
              </div>
            </Card.Content>
          </Card>
        ))}

        {/* Ajouter un enfant */}
        <Card>
          <Card.Header>
            <div className="flex items-center gap-3">
              <UserPlus className="w-5 h-5 text-turquoise-500" />
              <Card.Title>Ajouter un enfant</Card.Title>
            </div>
          </Card.Header>
          <Card.Content>
            <Button className="w-full flex items-center justify-center gap-2">
              <UserPlus className="w-4 h-4" />
              Ajouter un nouveau profil
            </Button>
          </Card.Content>
        </Card>
      </div>

      {/* Modal de confirmation */}
      {showConfirmation && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-gray-900 p-6 rounded-xl w-full max-w-sm mx-4">
            <h3 className="text-xl font-semibold mb-4">
              Confirmer le changement
            </h3>
            <p className="text-gray-400 mb-6">
              {selectedChild 
                ? `Êtes-vous sûr de vouloir changer la classe de ${selectedChild.firstName} ? Cela modifiera son affectation et son niveau académique.`
                : 'Êtes-vous sûr de vouloir fermer ce profil ? Cette action est irréversible.'}
            </p>
            <div className="flex justify-end gap-4">
              <Button
                variant="ghost"
                onClick={() => setShowConfirmation(false)}
              >
                Annuler
              </Button>
              <Button
                variant="destructive"
                onClick={() => {
                  // Logique de confirmation
                  setShowConfirmation(false);
                }}
              >
                Confirmer
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
