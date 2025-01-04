'use client';

import { useState, useEffect } from 'react';
import { Smile, ThumbsUp, Filter, Sparkles, Send, ArrowLeft, Loader2 } from 'lucide-react';
import { MOCK_JOKES, Joke } from '@/data/jokes';
import confetti from 'canvas-confetti';
import Link from 'next/link';
import { Button } from '@/components/ui/ios-button';

export default function JokesPage() {
  const [jokes, setJokes] = useState<Joke[]>(MOCK_JOKES);
  const [selectedJoke, setSelectedJoke] = useState<Joke | null>(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const [filters, setFilters] = useState({
    category: 'all',
    difficulty: 'all',
    ageRange: 'all'
  });
  const [newJoke, setNewJoke] = useState({
    question: '',
    answer: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleJokeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newJoke.question || !newJoke.answer) return;

    setIsSubmitting(true);
    try {
      // Simuler un délai d'envoi
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const joke: Joke = {
        id: String(jokes.length + 1),
        question: newJoke.question,
        answer: newJoke.answer,
        category: 'custom',
        difficulty: 'medium',
        ageRange: '7-12',
        likes: 0
      };

      setJokes(prev => [joke, ...prev]);
      setNewJoke({ question: '', answer: '' });
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    } finally {
      setIsSubmitting(false);
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
            <h1 className="text-xl font-bold">Blagues</h1>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">
        {/* Filtres */}
        <div className="glass-card p-6">
          <div className="flex items-center space-x-2 mb-4">
            <Filter className="w-5 h-5" />
            <h2 className="text-lg font-medium">Filtres</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <select 
              value={filters.category}
              onChange={(e) => setFilters(prev => ({ ...prev, category: e.target.value }))}
              className="bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white min-h-[44px]"
            >
              <option value="all">Toutes les catégories</option>
              <option value="animaux">Animaux</option>
              <option value="ecole">École</option>
              <option value="sport">Sport</option>
            </select>
            <select 
              value={filters.difficulty}
              onChange={(e) => setFilters(prev => ({ ...prev, difficulty: e.target.value }))}
              className="bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white min-h-[44px]"
            >
              <option value="all">Toutes les difficultés</option>
              <option value="easy">Facile</option>
              <option value="medium">Moyen</option>
              <option value="hard">Difficile</option>
            </select>
            <select 
              value={filters.ageRange}
              onChange={(e) => setFilters(prev => ({ ...prev, ageRange: e.target.value }))}
              className="bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white min-h-[44px]"
            >
              <option value="all">Tous les âges</option>
              <option value="5-7">5-7 ans</option>
              <option value="7-12">7-12 ans</option>
              <option value="12+">12+ ans</option>
            </select>
          </div>
        </div>

        {/* Formulaire d'ajout */}
        <div className="glass-card p-6">
          <div className="flex items-center space-x-2 mb-4">
            <Sparkles className="w-5 h-5" />
            <h2 className="text-lg font-medium">Ajouter une blague</h2>
          </div>
          <form onSubmit={handleJokeSubmit} className="space-y-4">
            <div>
              <label htmlFor="question" className="block text-sm font-medium mb-2">
                Question
              </label>
              <input
                id="question"
                type="text"
                value={newJoke.question}
                onChange={(e) => setNewJoke(prev => ({ ...prev, question: e.target.value }))}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent min-h-[44px]"
                placeholder="Quelle est votre blague ?"
                required
              />
            </div>
            <div>
              <label htmlFor="answer" className="block text-sm font-medium mb-2">
                Réponse
              </label>
              <input
                id="answer"
                type="text"
                value={newJoke.answer}
                onChange={(e) => setNewJoke(prev => ({ ...prev, answer: e.target.value }))}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent min-h-[44px]"
                placeholder="La réponse..."
                required
              />
            </div>
            <Button
              type="submit"
              className="w-full min-h-[44px] flex items-center justify-center space-x-2"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  <Send className="w-5 h-5" />
                  <span>Ajouter la blague</span>
                </>
              )}
            </Button>
          </form>
        </div>

        {/* Liste des blagues */}
        <div className="space-y-4">
          {jokes.map(joke => (
            <div 
              key={joke.id}
              className="glass-card p-6 hover:bg-white/5 transition cursor-pointer tap-target touch-manipulation"
              onClick={() => {
                setSelectedJoke(joke);
                setShowAnswer(false);
              }}
            >
              <p className="text-lg mb-2">{joke.question}</p>
              {selectedJoke?.id === joke.id && showAnswer && (
                <p className="text-primary font-medium mt-4">{joke.answer}</p>
              )}
              <div className="flex items-center justify-between mt-4">
                <Button
                  onClick={(e) => {
                    e.stopPropagation();
                    if (selectedJoke?.id === joke.id) {
                      setShowAnswer(!showAnswer);
                    } else {
                      setSelectedJoke(joke);
                      setShowAnswer(true);
                    }
                  }}
                  className="min-h-[44px]"
                >
                  {selectedJoke?.id === joke.id && showAnswer ? 'Cacher' : 'Voir la réponse'}
                </Button>
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    setJokes(prev => 
                      prev.map(j => 
                        j.id === joke.id ? { ...j, likes: j.likes + 1 } : j
                      )
                    );
                  }}
                  className="p-2 hover:bg-white/10 rounded-full transition tap-target touch-manipulation"
                  aria-label="J'aime cette blague"
                >
                  <ThumbsUp className="w-6 h-6" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
