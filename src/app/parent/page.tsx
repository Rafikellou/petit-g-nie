'use client';

import { useState, useEffect } from 'react';
import { Lock, ArrowRight, RefreshCw } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function ParentSpace() {
  const router = useRouter();
  const [pin, setPin] = useState(['', '', '', '']);
  const [error, setError] = useState('');
  const [showResetForm, setShowResetForm] = useState(false);
  const [email, setEmail] = useState('');

  const handlePinChange = (index: number, value: string) => {
    if (value.length > 1) return;
    if (!/^\d*$/.test(value)) return;

    const newPin = [...pin];
    newPin[index] = value;
    setPin(newPin);

    // Déplacer automatiquement le focus vers le champ suivant
    if (value && index < 3) {
      const nextInput = document.getElementById(`pin-${index + 1}`);
      nextInput?.focus();
    }

    // Vérifier le PIN lorsque tous les chiffres sont entrés
    if (index === 3 && value) {
      const enteredPin = newPin.join('');
      if (enteredPin === '0000') {
        // Rediriger vers le tableau de bord parent avec un ID par défaut
        router.push('/parent/dashboard?id=parent1');
      } else {
        setError('Code PIN incorrect');
        setPin(['', '', '', '']);
        document.getElementById('pin-0')?.focus();
      }
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !pin[index] && index > 0) {
      const prevInput = document.getElementById(`pin-${index - 1}`);
      prevInput?.focus();
    }
  };

  const handleResetPin = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Un email de réinitialisation a été envoyé à ' + email);
    setShowResetForm(false);
    setEmail('');
  };

  return (
    <div className="min-h-screen py-24">
      <div className="max-w-md mx-auto px-6">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-indigo-500/20 mb-4">
            <Lock className="w-8 h-8 text-indigo-500" />
          </div>
          <h1 className="text-3xl font-bold mb-2">Espace Parent</h1>
          <p className="text-gray-400">
            Entrez votre code PIN à 4 chiffres pour accéder à l'espace parent
          </p>
        </div>

        {!showResetForm ? (
          <>
            <div className="flex justify-center gap-4 mb-6">
              {pin.map((digit, index) => (
                <input
                  key={index}
                  id={`pin-${index}`}
                  type="text"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handlePinChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  className="w-14 h-14 text-center text-2xl font-bold bg-gray-900 border-2 border-gray-700 rounded-lg focus:border-indigo-500 focus:outline-none"
                />
              ))}
            </div>

            {error && (
              <div className="text-red-500 text-center mb-4">
                {error}
              </div>
            )}

            <div className="text-center">
              <button
                onClick={() => setShowResetForm(true)}
                className="text-indigo-500 hover:text-indigo-400 flex items-center gap-2 mx-auto"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Réinitialiser le code PIN</span>
              </button>
            </div>
          </>
        ) : (
          <form onSubmit={handleResetPin} className="space-y-4">
            <div>
              <label className="block text-sm text-gray-400 mb-1">
                Email associé au compte
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg focus:border-indigo-500 focus:outline-none"
                placeholder="exemple@email.com"
              />
            </div>
            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => setShowResetForm(false)}
                className="flex-1 px-4 py-2 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors"
              >
                Annuler
              </button>
              <button
                type="submit"
                className="flex-1 px-4 py-2 bg-indigo-500 rounded-lg hover:bg-indigo-600 transition-colors flex items-center justify-center gap-2"
              >
                <span>Réinitialiser</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
