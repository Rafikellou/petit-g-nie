import { FC } from 'react';
import Link from 'next/link';
import { characters } from '@/data/characters';

const CharactersPage: FC = () => {
  return (
    <main className="min-h-screen py-24">
      {/* Effets d'arrière-plan */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-50%] left-[-50%] w-[200%] h-[200%] bg-[radial-gradient(circle_at_center,rgba(0,242,195,0.03),transparent_70%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(108,99,255,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(108,99,255,0.05)_1px,transparent_1px)] bg-[size:14px_14px]" />
      </div>

      <div className="max-w-6xl mx-auto px-6 relative">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gradient mb-4">
            Choisis ton personnage
          </h1>
          <p className="text-xl text-white/70">
            Chaque personnage a ses propres histoires et aventures à partager
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {Object.values(characters).map((character) => (
            <Link
              key={character.id}
              href={`/characters/${character.id}`}
              className="glass-card p-8 hover:scale-[1.02] transition-transform duration-200"
            >
              <div className="h-full flex flex-col items-center">
                <div className={`w-32 h-32 rounded-full mb-6 bg-gradient-to-r ${character.gradient} flex items-center justify-center`}>
                  <span className={`text-6xl ${character.textColor}`}>
                    {character.image ? (
                      <img
                        src={character.image}
                        alt={character.name}
                        className="w-24 h-24 object-cover rounded-full"
                      />
                    ) : (
                      '👤'
                    )}
                  </span>
                </div>
                <h2 className="text-2xl font-bold mb-4 text-center">{character.name}</h2>
                <p className="text-white/70 text-center">{character.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
};

export default CharactersPage;
