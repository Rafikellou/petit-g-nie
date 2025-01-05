'use client';

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
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
            <CardHeader>
              <div className="flex items-center gap-3">
                <User className="w-5 h-5 text-turquoise-500" />
                <CardTitle>Profil de {child.firstName}</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">
                      Prénom
                    </label>
                    <Input
                      type="text"
                      value={child.firstName}
                      className="w-full"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">
                      Nom
                    </label>
                    <Input
                      type="text"
                      value={child.lastName}
                      className="w-full"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">
                    Classe
                  </label>
                  <div className="flex gap-2">
                    <select
                      value={child.class}
                      onChange={(e) => handleClassChange(child.id, e.target.value)}
                      className="flex-1 rounded-md bg-gray-900 border border-gray-800 px-3 py-2 text-sm"
                    >
                      <option value="CP">CP</option>
                      <option value="CE1">CE1</option>
                      <option value="CE2">CE2</option>
                      <option value="CM1">CM1</option>
                      <option value="CM2">CM2</option>
                    </select>
                    <Button variant="outline" size="icon">
                      <School className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button variant="destructive" size="sm">
                    <UserX className="w-4 h-4 mr-2" />
                    Fermer le profil
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {/* Ajouter un profil */}
        <Button className="w-full">
          <UserPlus className="w-4 h-4 mr-2" />
          Ajouter un profil
        </Button>
      </div>

      {/* Modal de confirmation */}
      {showConfirmation && selectedChild && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
          <Card className="w-full max-w-md mx-4">
            <CardHeader>
              <CardTitle>Confirmer le changement de classe</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-400">
                Êtes-vous sûr de vouloir changer la classe de {selectedChild.firstName} ?
              </p>
              <div className="flex justify-end gap-2 mt-4">
                <Button
                  variant="outline"
                  onClick={() => setShowConfirmation(false)}
                >
                  Annuler
                </Button>
                <Button onClick={() => setShowConfirmation(false)}>
                  Confirmer
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
