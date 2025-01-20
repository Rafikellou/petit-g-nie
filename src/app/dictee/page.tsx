'use client';

import React, { FC, useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { ArrowLeft, Volume2, CheckCircle, Loader2, Play, Pause, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { dictations, type Dictation } from '@/data/dictations';
import { cn } from '@/lib/utils';
import ReactConfetti from 'react-confetti';

interface DictationResult {
  score: number;
  correctWords: string[];
  mistakes: {
    word: string;
    expected: string;
    position: number;
    explanation?: string;
  }[];
  timeSpent: number;
}

const AudioPlayer: FC<{ audioUrl: string | null; onReady: () => void }> = ({ audioUrl, onReady }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (audioUrl) {
      setIsLoading(true);
      const audio = new Audio(audioUrl);
      audio.preload = 'auto';
      
      audio.addEventListener('loadedmetadata', () => {
        setDuration(audio.duration);
        setIsLoading(false);
        onReady();
      });

      audio.addEventListener('timeupdate', () => {
        setCurrentTime(audio.currentTime);
      });

      audio.addEventListener('ended', () => {
        setIsPlaying(false);
        audio.currentTime = 0;
      });

      audioRef.current = audio;

      return () => {
        audio.pause();
        audio.src = '';
      };
    }
  }, [audioUrl, onReady]);

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const restart = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-4 bg-slate-800 p-3 rounded-lg">
        <Button
          variant="ghost"
          size="sm"
          onClick={togglePlay}
          disabled={isLoading}
          className="text-slate-300 hover:text-white hover:bg-slate-700"
        >
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : isPlaying ? (
            <Pause className="h-4 w-4" />
          ) : (
            <Play className="h-4 w-4" />
          )}
        </Button>

        <Button
          variant="ghost"
          size="sm"
          onClick={restart}
          disabled={isLoading}
          className="text-slate-300 hover:text-white hover:bg-slate-700"
        >
          <RotateCcw className="h-4 w-4" />
        </Button>

        <div className="flex-1 flex items-center gap-2">
          <span className="text-xs text-slate-400">{formatTime(currentTime)}</span>
          <div className="flex-1 h-1 bg-slate-700 rounded overflow-hidden">
            <div 
              className="h-full bg-blue-500 transition-all duration-100" 
              style={{ width: `${(currentTime / duration) * 100}%` }}
            />
          </div>
          <span className="text-xs text-slate-400">{formatTime(duration)}</span>
        </div>
      </div>
    </div>
  );
};

