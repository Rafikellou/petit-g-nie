'use client';

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { School, User } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useUser } from '@/hooks/useUser';
import { supabase } from '@/lib/supabase';
import { Alert, AlertDescription } from '@/components/ui/alert';

const CLASS_OPTIONS = ['CP', 'CE1', 'CE2', 'CM1', 'CM2'];

export default function SettingsPage() {
  const { user } = useUser();
  const [childName, setChildName] = useState('');
  const [childClass, setChildClass] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (user) {
      loadUserDetails();
    }
  }, [user]);

  const loadUserDetails = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('user_details')
        .select('surname_child, class')
        .eq('user_id', user?.id)
        .single();

      if (error) throw error;

      if (data) {
        setChildName(data.surname_child || '');
        setChildClass(data.class || '');
      }
    } catch (error: any) {
      console.error('Erreur lors du chargement des détails:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!user) return;

    try {
      setSaving(true);
      const { error: updateError } = await supabase
        .from('user_details')
        .update({
          surname_child: childName,
          class: childClass,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', user.id);

      if (updateError) throw updateError;
    } catch (error: any) {
      console.error('Erreur lors de la sauvegarde:', error);
      setError(error.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="text-white">
        Chargement des paramètres...
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">
          Paramètres
        </h1>
        <p className="text-gray-400">
          Gérez le profil de votre enfant
        </p>
      </div>

      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <User className="w-5 h-5 text-turquoise-500" />
              <CardTitle>Profil de l'enfant</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">
                  Nom de l'enfant
                </label>
                <Input
                  type="text"
                  value={childName}
                  onChange={(e) => setChildName(e.target.value)}
                  className="w-full"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">
                  Classe
                </label>
                <div className="flex gap-2">
                  <select
                    value={childClass}
                    onChange={(e) => setChildClass(e.target.value)}
                    className="flex-1 rounded-md bg-gray-900 border border-gray-800 px-3 py-2 text-sm"
                  >
                    <option value="">Sélectionner une classe</option>
                    {CLASS_OPTIONS.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                  <Button variant="outline" size="icon">
                    <School className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <div className="flex justify-end pt-4">
                <Button 
                  onClick={handleSave}
                  disabled={saving}
                >
                  {saving ? 'Enregistrement...' : 'Enregistrer les modifications'}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
