import { FC } from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { characters } from '@/data/characters';

const CharactersPage: FC = () => {
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
            <h1 className="text-xl font-bold">Personnages</h1>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="text-center mb-8">
          <h2 className="text-2xl md:text-3xl font-bold mb-2">
            Choisis ton personnage
          </h2>
          <p className="text-white/70">
            Chaque personnage a ses propres histoires et aventures à partager
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Object.values(characters).map((character) => (
            <Link
              key={character.id}
              href={`/stories/${character.id}`}
              className="glass-card p-6 hover:bg-white/5 transition tap-target touch-manipulation"
            >
              <div className="aspect-square rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center mb-4">
                {character.emoji && (
                  <span className="text-6xl">{character.emoji}</span>
                )}
              </div>
              <h3 className="text-xl font-bold mb-2">{character.name}</h3>
              <p className="text-white/70">{character.description}</p>
              <div className="mt-4 flex items-center space-x-2">
                <div className="px-3 py-1 rounded-full bg-white/10 text-sm">
                  {character.stories?.length || 0} histoires
                </div>
                <div className="px-3 py-1 rounded-full bg-white/10 text-sm">
                  Niveau {character.level}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
};

export default CharactersPage;