const DicteePage: FC = () => {
  const [userInput, setUserInput] = useState('');
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isChecking, setIsChecking] = useState(false);
  const [result, setResult] = useState<DictationResult | null>(null);
  const [currentDictation, setCurrentDictation] = useState<Dictation>(dictations[0]);
  const [error, setError] = useState<string | null>(null);
  const [isAudioReady, setIsAudioReady] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [windowSize, setWindowSize] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 0,
    height: typeof window !== 'undefined' ? window.innerHeight : 0
  });

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * dictations.length);
    setCurrentDictation(dictations[randomIndex]);
  }, []);

  const generateDictation = async () => {
    setIsGenerating(true);
    setError(null);
    setAudioUrl(null);
    setIsAudioReady(false);

    try {
      const response = await fetch('/api/tts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: currentDictation.text,
          isDictation: true
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate audio');
      }

      const audioBlob = await response.blob();
      const url = URL.createObjectURL(audioBlob);
      setAudioUrl(url);
    } catch (err) {
      console.error('Erreur de génération:', err);
      setError("Impossible de générer la dictée. Veuillez réessayer.");
    } finally {
      setIsGenerating(false);
    }
  };

  const checkDictation = async () => {
    if (!userInput) return;
    
    setIsChecking(true);
    try {
      const words = currentDictation.text.toLowerCase().split(' ');
      const userWords = userInput.toLowerCase().split(' ');
      const correctWords = words.filter((word, index) => word === userWords[index]);
      
      const mistakes = words.map((word, index) => {
        if (word !== userWords[index]) {
          let explanation = '';
          const userWord = userWords[index] || '';
          
          if (word.endsWith('é') && userWord.endsWith('er')) {
            explanation = "Attention à la terminaison des participes passés en 'é' vs l'infinitif en 'er'.";
          } else if (word.endsWith('s') && !userWord.endsWith('s')) {
            explanation = "N'oubliez pas le 's' au pluriel.";
          } else if (word.startsWith(userWord)) {
            explanation = "Le mot est incomplet.";
          } else if (userWord.startsWith(word)) {
            explanation = "Il y a des lettres en trop.";
          } else {
            explanation = "Vérifiez l'orthographe du mot.";
          }

          return {
            word: userWord,
            expected: word,
            position: index,
            explanation
          };
        }
        return null;
      }).filter((mistake): mistake is NonNullable<typeof mistake> => mistake !== null);

      const score = Math.round((correctWords.length / words.length) * 100);
      
      if (score === 100) {
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 5000); 
      }

      setResult({
        score,
        correctWords,
        mistakes,
        timeSpent: 0,
      });
    } finally {
      setIsChecking(false);
    }
  };

  const resetDictation = () => {
    setUserInput('');
    setResult(null);
    setAudioUrl(null);
    setIsAudioReady(false);
    const randomIndex = Math.floor(Math.random() * dictations.length);
    setCurrentDictation(dictations[randomIndex]);
  };

  return (
    <div className="container max-w-4xl mx-auto py-8 px-4">
      {showConfetti && (
        <ReactConfetti
          width={windowSize.width}
          height={windowSize.height}
          recycle={false}
          numberOfPieces={500}
        />
      )}
      
      <div className="mb-8">
        <Link href="/train" className="inline-flex items-center text-slate-400 hover:text-white">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Retour
        </Link>
      </div>

      <div className="space-y-8">
        <div className="bg-slate-900 rounded-xl p-6 space-y-6">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold">{currentDictation.title}</h1>
            <Button
              onClick={generateDictation}
              disabled={isGenerating}
              className="gap-2"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Génération...
                </>
              ) : (
                <>
                  <Volume2 className="h-4 w-4" />
                  Générer la dictée
                </>
              )}
            </Button>
          </div>

          {error && (
            <div className="bg-red-500/20 text-red-300 p-4 rounded-lg">
              {error}
            </div>
          )}

          {audioUrl && (
            <AudioPlayer 
              audioUrl={audioUrl} 
              onReady={() => setIsAudioReady(true)} 
            />
          )}

          <div className="relative">
            <textarea
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              placeholder="Écrivez la dictée ici..."
              className={cn(
                "w-full min-h-[200px] bg-slate-800/50 rounded-lg p-4 resize-none",
                "focus:outline-none focus:ring-2 focus:ring-blue-500",
                "placeholder:text-slate-500",
                !isAudioReady && "opacity-50 cursor-not-allowed"
              )}
              disabled={!isAudioReady}
            />
            {!isAudioReady && audioUrl && (
              <div className="absolute inset-0 flex items-center justify-center bg-slate-900/50 rounded-lg">
                <Loader2 className="h-6 w-6 animate-spin text-blue-500" />
              </div>
            )}
          </div>

          <div className="flex justify-end">
            <Button
              onClick={checkDictation}
              disabled={isChecking || !userInput || !isAudioReady}
              className="bg-green-600 hover:bg-green-700"
            >
              {isChecking ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Vérification...
                </>
              ) : (
                <>
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Vérifier
                </>
              )}
            </Button>

            {result && (
              <Button
                onClick={resetDictation}
                className="bg-slate-700 hover:bg-slate-600"
              >
                <RotateCcw className="h-4 w-4 mr-2" />
                Nouvelle dictée
              </Button>
            )}
          </div>

          {result && (
            <div className={cn(
              "space-y-4 p-4 rounded-lg border",
              result.score === 100 ? "bg-green-900/20 border-green-700 text-green-300" :
              result.score >= 80 ? "bg-blue-900/20 border-blue-700 text-blue-300" :
              result.score >= 60 ? "bg-yellow-900/20 border-yellow-700 text-yellow-300" :
              "bg-red-900/20 border-red-700 text-red-300"
            )}>
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">Résultat</h2>
                <div className="text-2xl font-bold">{result.score}%</div>
              </div>

              {result.mistakes.length > 0 ? (
                <div className="space-y-4">
                  <h3 className="font-semibold">Erreurs à corriger :</h3>
                  <div className="space-y-2">
                    {result.mistakes.map((mistake, index) => (
                      <div key={index} className="p-3 bg-slate-800 rounded">
                        <div className="flex gap-2">
                          <span className="text-red-400">✗</span>
                          <span>Vous avez écrit : <span className="font-mono">{mistake.word || '(mot manquant)'}</span></span>
                        </div>
                        <div className="flex gap-2 mt-1">
                          <span className="text-green-400">✓</span>
                          <span>Il fallait écrire : <span className="font-mono">{mistake.expected}</span></span>
                        </div>
                        <div className="mt-2 text-sm text-slate-400">
                          💡 {mistake.explanation}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="text-center py-4">
                  <p className="text-lg">🎉 Félicitations ! Votre dictée est parfaite !</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DicteePage;
