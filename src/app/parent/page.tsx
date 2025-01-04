'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Lock, ArrowRight, RefreshCw, ArrowLeft, Mail, AlertCircle, CheckCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/ios-button';

export default function ParentSpace() {
  const router = useRouter();
  const [pin, setPin] = useState(['', '', '', '']);
  const [error, setError] = useState('');
  const [showResetForm, setShowResetForm] = useState(false);
  const [email, setEmail] = useState('');
  const [resetSent, setResetSent] = useState(false);

  const handlePinChange = (index: number, value: string) => {
    if (value.length > 1) return;
    if (!/^\d*$/.test(value)) return;

    const newPin = [...pin];
    newPin[index] = value;
    setPin(newPin);

    // Auto-focus next input
    if (value && index < 3) {
      const nextInput = document.getElementById(`pin-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handlePinKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !pin[index] && index > 0) {
      const prevInput = document.getElementById(`pin-${index - 1}`);
      prevInput?.focus();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const pinCode = pin.join('');
    if (pinCode.length !== 4) {
      setError('Veuillez entrer les 4 chiffres du code');
      return;
    }

    try {
      // Simuler une vérification du code PIN
      if (pinCode === '1234') {
        router.push('/parent/dashboard');
      } else {
        setError('Code PIN incorrect');
      }
    } catch (err) {
      setError('Une erreur est survenue');
    }
  };

  const handleResetSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email) {
      setError('Veuillez entrer votre adresse email');
      return;
    }

    try {
      // Simuler l'envoi d'un email de réinitialisation
      await new Promise(resolve => setTimeout(resolve, 1000));
      setResetSent(true);
    } catch (err) {
      setError('Une erreur est survenue');
    }
  };

  return (
    <div className="min-h-screen bg-background safe-area-inset">
      <header className="bg-surface-dark border-b border-white/10 pt-safe-top">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            <Link 
              href="/"
              className="flex items-center space-x-2 text-white hover:text-white/80 transition tap-target touch-manipulation"
              aria-label="Retour à l'accueil"
            >
              <ArrowLeft className="w-6 h-6" />
              <span className="text-lg font-medium">Retour</span>
            </Link>
            <h1 className="text-xl font-bold">Espace Parents</h1>
          </div>
        </div>
      </header>

      <main className="max-w-md mx-auto px-4 sm:px-6 py-8 space-y-8">
        <div className="text-center">
          <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <Lock className="w-8 h-8 text-primary" />
          </div>
          <h2 className="text-2xl md:text-3xl font-bold mb-2">
            {showResetForm ? 'Réinitialiser le code' : 'Entrez votre code PIN'}
          </h2>
          <p className="text-white/70">
            {showResetForm 
              ? 'Entrez votre email pour recevoir un nouveau code'
              : 'Accédez au suivi de votre enfant'}
          </p>
        </div>

        {!showResetForm ? (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex justify-center gap-4">
              {pin.map((digit, index) => (
                <input
                  key={index}
                  id={`pin-${index}`}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handlePinChange(index, e.target.value)}
                  onKeyDown={(e) => handlePinKeyDown(index, e)}
                  className="w-14 h-14 text-center text-2xl font-bold bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              ))}
            </div>

            {error && (
              <div className="flex items-center space-x-2 text-red-400 text-sm">
                <AlertCircle className="w-4 h-4" />
                <span>{error}</span>
              </div>
            )}

            <div className="space-y-4">
              <Button
                type="submit"
                className="w-full min-h-[44px] flex items-center justify-center space-x-2"
              >
                <span>Continuer</span>
                <ArrowRight className="w-5 h-5" />
              </Button>

              <button
                type="button"
                onClick={() => setShowResetForm(true)}
                className="w-full text-sm text-white/60 hover:text-white transition tap-target touch-manipulation"
              >
                Code oublié ?
              </button>
            </div>
          </form>
        ) : (
          <div className="space-y-6">
            {resetSent ? (
              <div className="text-center space-y-4">
                <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle className="w-8 h-8 text-green-500" />
                </div>
                <p className="text-white/70">
                  Un email de réinitialisation a été envoyé à {email}
                </p>
                <Button
                  onClick={() => {
                    setShowResetForm(false);
                    setResetSent(false);
                    setEmail('');
                  }}
                  className="w-full min-h-[44px]"
                >
                  Retour
                </Button>
              </div>
            ) : (
              <form onSubmit={handleResetSubmit} className="space-y-6">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium mb-2">
                    Adresse email
                  </label>
                  <div className="relative">
                    <input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                      placeholder="exemple@email.com"
                    />
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                  </div>
                </div>

                {error && (
                  <div className="flex items-center space-x-2 text-red-400 text-sm">
                    <AlertCircle className="w-4 h-4" />
                    <span>{error}</span>
                  </div>
                )}

                <div className="space-y-4">
                  <Button
                    type="submit"
                    className="w-full min-h-[44px] flex items-center justify-center space-x-2"
                  >
                    <RefreshCw className="w-5 h-5" />
                    <span>Réinitialiser</span>
                  </Button>

                  <button
                    type="button"
                    onClick={() => setShowResetForm(false)}
                    className="w-full text-sm text-white/60 hover:text-white transition tap-target touch-manipulation"
                  >
                    Retour
                  </button>
                </div>
              </form>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
