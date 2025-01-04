'use client';

import { FC, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Volume2, RefreshCcw, CheckCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/ios-button';

interface DictationResult {
  score: number;
  correctWords: string[];
  mistakes: {
    word: string;
    expected: string;
    position: number;
  }[];
  timeSpent: number;
}

interface Dictation {
  id: string;
  text: string;
  level: 'CE1' | 'CE2' | 'CM1' | 'CM2';
  category: 'grammaire' | 'conjugaison' | 'orthographe';
  duration: number; // en secondes
}

// Texte de démonstration (à remplacer par une vraie base de données)
const demoDictation: Dictation = {
  id: '1',
  text: "L'été dernier, nous sommes allés en vacances à la mer. Le soleil brillait tous les jours, et nous avons passé beaucoup de temps à nager et à construire des châteaux de sable.",
  level: 'CE2',
  category: 'orthographe',
  duration: 120
};

const DicteePage: FC = () => {
  const [userInput, setUserInput] = useState('');
  const [isPlaying, setIsPlaying] = useState(false);
  const [isChecking, setIsChecking] = useState(false);
  const [result, setResult] = useState<DictationResult | null>(null);

  const playDictation = async () => {
    setIsPlaying(true);
    try {
      // Simuler la lecture audio
      await new Promise(resolve => setTimeout(resolve, 2000));
    } finally {
      setIsPlaying(false);
    }
  };

  const checkDictation = async () => {
    if (!userInput) return;
    
    setIsChecking(true);
    try {
      // Simuler la vérification
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Calculer le score
      const words = demoDictation.text.toLowerCase().split(' ');
      const userWords = userInput.toLowerCase().split(' ');
      const correctWords = words.filter((word, index) => word === userWords[index]);
      const mistakes = words.map((word, index) => {
        if (word !== userWords[index]) {
          return {
            word: userWords[index] || '',
            expected: word,
            position: index
          };
        }
        return null;
      }).filter((mistake): mistake is NonNullable<typeof mistake> => mistake !== null);

      const result: DictationResult = {
        score: Math.round((correctWords.length / words.length) * 100),
        correctWords,
        mistakes,
        timeSpent: 0 // À implémenter avec un vrai chronomètre
      };
      
      setResult(result);
    } finally {
      setIsChecking(false);
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
            <h1 className="text-xl font-bold">Dictée</h1>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">
        <div className="text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-2">Exercice de dictée</h2>
          <p className="text-white/70">Écoute attentivement et écris ce que tu entends</p>
        </div>

        <div className="glass-card p-6 space-y-6">
          <div className="flex justify-center">
            <Button
              onClick={playDictation}
              className="min-h-[44px] flex items-center space-x-2"
              disabled={isPlaying}
            >
              {isPlaying ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  <Volume2 className="w-5 h-5" />
                  <span>Écouter la dictée</span>
                </>
              )}
            </Button>
          </div>

          <div>
            <label htmlFor="dictation" className="block text-sm font-medium mb-2">
              Écris la dictée ici
            </label>
            <textarea
              id="dictation"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent min-h-[200px]"
              placeholder="Commence à écrire..."
            />
          </div>

          <div className="flex items-center justify-between">
            <Button
              onClick={() => {
                setUserInput('');
                setResult(null);
              }}
              className="min-h-[44px] flex items-center space-x-2"
              disabled={!userInput}
            >
              <RefreshCcw className="w-5 h-5" />
              <span>Recommencer</span>
            </Button>

            <Button
              onClick={checkDictation}
              className="min-h-[44px] flex items-center space-x-2"
              disabled={isChecking || !userInput}
            >
              {isChecking ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  <CheckCircle className="w-5 h-5" />
                  <span>Vérifier</span>
                </>
              )}
            </Button>
          </div>

          {result !== null && (
            <div className={`p-4 rounded-lg ${
              result.score >= 80 ? 'bg-green-500/10 border border-green-500/20' :
              result.score >= 50 ? 'bg-yellow-500/10 border border-yellow-500/20' :
              'bg-red-500/10 border border-red-500/20'
            }`}>
              <p className="text-center font-medium">
                Score : {result.score}%
                {result.score >= 80 && ' - Excellent !'}
                {result.score >= 50 && result.score < 80 && ' - Continue comme ça !'}
                {result.score < 50 && ' - Essaie encore !'}
              </p>
              <ul>
                {result.mistakes.map((mistake, index) => (
                  <li key={index}>
                    <p>
                      Mot {index + 1} : {mistake.word} (attendu : {mistake.expected})
                    </p>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default DicteePage;
