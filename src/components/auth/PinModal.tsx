'use client';

import { useState } from 'react';
import { X } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface PinModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function PinModal({ isOpen, onClose }: PinModalProps) {
  const [pin, setPin] = useState(['', '', '', '']);
  const [error, setError] = useState(false);
  const router = useRouter();

  if (!isOpen) return null;

  const handlePinChange = (index: number, value: string) => {
    if (value.length > 1) return;
    if (!/^\d*$/.test(value)) return;

    const newPin = [...pin];
    newPin[index] = value;
    setPin(newPin);
    setError(false);

    // Déplacer le focus vers l'input suivant
    if (value && index < 3) {
      const nextInput = document.getElementById(`pin-${index + 1}`);
      nextInput?.focus();
    }

    // Vérifier le PIN quand tous les chiffres sont entrés
    if (index === 3 && value) {
      const enteredPin = [...newPin.slice(0, 3), value].join('');
      if (enteredPin === '0000') {
        router.push('/parent');
        onClose();
      } else {
        setError(true);
        setPin(['', '', '', '']);
        document.getElementById('pin-0')?.focus();
      }
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !pin[index] && index > 0) {
      const prevInput = document.getElementById(`pin-${index - 1}`);
      prevInput?.focus();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-gray-900 p-6 rounded-xl w-full max-w-sm mx-4 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>

        <h2 className="text-xl font-semibold mb-6 text-center">
          Entrez votre code PIN
        </h2>

        <div className="flex justify-center gap-3 mb-6">
          {pin.map((digit, index) => (
            <input
              key={index}
              id={`pin-${index}`}
              type="text"
              inputMode="numeric"
              value={digit}
              onChange={(e) => handlePinChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              className="w-12 h-12 text-center text-lg font-medium bg-gray-800 border-2 border-gray-700 rounded-lg focus:border-turquoise-500 focus:outline-none"
              maxLength={1}
            />
          ))}
        </div>

        {error && (
          <p className="text-red-500 text-sm text-center">
            Code PIN incorrect. Veuillez réessayer.
          </p>
        )}
      </div>
    </div>
  );
}
