'use client';

import { FC, useState } from 'react';
import { Joke } from '@/data/jokes';
import { ThumbsUp, MessageCircle, Share2 } from 'lucide-react';
import confetti from 'canvas-confetti';

interface JokeCardProps {
  joke: Joke;
  onLike: (jokeId: string) => void;
}

export const JokeCard: FC<JokeCardProps> = ({ joke, onLike }) => {
  const [showAnswer, setShowAnswer] = useState(false);
  const [isLiked, setIsLiked] = useState(false);

  const handleReveal = () => {
    setShowAnswer(true);
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.8 }
    });
  };

  const handleLike = () => {
    if (!isLiked) {
      setIsLiked(true);
      onLike(joke.id);
    }
  };

  return (
    <div className="bg-white/10 rounded-lg p-6 backdrop-blur-sm transition-all hover:transform hover:scale-[1.02]">
      <div className="space-y-4">
        {/* Question */}
        <div className="text-xl font-medium text-white">
          {joke.question}
        </div>

        {/* Réponse */}
        {!showAnswer ? (
          <button
            onClick={handleReveal}
            className="w-full py-3 bg-purple-500 rounded-lg text-white font-medium hover:bg-purple-600 transition-colors"
          >
            Voir la réponse
          </button>
        ) : (
          <div className="space-y-4">
            <div className="text-lg text-yellow-300 font-medium animate-bounce">
              {joke.answer}
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between pt-4">
              <button
                onClick={handleLike}
                className={`flex items-center gap-2 px-3 py-1 rounded ${
                  isLiked ? 'text-pink-400' : 'text-white/70 hover:text-white'
                }`}
              >
                <ThumbsUp className="w-5 h-5" />
                <span>{joke.likes + (isLiked ? 1 : 0)}</span>
              </button>

              <div className="flex items-center gap-4">
                <button className="text-white/70 hover:text-white">
                  <MessageCircle className="w-5 h-5" />
                </button>
                <button className="text-white/70 hover:text-white">
                  <Share2 className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Catégorie et difficulté */}
            <div className="flex items-center gap-2 pt-2">
              <span className="px-2 py-1 bg-purple-500/20 text-purple-300 text-sm rounded">
                {joke.category}
              </span>
              <span className="px-2 py-1 bg-blue-500/20 text-blue-300 text-sm rounded">
                {joke.difficulty}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
