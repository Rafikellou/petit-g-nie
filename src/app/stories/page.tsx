'use client';

import { useState } from 'react';
import Link from 'next/link';
import { characters } from '@/data/characters';
import { StoryCard } from '@/components/stories/StoryLibrary';
import { ArrowLeft, Search, BookOpen, Clock, Star } from 'lucide-react';
import type { CharacterStory } from '@/types/story-types';

export default function Histoires() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string | null>(null);

  const allStories = Object.values(characters).flatMap(character =>
    character.stories.map(story => ({
      ...story,
      character,
    }))
  );

  const filteredStories = allStories.filter(story => {
    const matchesSearch = story.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         story.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDifficulty = !selectedDifficulty || story.difficulty === selectedDifficulty;
    return matchesSearch && matchesDifficulty;
  });

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
            <h1 className="text-xl font-bold">Histoires</h1>
          </div>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 sm:px-6 py-8">
        {/* Barre de recherche */}
        <div className="glass-card p-4 mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/40" />
            <input
              type="text"
              placeholder="Rechercher une histoire..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-lg pl-10 pr-4 py-3 text-white placeholder-white/40 focus:outline-none focus:border-primary transition-colors"
            />
          </div>
        </div>

        {/* Filtres */}
        <div className="flex gap-2 mb-6 overflow-x-auto hide-scrollbar py-2">
          {['facile', 'moyen', 'avancé'].map((difficulty) => (
            <button
              key={difficulty}
              onClick={() => setSelectedDifficulty(selectedDifficulty === difficulty ? null : difficulty)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-full border transition tap-target touch-manipulation whitespace-nowrap ${
                selectedDifficulty === difficulty
                  ? 'bg-primary/20 border-primary text-primary'
                  : 'border-white/10 text-white/60 hover:border-white/30'
              }`}
            >
              <Star className="w-4 h-4" />
              <span className="capitalize">{difficulty}</span>
            </button>
          ))}
        </div>

        {/* Liste des histoires */}
        <div className="space-y-4">
          {filteredStories.map((story, index) => (
            <Link
              key={story.id}
              href={`/stories/${story.character.id}/${story.id}`}
              className="block"
            >
              <div className="glass-card p-4 hover:bg-white/5 transition tap-target touch-manipulation">
                <div className="flex gap-4">
                  <div className="w-24 h-24 rounded-lg overflow-hidden flex-shrink-0">
                    {story.image ? (
                      <img
                        src={story.image}
                        alt={story.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className={`w-full h-full bg-gradient-to-r ${story.character.gradient} flex items-center justify-center`}>
                        <BookOpen className="w-8 h-8 text-white/40" />
                      </div>
                    )}
                  </div>
                  <div className="flex-grow">
                    <h2 className="text-lg font-medium mb-1">{story.title}</h2>
                    <p className="text-white/70 text-sm line-clamp-2 mb-2">{story.description}</p>
                    <div className="flex items-center gap-4 text-sm text-white/60">
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        <span>{story.duration}</span>
                      </div>
                      <div className={`flex items-center gap-1 ${
                        story.difficulty === 'facile' ? 'text-green-400' :
                        story.difficulty === 'moyen' ? 'text-yellow-400' :
                        'text-red-400'
                      }`}>
                        <Star className="w-4 h-4" />
                        <span className="capitalize">{story.difficulty}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))}

          {filteredStories.length === 0 && (
            <div className="text-center py-12">
              <BookOpen className="w-12 h-12 text-white/20 mx-auto mb-4" />
              <p className="text-white/60">Aucune histoire ne correspond à votre recherche</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
