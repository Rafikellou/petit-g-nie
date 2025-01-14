'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';

export default function ResetPinPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const updatePin = async () => {
      try {
        const newPin = searchParams.get('pin');
        if (!newPin) {
          setError('PIN non trouvé dans l\'URL');
          return;
        }

        // Mettre à jour le PIN dans user_details
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          setError('Utilisateur non connecté');
          return;
        }

        const { error: updateError } = await supabase
          .from('user_details')
          .update({ pin: newPin })
          .eq('user_id', user.id);

        if (updateError) throw updateError;

        setSuccess(true);
        setTimeout(() => {
          router.push('/');
        }, 3000);
      } catch (error: any) {
        console.error('Erreur lors de la mise à jour du PIN:', error);
        setError('Une erreur est survenue lors de la mise à jour du PIN');
      }
    };

    updatePin();
  }, [searchParams, router]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 flex items-center justify-center p-4">
      <div className="bg-gray-800 rounded-lg p-6 max-w-md w-full text-center">
        {error ? (
          <>
            <h1 className="text-xl font-bold text-white mb-4">Erreur</h1>
            <p className="text-red-500">{error}</p>
          </>
        ) : success ? (
          <>
            <h1 className="text-xl font-bold text-white mb-4">PIN mis à jour avec succès</h1>
            <p className="text-gray-300">
              Vous allez être redirigé vers la page d'accueil dans quelques secondes...
            </p>
          </>
        ) : (
          <>
            <h1 className="text-xl font-bold text-white mb-4">Mise à jour du PIN</h1>
            <p className="text-gray-300">Veuillez patienter pendant la mise à jour de votre PIN...</p>
          </>
        )}
      </div>
    </div>
  );
}
