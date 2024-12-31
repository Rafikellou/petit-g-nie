'use client';

import { FC, useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { cn } from '@/lib/utils';
import confetti from 'canvas-confetti';

interface ColorButton {
  color: string;
  gradient: string;
  sound: number;
}

const buttons: ColorButton[] = [
  { color: 'red', gradient: 'from-red-500/20 to-pink-500/20', sound: 440 }, // La
  { color: 'blue', gradient: 'from-blue-500/20 to-indigo-500/20', sound: 494 }, // Si
  { color: 'green', gradient: 'from-green-500/20 to-teal-500/20', sound: 523 }, // Do
  { color: 'yellow', gradient: 'from-yellow-500/20 to-amber-500/20', sound: 587 }, // Ré
];

const SimonGame: FC = () => {
  const [sequence, setSequence] = useState<number[]>([]);
  const [playerSequence, setPlayerSequence] = useState<number[]>([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [canPlay, setCanPlay] = useState(false);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [activeButton, setActiveButton] = useState<number | null>(null);

  // Charger le meilleur score depuis le localStorage
  useEffect(() => {
    const savedHighScore = localStorage.getItem('simon-high-score');
    if (savedHighScore) {
      setHighScore(parseInt(savedHighScore));
    }
  }, []);

  // Jouer un son
  const playSound = useCallback((frequency: number) => {
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.type = 'sine';
    oscillator.frequency.value = frequency;
    gainNode.gain.setValueAtTime(0, audioContext.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.5, audioContext.currentTime + 0.1);
    
    oscillator.start(audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
    oscillator.stop(audioContext.currentTime + 0.3);
  }, []);

  // Jouer une séquence
  const playSequence = useCallback(async (sequence: number[]) => {
    setCanPlay(false);
    for (let i = 0; i < sequence.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 500));
      setActiveButton(sequence[i]);
      playSound(buttons[sequence[i]].sound);
      await new Promise(resolve => setTimeout(resolve, 300));
      setActiveButton(null);
    }
    setCanPlay(true);
  }, [playSound]);

  // Démarrer une nouvelle partie
  const startGame = useCallback(() => {
    const newSequence = [Math.floor(Math.random() * 4)];
    setSequence(newSequence);
    setPlayerSequence([]);
    setIsPlaying(true);
    setScore(0);
    playSequence(newSequence);
  }, [playSequence]);

  // Gérer le clic sur un bouton
  const handleButtonClick = (index: number) => {
    if (!canPlay) return;

    setActiveButton(index);
    playSound(buttons[index].sound);
    setTimeout(() => setActiveButton(null), 300);

    const newPlayerSequence = [...playerSequence, index];
    setPlayerSequence(newPlayerSequence);

    // Vérifier si la séquence est correcte
    if (newPlayerSequence[newPlayerSequence.length - 1] !== sequence[newPlayerSequence.length - 1]) {
      // Game over
      setIsPlaying(false);
      if (score > highScore) {
        setHighScore(score);
        localStorage.setItem('simon-high-score', score.toString());
      }
      return;
    }

    // Si le joueur a complété la séquence
    if (newPlayerSequence.length === sequence.length) {
      setScore(score + 1);
      if (score + 1 > 0 && (score + 1) % 5 === 0) {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
        });
      }
      
      // Ajouter un nouveau bouton à la séquence
      setTimeout(() => {
        const newSequence = [...sequence, Math.floor(Math.random() * 4)];
        setSequence(newSequence);
        setPlayerSequence([]);
        playSequence(newSequence);
      }, 1000);
    }
  };

  return (
    <main className="min-h-screen py-24">
      {/* Effets d'arrière-plan */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-50%] left-[-50%] w-[200%] h-[200%] bg-[radial-gradient(circle_at_center,rgba(0,242,195,0.03),transparent_70%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(108,99,255,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(108,99,255,0.05)_1px,transparent_1px)] bg-[size:14px_14px]" />
      </div>

      <div className="max-w-4xl mx-auto px-6 relative">
        <Link
          href="/jeux"
          className="inline-flex items-center text-white/70 hover:text-white mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Retour aux jeux
        </Link>

        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold gradient-text mb-4">Simon</h1>
          <div className="flex justify-center gap-8 text-white/70">
            <p>Score : {score}</p>
            <p>Meilleur score : {highScore}</p>
          </div>
        </div>

        <div className="glass-card p-8">
          <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
            {buttons.map((button, index) => (
              <button
                key={button.color}
                onClick={() => handleButtonClick(index)}
                disabled={!canPlay}
                className={cn(
                  'aspect-square rounded-xl transition-all',
                  `bg-gradient-to-r ${button.gradient}`,
                  activeButton === index ? 'scale-95 brightness-150' : 'scale-100',
                  !canPlay && 'cursor-not-allowed opacity-50'
                )}
              />
            ))}
          </div>

          {!isPlaying && (
            <div className="text-center mt-8">
              <button
                onClick={startGame}
                className="px-6 py-3 rounded-lg bg-gradient-to-r from-green-500 to-teal-500 text-white font-semibold hover:opacity-90 transition-opacity"
              >
                {score > 0 ? 'Rejouer' : 'Commencer'}
              </button>
            </div>
          )}
        </div>

        <div className="mt-8 text-center text-white/70">
          <p className="mb-2">Comment jouer :</p>
          <p>1. Observe la séquence de couleurs</p>
          <p>2. Reproduis la séquence en cliquant sur les boutons</p>
          <p>3. La séquence s'allonge à chaque tour réussi</p>
        </div>
      </div>
    </main>
  );
};

export default SimonGame;
