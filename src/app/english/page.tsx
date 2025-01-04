'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Play, ArrowLeft, Volume2, ChevronLeft, ChevronRight, Star } from 'lucide-react';
import { commonEnglishWords } from '@/data/english-words';
import { Button } from '@/components/ui/ios-button';

interface EnglishWord {
  word: string;
  translation: string;
  category: string;
  image: string;
  example: string;
}

interface FavoriteWord extends EnglishWord {
  addedAt: string;
  lastReviewed?: string;
  mastery: number; // 0-100
}

export default function EnglishLearning() {
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [synth, setSynth] = useState<SpeechSynthesis | null>(null);
  const [favorites, setFavorites] = useState<FavoriteWord[]>([]);
  const currentWord = commonEnglishWords[currentWordIndex] as EnglishWord;

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setSynth(window.speechSynthesis);
      const savedFavorites = localStorage.getItem('englishFavorites');
      if (savedFavorites) {
        setFavorites(JSON.parse(savedFavorites));
      }
    }
  }, []);

  const playPronunciation = (text: string) => {
    if (synth) {
      synth.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-US';
      utterance.rate = 0.8;
      synth.speak(utterance);
    }
  };

  const nextWord = () => {
    setCurrentWordIndex((prev) => 
      prev === commonEnglishWords.length - 1 ? 0 : prev + 1
    );
  };

  const previousWord = () => {
    setCurrentWordIndex((prev) => 
      prev === 0 ? commonEnglishWords.length - 1 : prev - 1
    );
  };

  const toggleFavorite = () => {
    const isFavorite = favorites.some(f => f.word === currentWord.word);
    const newFavorites = isFavorite
      ? favorites.filter(f => f.word !== currentWord.word)
      : [...favorites, {
          ...currentWord,
          addedAt: new Date().toISOString(),
          mastery: 0
        }];
    
    setFavorites(newFavorites);
    localStorage.setItem('englishFavorites', JSON.stringify(newFavorites));
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
            <h1 className="text-xl font-bold">Anglais</h1>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">
        <div className="text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-2">Apprends l'anglais</h2>
          <p className="text-white/70">Découvre de nouveaux mots en anglais</p>
        </div>

        <div className="glass-card p-6 max-w-2xl mx-auto">
          <div className="aspect-video relative rounded-lg overflow-hidden mb-6">
            {currentWord.image && (
              <Image
                src={currentWord.image}
                alt={currentWord.word}
                fill
                className="object-cover"
              />
            )}
          </div>

          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-2xl font-bold mb-1">{currentWord.word}</h3>
                <p className="text-white/70">{currentWord.translation}</p>
              </div>
              <button
                onClick={() => playPronunciation(currentWord.word)}
                className="p-3 hover:bg-white/10 rounded-full transition tap-target touch-manipulation"
                aria-label="Écouter la prononciation"
              >
                <Volume2 className="w-6 h-6" />
              </button>
            </div>

            <div className="flex items-center justify-between">
              <Button
                onClick={previousWord}
                className="min-h-[44px] flex items-center space-x-2"
              >
                <ChevronLeft className="w-5 h-5" />
                <span>Précédent</span>
              </Button>

              <button
                onClick={toggleFavorite}
                className={`p-3 rounded-full transition tap-target touch-manipulation ${
                  favorites.some(f => f.word === currentWord.word)
                    ? 'text-yellow-400 hover:text-yellow-500'
                    : 'text-white/70 hover:text-white'
                }`}
                aria-label={favorites.some(f => f.word === currentWord.word) ? "Retirer des favoris" : "Ajouter aux favoris"}
              >
                <Star className="w-6 h-6" />
              </button>

              <Button
                onClick={nextWord}
                className="min-h-[44px] flex items-center space-x-2"
              >
                <span>Suivant</span>
                <ChevronRight className="w-5 h-5" />
              </Button>
            </div>

            {currentWord.example && (
              <div className="p-4 bg-white/5 rounded-lg">
                <p className="text-sm font-medium mb-1">Exemple :</p>
                <p className="text-white/70 italic">{currentWord.example}</p>
              </div>
            )}
          </div>
        </div>

        {favorites.length > 0 && (
          <div className="glass-card p-6">
            <h3 className="text-lg font-medium mb-4">Mots favoris</h3>
            <div className="flex flex-wrap gap-2">
              {favorites.map(word => (
                <div
                  key={word.word}
                  className="px-3 py-1 bg-white/10 rounded-full text-sm"
                >
                  {word.word}
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
