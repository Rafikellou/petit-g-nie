'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@/hooks/useUser';
import { useSchools } from '@/hooks/useSchools';
import { supabase } from '@/lib/supabase';

const CLASS_OPTIONS = ['CP', 'CE1', 'CE2', 'CM1', 'CM2'];

export default function SetupPage() {
  const router = useRouter();
  const { user } = useUser();
  const { schools, loading: schoolsLoading, error: schoolsError } = useSchools();
  
  const [selectedSchool, setSelectedSchool] = useState('');
  const [childName, setChildName] = useState('');
  const [childClass, setChildClass] = useState('');
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!user) {
      router.push('/auth');
    }
  }, [user, router]);

  // Validation du PIN
  const validatePin = (value: string) => {
    const pinRegex = /^[0-9]{0,4}$/;
    if (pinRegex.test(value)) {
      setPin(value);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setSaving(true);
      console.log('Début de la sauvegarde avec les données:', {
        ecole_id: selectedSchool,
        surname_child: childName,
        class: childClass,
        pin
      });

      // Mettre à jour les détails de l'utilisateur
      const { error: detailsError } = await supabase
        .from('user_details')
        .upsert({
          user_id: user!.id,
          ecole_id: selectedSchool,
          surname_child: childName,
          class: childClass,
          pin,
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'user_id'
        });

      if (detailsError) throw detailsError;

      // Mettre à jour les métadonnées de l'utilisateur
      const { error: metadataError } = await supabase.auth.updateUser({
        data: {
          ecole_id: selectedSchool
        }
      });

      if (metadataError) throw metadataError;

      router.push('/');
    } catch (error: any) {
      console.error('Error in setup:', error);
      setError('Une erreur est survenue lors de la sauvegarde');
    } finally {
      setSaving(false);
    }
  };

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Configuration de votre compte</h1>
        
        <form onSubmit={handleSubmit} className="max-w-md space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2">
              École
            </label>
            {schoolsLoading ? (
              <div>Chargement des écoles...</div>
            ) : schoolsError ? (
              <div className="text-red-500">Erreur: {schoolsError}</div>
            ) : (
              <select
                value={selectedSchool}
                onChange={(e) => setSelectedSchool(e.target.value)}
                className="w-full px-3 py-2 rounded-md bg-gray-700 text-white border border-gray-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                required
              >
                <option value="">Sélectionnez une école</option>
                {schools.map((school) => (
                  <option key={school.id} value={school.id}>
                    {school.nom_ecole}
                  </option>
                ))}
              </select>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Prénom de l'enfant
            </label>
            <input
              type="text"
              value={childName}
              onChange={(e) => setChildName(e.target.value)}
              className="w-full px-3 py-2 rounded-md bg-gray-700 text-white border border-gray-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Classe
            </label>
            <select
              value={childClass}
              onChange={(e) => setChildClass(e.target.value)}
              className="w-full px-3 py-2 rounded-md bg-gray-700 text-white border border-gray-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              required
            >
              <option value="">Sélectionnez une classe</option>
              {CLASS_OPTIONS.map((classOption) => (
                <option key={classOption} value={classOption}>
                  {classOption}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Code PIN (4 chiffres)
            </label>
            <input
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              maxLength={4}
              value={pin}
              onChange={(e) => validatePin(e.target.value)}
              className="w-full px-3 py-2 rounded-md bg-gray-700 text-white border border-gray-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              required
              placeholder="Entrez un code à 4 chiffres"
            />
            <p className="mt-1 text-sm text-gray-400">
              Ce code sera utilisé pour accéder à l'espace parent
            </p>
          </div>

          {error && (
            <div className="text-red-500 text-sm">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={saving}
            className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 rounded-md font-medium disabled:opacity-50"
          >
            {saving ? 'Enregistrement...' : 'Enregistrer'}
          </button>
        </form>
      </div>
    </div>
  );
}
