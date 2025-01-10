'use client';

import { FC, useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, Trophy } from 'lucide-react';
import confetti from 'canvas-confetti';
import { cn } from '@/lib/utils';

interface Card {
  id: number;
  emoji: string;
  isFlipped: boolean;
  isMatched: boolean;
  pairId: number;
}

const CARD_SETS = {
  couleurs: ['🔴', '🔵', '🟡', '🟢', '🟣', '🟤', '⚫', '⚪'],
  formes: ['⭐', '⬟', '⬡', '⬢', '⭕', '△', '⬤', '⬛'],
  chiffres: ['1', '2', '3', '4', '5', '6', '7', '8'],
  lettres: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'],
  animaux: ['🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼']
};

type CardSetType = keyof typeof CARD_SETS;

const INITIAL_SCORE = 1000;
const SCORE_DECREASE_PER_MOVE = 10;
const SCORE_DECREASE_PER_SECOND = 2;

const MemoryGame: FC = () => {
  const [cards, setCards] = useState<Card[]>([]);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [score, setScore] = useState(INITIAL_SCORE);
  const [isWon, setIsWon] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [matchAnimation, setMatchAnimation] = useState<number | null>(null);
  const [selectedCardSet, setSelectedCardSet] = useState<CardSetType>('couleurs');

  useEffect(() => {
    initializeGame();
  }, [selectedCardSet]);

  useEffect(() => {
    if (!isWon) {
      const timer = setInterval(() => {
        setScore(prevScore => Math.max(0, prevScore - SCORE_DECREASE_PER_SECOND));
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [isWon]);

  const initializeGame = () => {
    const cardPairs = CARD_SETS[selectedCardSet].flatMap((symbol, index) => [
      {
        id: index * 2,
        emoji: symbol,
        isFlipped: false,
        isMatched: false,
        pairId: index,
      },
      {
        id: index * 2 + 1,
        emoji: symbol,
        isFlipped: false,
        isMatched: false,
        pairId: index,
      },
    ]);

    const shuffledCards = [...cardPairs].sort(() => Math.random() - 0.5);
    setCards(shuffledCards);
    setFlippedCards([]);
    setMoves(0);
    setScore(INITIAL_SCORE);
    setIsWon(false);
    setIsProcessing(false);
    setMatchAnimation(null);
  };

  const celebratePairMatch = (pairId: number) => {
    setMatchAnimation(pairId);
    // Petit effet de confetti localisé
    const card = document.querySelector(`[data-pair-id="${pairId}"]`);
    if (card) {
      const rect = card.getBoundingClientRect();
      const x = (rect.left + rect.right) / 2 / window.innerWidth;
      const y = (rect.top + rect.bottom) / 2 / window.innerHeight;
      
      confetti({
        particleCount: 30,
        spread: 50,
        origin: { x, y },
        colors: ['#FFD700', '#FFA500', '#FF69B4'],
        gravity: 0.5,
      });
    }
    setTimeout(() => setMatchAnimation(null), 1000);
  };

  const handleCardClick = (clickedCard: Card) => {
    if (
      isProcessing ||
      flippedCards.length === 2 ||
      clickedCard.isFlipped ||
      clickedCard.isMatched
    ) {
      return;
    }

    const newCards = cards.map(card =>
      card.id === clickedCard.id
        ? { ...card, isFlipped: true }
        : card
    );
    setCards(newCards);

    const newFlippedCards = [...flippedCards, clickedCard.id];
    setFlippedCards(newFlippedCards);

    if (newFlippedCards.length === 2) {
      setIsProcessing(true);
      setMoves(moves + 1);
      setScore(prevScore => Math.max(0, prevScore - SCORE_DECREASE_PER_MOVE));

      const [firstCardId, secondCardId] = newFlippedCards;
      const firstCard = cards.find(card => card.id === firstCardId);
      const secondCard = cards.find(card => card.id === secondCardId);

      if (firstCard && secondCard && firstCard.pairId === secondCard.pairId) {
        setTimeout(() => {
          setCards(prevCards =>
            prevCards.map(card =>
              card.id === firstCardId || card.id === secondCardId
                ? { ...card, isMatched: true }
                : card
            )
          );
          setFlippedCards([]);
          setIsProcessing(false);
          celebratePairMatch(firstCard.pairId);

          if (newCards.every((card) => card.isMatched)) {
            setIsWon(true);
            confetti({
              particleCount: 100,
              spread: 70,
              origin: { y: 0.6 },
            });
          }
        }, 500);
      } else {
        setTimeout(() => {
          setCards(prevCards =>
            prevCards.map(card =>
              card.id === firstCardId || card.id === secondCardId
                ? { ...card, isFlipped: false }
                : card
            )
          );
          setFlippedCards([]);
          setIsProcessing(false);
        }, 1000);
      }
    }
  };

  return (
    <main className="min-h-screen py-24">
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
          <h1 className="text-4xl font-bold gradient-text mb-4">Memory Match</h1>
          <div className="flex justify-center gap-8 text-white/70">
            <div className="flex items-center gap-2">
              <Trophy className="w-5 h-5 text-yellow-500" />
              <p>Score: {score}</p>
            </div>
            <p>Coups: {moves}</p>
          </div>
        </div>

        <div className="glass-card p-8">
          <div className="grid grid-cols-4 gap-4">
            {cards.map((card) => (
              <div
                key={card.id}
                data-pair-id={card.pairId}
                className={cn(
                  "relative aspect-square perspective-1000",
                  matchAnimation === card.pairId && "animate-bounce"
                )}
                onClick={() => handleCardClick(card)}
              >
                <div
                  className={cn(
                    "w-full h-full transition-transform duration-500 transform-style-3d cursor-pointer",
                    (card.isFlipped || card.isMatched) ? "rotate-y-180" : ""
                  )}
                >
                  <div className={cn(
                    "absolute w-full h-full backface-hidden bg-white/5 rounded-xl flex items-center justify-center text-2xl font-bold",
                    card.isMatched && "opacity-0"
                  )}>
                    ?
                  </div>
                  <div className={cn(
                    "absolute w-full h-full backface-hidden rotate-y-180 bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-xl flex items-center justify-center",
                    selectedCardSet === 'lettres' || selectedCardSet === 'chiffres' ? "text-3xl" : "text-4xl"
                  )}>
                    {card.emoji}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-8 flex flex-col items-center gap-6">
          <button
            onClick={initializeGame}
            className="px-6 py-3 rounded-lg bg-gradient-to-r from-purple-500 to-blue-500 text-white font-semibold hover:opacity-90 transition-opacity"
          >
            Nouvelle partie
          </button>

          <div className="flex flex-wrap justify-center gap-3">
            {(Object.keys(CARD_SETS) as CardSetType[]).map((cardSet) => (
              <button
                key={cardSet}
                onClick={() => setSelectedCardSet(cardSet)}
                className={cn(
                  "px-4 py-2 rounded-lg text-sm font-medium transition-colors",
                  selectedCardSet === cardSet
                    ? "bg-white/20 text-white"
                    : "bg-white/5 text-white/70 hover:bg-white/10 hover:text-white"
                )}
              >
                {cardSet.charAt(0).toUpperCase() + cardSet.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {isWon && (
          <div className="text-center mt-8">
            <h2 className="text-2xl font-bold gradient-text mb-4">
              Félicitations ! 🎉
            </h2>
            <p className="text-white/70 mb-2">
              Tu as gagné en {moves} coups !
            </p>
            <p className="text-white/70 mb-4">
              Score final : {score} points
            </p>
          </div>
        )}
      </div>
    </main>
  );
};

export default MemoryGame;
