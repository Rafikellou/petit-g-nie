'use client';

import { useState, useEffect } from 'react';
import { Smile, ThumbsUp, Filter, Sparkles, Send } from 'lucide-react';
import { MOCK_JOKES, Joke } from '@/data/jokes';
import confetti from 'canvas-confetti';

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

  const handleJokeReveal = () => {
    setShowAnswer(true);
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });
  };

  const handleLike = (jokeId: string) => {
    setJokes(prevJokes =>
      prevJokes.map(joke =>
        joke.id === jokeId
          ? { ...joke, likes: joke.likes + 1 }
          : joke
      )
    );
  };

  const getRandomJoke = () => {
    const filteredJokes = jokes.filter(joke => {
      if (filters.category !== 'all' && joke.category !== filters.category) return false;
      if (filters.difficulty !== 'all' && joke.difficulty !== filters.difficulty) return false;
      return true;
    });

    const randomJoke = filteredJokes[Math.floor(Math.random() * filteredJokes.length)];
    setSelectedJoke(randomJoke);
    setShowAnswer(false);
  };

  const submitNewJoke = () => {
    if (newJoke.question && newJoke.answer) {
      const joke: Joke = {
        id: String(jokes.length + 1),
        question: newJoke.question,
        answer: newJoke.answer,
        category: 'general',
        difficulty: 'easy',
        ageRange: { min: 6, max: 12 },
        likes: 0,
        isApproved: false
      };
      setJokes(prev => [...prev, joke]);
      setNewJoke({ question: '', answer: '' });
      alert('Merci ! Ta blague a été soumise et sera examinée par nos modérateurs.');
    }
  };

  useEffect(() => {
    getRandomJoke();
  }, [filters]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="container mx-auto p-8 space-y-8">
      {/* En-tête */}
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">
          La Boîte à Blagues
        </h1>
        <p className="text-white/70">
          Découvre et partage des blagues amusantes et éducatives !
        </p>
      </div>

      {/* Filtres */}
      <div className="card">
        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-white/70" />
            <select
              className="input"
              value={filters.category}
              onChange={(e) => setFilters(prev => ({ ...prev, category: e.target.value }))}
            >
              <option value="all">Toutes les catégories</option>
              <option value="math">Mathématiques</option>
              <option value="science">Sciences</option>
              <option value="language">Langue</option>
              <option value="general">Général</option>
            </select>
          </div>
          <div>
            <select
              className="input"
              value={filters.difficulty}
              onChange={(e) => setFilters(prev => ({ ...prev, difficulty: e.target.value }))}
            >
              <option value="all">Toutes les difficultés</option>
              <option value="easy">Facile</option>
              <option value="medium">Moyen</option>
              <option value="hard">Difficile</option>
            </select>
          </div>
        </div>
      </div>

      {/* Blague actuelle */}
      {selectedJoke && (
        <div className="card text-center space-y-6">
          <div className="text-2xl font-medium">
            {selectedJoke.question}
          </div>
          
          {!showAnswer ? (
            <button
              onClick={handleJokeReveal}
              className="btn-primary"
            >
              Voir la réponse
            </button>
          ) : (
            <div className="space-y-4">
              <div className="text-xl text-yellow-300 font-medium animate-fade-in">
                {selectedJoke.answer}
              </div>
              <div className="flex justify-center gap-4">
                <button
                  onClick={() => handleLike(selectedJoke.id)}
                  className="btn-secondary"
                >
                  <ThumbsUp className="w-5 h-5" />
                  <span>{selectedJoke.likes}</span>
                </button>
                <button
                  onClick={getRandomJoke}
                  className="btn-primary"
                >
                  <Sparkles className="w-5 h-5" />
                  Une autre !
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Soumettre une blague */}
      <div className="card">
        <h3 className="text-xl font-bold mb-4">
          Tu as une blague à partager ?
        </h3>
        <div className="space-y-4">
          <div>
            <label className="block text-white/70 mb-2">Ta question</label>
            <input
              type="text"
              value={newJoke.question}
              onChange={(e) => setNewJoke(prev => ({ ...prev, question: e.target.value }))}
              placeholder="Pourquoi... ?"
              className="input w-full"
            />
          </div>
          <div>
            <label className="block text-white/70 mb-2">Ta réponse</label>
            <input
              type="text"
              value={newJoke.answer}
              onChange={(e) => setNewJoke(prev => ({ ...prev, answer: e.target.value }))}
              placeholder="Parce que... !"
              className="input w-full"
            />
          </div>
          <button
            onClick={submitNewJoke}
            disabled={!newJoke.question || !newJoke.answer}
            className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="w-5 h-5" />
            Envoyer ma blague
          </button>
        </div>
      </div>
    </div>
  );
}
