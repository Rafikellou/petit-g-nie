'use client';

import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/ios-button';
import { useState } from 'react';

export default function SettingsPage() {
  const [firstName, setFirstName] = useState('Jean');
  const [lastName, setLastName] = useState('Dupont');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement save functionality
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">
          Paramètres
        </h1>
        <p className="text-gray-400">
          Gérez vos informations personnelles
        </p>
      </div>

      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-6">Informations personnelles</h2>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="firstName" className="block text-sm font-medium text-gray-400 mb-2">
              Prénom
            </label>
            <Input
              id="firstName"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="max-w-md"
            />
          </div>

          <div>
            <label htmlFor="lastName" className="block text-sm font-medium text-gray-400 mb-2">
              Nom
            </label>
            <Input
              id="lastName"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="max-w-md"
            />
          </div>

          <Button type="submit">
            Enregistrer les modifications
          </Button>
        </form>
      </Card>
    </div>
  );
}
