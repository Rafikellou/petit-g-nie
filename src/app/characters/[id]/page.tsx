import { FC } from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Play } from 'lucide-react';
import { characters } from '@/data/characters';
import type { Character } from '@/types/character';

interface Props {
  params: {
    id: string;
  };
}

const CharacterPage: FC<Props> = ({ params }) => {
  const character = characters[params.id];

  if (!character) {
    notFound();
  }

  return (
    <main className="min-h-screen py-24">
      {/* Effets d'arrière-plan */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-50%] left-[-50%] w-[200%] h-[200%] bg-[radial-gradient(circle_at_center,rgba(0,242,195,0.03),transparent_70%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(108,99,255,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(108,99,255,0.05)_1px,transparent_1px)] bg-[size:14px_14px]" />
      </div>

      <div className="max-w-6xl mx-auto px-6 relative">
        <Link
          href="/characters"
          className="inline-flex items-center text-white/70 hover:text-white mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Retour aux personnages
        </Link>

        <div className="flex flex-col md:flex-row items-center md:items-start gap-8 mb-16">
          <div className={`w-48 h-48 rounded-full bg-gradient-to-r ${character.gradient} flex items-center justify-center shrink-0`}>
            <span className={`text-8xl ${character.textColor}`}>
              {character.image ? (
                <img
                  src={character.image}
                  alt={character.name}
                  className="w-40 h-40 object-cover rounded-full"
                />
              ) : (
                '👤'
              )}
            </span>
          </div>

          <div>
            <h1 className="text-5xl font-bold text-gradient mb-4 text-center md:text-left">
              {character.name}
            </h1>
            <p className="text-xl text-white/70 text-center md:text-left">
              {character.description}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {character.stories.map((story) => (
            <Link
              key={story.id}
              href={`/stories/${character.id}/${story.id}`}
              className="glass-card p-6 hover:scale-[1.02] transition-transform duration-200"
            >
              <div className="aspect-video rounded-lg mb-4 overflow-hidden relative group">
                {story.image ? (
                  <img
                    src={story.image}
                    alt={story.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className={`w-full h-full bg-gradient-to-r ${character.gradient}`} />
                )}
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <Play className="w-12 h-12 text-white" />
                </div>
              </div>

              <h2 className="text-xl font-bold mb-2">{story.title}</h2>
              <p className="text-white/70 text-sm mb-4">{story.description}</p>

              <div className="flex items-center justify-between text-sm text-white/50">
                <span>{story.duration}</span>
                <span className={`
                  px-2 py-1 rounded
                  ${story.difficulty === 'facile' ? 'bg-green-500/20 text-green-400' : ''}
                  ${story.difficulty === 'moyen' ? 'bg-yellow-500/20 text-yellow-400' : ''}
                  ${story.difficulty === 'avancé' ? 'bg-red-500/20 text-red-400' : ''}
                `}>
                  {story.difficulty}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
};

export default CharacterPage;
