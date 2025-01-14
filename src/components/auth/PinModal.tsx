'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { XIcon } from 'lucide-react';

interface PinModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  userEmail?: string;
}

export function PinModal({ isOpen, onClose, onSuccess, userEmail }: PinModalProps) {
  const [pin, setPin] = useState(['', '', '', '']);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showResetConfirmation, setShowResetConfirmation] = useState(false);

  const handlePinChange = (index: number, value: string) => {
    if (value.length > 1) return; // Empêcher plus d'un caractère
    if (!/^\d*$/.test(value)) return; // Seulement des chiffres

    const newPin = [...pin];
    newPin[index] = value;
    setPin(newPin);

    // Déplacer le focus vers le champ suivant
    if (value && index < 3) {
      const nextInput = document.getElementById(`pin-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !pin[index] && index > 0) {
      const prevInput = document.getElementById(`pin-${index - 1}`);
      prevInput?.focus();
    }
  };

  const verifyPin = async () => {
    setError('');
    setLoading(true);

    try {
      const enteredPin = pin.join('');
      
      // Vérifier le PIN dans la table user_details
      const { data, error } = await supabase
        .from('user_details')
        .select('pin')
        .eq('user_id', (await supabase.auth.getUser()).data.user?.id)
        .single();

      if (error) throw error;

      if (data?.pin === enteredPin) {
        onSuccess();
      } else {
        setError('Code PIN incorrect. Veuillez réessayer.');
        setPin(['', '', '', '']);
        document.getElementById('pin-0')?.focus();
      }
    } catch (error: any) {
      console.error('Erreur lors de la vérification du PIN:', error);
      setError('Une erreur est survenue. Veuillez réessayer.');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPin = async () => {
    if (!userEmail) {
      setError('Email non disponible. Veuillez vous reconnecter.');
      return;
    }

    try {
      setLoading(true);
      
      // Générer un nouveau PIN aléatoire
      const newPin = Math.floor(1000 + Math.random() * 9000).toString();
      
      // Envoyer l'email de réinitialisation via Supabase
      const { error } = await supabase.auth.resetPasswordForEmail(userEmail, {
        redirectTo: `${window.location.origin}/reset-pin?pin=${newPin}`,
      });

      if (error) throw error;

      setShowResetConfirmation(true);
      setError('');
    } catch (error: any) {
      console.error('Erreur lors de la réinitialisation du PIN:', error);
      setError('Une erreur est survenue lors de la réinitialisation du PIN.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  if (showResetConfirmation) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
        <div className="bg-gray-800 rounded-lg p-6 max-w-sm w-full">
          <h2 className="text-xl font-bold text-white mb-4">Instructions envoyées</h2>
          <p className="text-gray-300 mb-4">
            Un email contenant les instructions pour réinitialiser votre PIN a été envoyé à {userEmail}.
          </p>
          <button
            onClick={onClose}
            className="w-full bg-blue-600 text-white rounded-md py-2 hover:bg-blue-700"
          >
            Fermer
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-gray-800 rounded-lg p-6 max-w-sm w-full relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-400 hover:text-white"
        >
          <XIcon size={20} />
        </button>

        <h2 className="text-xl font-bold text-white mb-6">Entrez votre code PIN</h2>
        
        <div className="flex justify-center space-x-2 mb-6">
          {pin.map((digit, index) => (
            <input
              key={index}
              id={`pin-${index}`}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handlePinChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              className="w-12 h-12 text-center text-2xl bg-gray-700 border border-gray-600 rounded-md text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
          ))}
        </div>

        {error && (
          <div className="text-red-500 text-sm text-center mb-4">
            {error}
          </div>
        )}

        <button
          onClick={verifyPin}
          disabled={loading || pin.some(p => !p)}
          className="w-full bg-blue-600 text-white rounded-md py-2 mb-4 hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? 'Vérification...' : 'Valider'}
        </button>

        <button
          onClick={() => handleResetPin()}
          disabled={loading}
          className="w-full text-sm text-gray-400 hover:text-white"
        >
          J'ai oublié mon code PIN
        </button>
      </div>
    </div>
  );
}
