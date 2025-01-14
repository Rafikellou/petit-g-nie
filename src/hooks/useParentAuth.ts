'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { usePinVerification } from '@/contexts/PinVerificationContext';

export function useParentAuth() {
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { isPinVerified, verifyPin, resetPinVerification } = usePinVerification();

  useEffect(() => {
    const checkParentAuth = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          router.push('/auth');
          return;
        }

        // Vérifier si l'utilisateur a un PIN dans user_details
        const { data: userDetails, error } = await supabase
          .from('user_details')
          .select('pin')
          .eq('user_id', user.id)
          .single();

        if (error || !userDetails?.pin) {
          router.push('/setup');
          return;
        }

        // Ne pas réinitialiser isPinVerified ici
      } catch (error) {
        console.error('Erreur lors de la vérification de l\'authentification parent:', error);
      } finally {
        setLoading(false);
      }
    };

    checkParentAuth();
  }, [router]);

  return {
    isVerified: isPinVerified,
    setIsVerified: verifyPin,
    resetVerification: resetPinVerification,
    loading
  };
}
