'use client';

import { FC, useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import confetti from 'canvas-confetti';
import { cn } from '@/lib/utils';

interface Card {
  id: number;
  emoji: string;
  isFlipped: boolean;
  isMatched: boolean;
}

const emojis = ['🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼'];

const MemoryGame: FC = () => {
  const [cards, setCards] = useState<Card[]>([]);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [isWon, setIsWon] = useState(false);

  // Initialiser le jeu
  useEffect(() => {
    initializeGame();
  }, []);

  const initializeGame = () => {
    // Créer les paires de cartes
    const cardPairs = [...emojis, ...emojis]
      .map((emoji, index) => ({
        id: index,
        emoji,
        isFlipped: false,
        isMatched: false,
      }))
      .sort(() => Math.random() - 0.5);

    setCards(cardPairs);
    setFlippedCards([]);
    setMoves(0);
    setIsWon(false);
  };

  const handleCardClick = (cardId: number) => {
    // Ignorer si la carte est déjà retournée ou si deux cartes sont déjà retournées
    if (
      flippedCards.length === 2 ||
      flippedCards.includes(cardId) ||
      cards[cardId].isMatched
    ) {
      return;
    }

    // Retourner la carte
    const newCards = [...cards];
    newCards[cardId].isFlipped = true;
    setCards(newCards);

    // Ajouter la carte aux cartes retournées
    const newFlippedCards = [...flippedCards, cardId];
    setFlippedCards(newFlippedCards);

    // Si deux cartes sont retournées
    if (newFlippedCards.length === 2) {
      setMoves(moves + 1);

      // Vérifier si les cartes correspondent
      const [firstCard, secondCard] = newFlippedCards;
      if (cards[firstCard].emoji === cards[secondCard].emoji) {
        // Les cartes correspondent
        setTimeout(() => {
          const matchedCards = [...cards];
          matchedCards[firstCard].isMatched = true;
          matchedCards[secondCard].isMatched = true;
          setCards(matchedCards);
          setFlippedCards([]);

          // Vérifier si le jeu est gagné
          if (matchedCards.every((card) => card.isMatched)) {
            setIsWon(true);
            confetti({
              particleCount: 100,
              spread: 70,
              origin: { y: 0.6 },
            });
          }
        }, 500);
      } else {
        // Les cartes ne correspondent pas
        setTimeout(() => {
          const unmatchedCards = [...cards];
          unmatchedCards[firstCard].isFlipped = false;
          unmatchedCards[secondCard].isFlipped = false;
          setCards(unmatchedCards);
          setFlippedCards([]);
        }, 1000);
      }
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
          <h1 className="text-4xl font-bold gradient-text mb-4">Memory Match</h1>
          <div className="flex justify-center gap-8 text-white/70">
            <p>Coups : {moves}</p>
            <button
              onClick={initializeGame}
              className="text-white/70 hover:text-white transition-colors"
            >
              Nouvelle partie
            </button>
          </div>
        </div>

        <div className="glass-card p-8">
          <div className="grid grid-cols-4 gap-4">
            {cards.map((card) => (
              <div
                key={card.id}
                className="relative aspect-square perspective-1000"
              >
                <div
                  className={cn(
                    "w-full h-full transition-transform duration-500 transform-style-3d cursor-pointer",
                    card.isFlipped || card.isMatched ? "rotate-y-180" : ""
                  )}
                  onClick={() => handleCardClick(card.id)}
                >
                  {/* Face avant (cachée) */}
                  <div className="absolute w-full h-full backface-hidden bg-white/5 rounded-xl flex items-center justify-center text-2xl font-bold">
                    ?
                  </div>
                  {/* Face arrière (emoji) */}
                  <div className="absolute w-full h-full backface-hidden rotate-y-180 bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-xl flex items-center justify-center text-4xl">
                    {card.emoji}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {isWon && (
          <div className="text-center mt-8">
            <h2 className="text-2xl font-bold gradient-text mb-4">
              Félicitations ! 🎉
            </h2>
            <p className="text-white/70 mb-4">
              Tu as gagné en {moves} coups !
            </p>
            <button
              onClick={initializeGame}
              className="px-6 py-3 rounded-lg bg-gradient-to-r from-purple-500 to-blue-500 text-white font-semibold hover:opacity-90 transition-opacity"
            >
              Rejouer
            </button>
          </div>
        )}
      </div>
    </main>
  );
};

export default MemoryGame;
