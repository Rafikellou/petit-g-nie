'use client';

import { FC, useState, useEffect, useRef } from 'react';
import { PlayCircle, PauseCircle, RotateCcw, CheckCircle } from 'lucide-react';

interface WordAnalysis {
  word: string;
  start: number;
  end: number;
  isCorrect: boolean;
}

interface CorrectionResult {
  errors: Array<{
    word: string;
    correction: string;
    explanation: string;
  }>;
  encouragement: string;
  score: number;
}

interface DicteeInteractiveProps {
  text: string;
  onInputChange: (value: string) => void;
}

export const DicteeInteractive: FC<DicteeInteractiveProps> = ({ text, onInputChange }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [userInput, setUserInput] = useState('');
  const [wordAnalysis, setWordAnalysis] = useState<WordAnalysis[]>([]);
  const [correction, setCorrection] = useState<CorrectionResult | null>(null);
  const [showCorrection, setShowCorrection] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  // Fonction pour générer l'audio via OpenAI TTS
  const generateAudio = async () => {
    try {
      const response = await fetch('/api/generate-speech', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text }),
      });
      
      const audioBlob = await response.blob();
      const url = URL.createObjectURL(audioBlob);
      setAudioUrl(url);
    } catch (error) {
      console.error('Erreur lors de la génération de l\'audio:', error);
    }
  };

  // Fonction pour analyser l'orthographe en temps réel
  const analyzeSpelling = async (input: string) => {
    try {
      const response = await fetch('/api/check-spelling', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          userInput: input,
          correctText: text,
          mode: 'realtime'
        }),
      });
      
      const analysis = await response.json();
      setWordAnalysis(analysis.words || []);
    } catch (error) {
      console.error('Erreur lors de l\'analyse orthographique:', error);
    }
  };

  // Fonction pour obtenir la correction finale
  const getFinalCorrection = async () => {
    try {
      const response = await fetch('/api/check-spelling', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          userInput,
          correctText: text,
          mode: 'correction'
        }),
      });
      
      const result = await response.json();
      setCorrection(result);
      setShowCorrection(true);
    } catch (error) {
      console.error('Erreur lors de la correction:', error);
    }
  };

  // Gestionnaire de changement de texte
  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    setUserInput(newValue);
    onInputChange(newValue);
    analyzeSpelling(newValue);
  };

  // Contrôles audio
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

  // Générer l'audio au chargement
  useEffect(() => {
    generateAudio();
  }, [text]);

  // Fonction pour appliquer le surlignage du texte
  const getHighlightedText = () => {
    if (!textareaRef.current) return null;

    const overlayStyle = "absolute inset-0 pointer-events-none p-4 whitespace-pre-wrap break-words font-mono";
    const text = userInput;
    
    return (
      <div className={overlayStyle}>
        {wordAnalysis.map((word, index) => {
          const beforeText = text.substring(
            index > 0 ? wordAnalysis[index - 1].end : 0,
            word.start
          );
          
          return (
            <span key={index}>
              {beforeText}
              <span className={`${word.isCorrect ? 'text-green-500' : 'text-red-500'}`}>
                {text.substring(word.start, word.end)}
              </span>
            </span>
          );
        })}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Contrôles audio */}
      <div className="flex items-center justify-center gap-4">
        <button
          onClick={togglePlay}
          className="btn-icon text-white/70 hover:text-white transition-colors"
          aria-label={isPlaying ? 'Pause' : 'Play'}
        >
          {isPlaying ? (
            <PauseCircle className="w-12 h-12" />
          ) : (
            <PlayCircle className="w-12 h-12" />
          )}
        </button>
        <button
          onClick={restart}
          className="btn-icon text-white/70 hover:text-white transition-colors"
          aria-label="Restart"
        >
          <RotateCcw className="w-8 h-8" />
        </button>
      </div>

      {/* Audio element */}
      {audioUrl && (
        <audio
          ref={audioRef}
          src={audioUrl}
          onEnded={() => setIsPlaying(false)}
          className="hidden"
        />
      )}

      {/* Zone de texte avec analyse en temps réel */}
      <div className="relative font-mono">
        <textarea
          ref={textareaRef}
          value={userInput}
          onChange={handleInputChange}
          className="w-full min-h-[200px] p-4 rounded-lg bg-white/5 border border-white/10 
                   focus:border-[rgb(var(--primary))] focus:ring-2 focus:ring-[rgb(var(--primary))]/20 
                   transition-all duration-200 text-lg font-mono"
          placeholder="Écrivez la dictée ici..."
        />
        {getHighlightedText()}
      </div>

      {/* Bouton de correction */}
      <div className="flex justify-center">
        <button
          onClick={getFinalCorrection}
          className="btn-primary"
        >
          <CheckCircle className="w-5 h-5" />
          Vérifier ma dictée
        </button>
      </div>

      {/* Affichage de la correction */}
      {showCorrection && correction && (
        <div className="mt-8 space-y-6">
          <div className="card bg-white/5">
            <h3 className="text-xl font-semibold mb-4">Résultat : {correction.score}/10</h3>
            <p className="text-white/70 mb-6">{correction.encouragement}</p>
            
            {correction.errors.length > 0 ? (
              <div className="space-y-4">
                <h4 className="font-semibold">Corrections et explications :</h4>
                {correction.errors.map((error, index) => (
                  <div key={index} className="p-4 rounded-lg bg-white/5">
                    <p className="text-red-500 mb-2">
                      Mot incorrect : <span className="font-bold">{error.word}</span>
                    </p>
                    <p className="text-green-500 mb-2">
                      Correction : <span className="font-bold">{error.correction}</span>
                    </p>
                    <p className="text-white/70">{error.explanation}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-green-500 font-semibold">Parfait ! Aucune erreur !</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
