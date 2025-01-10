'use client';

import { useParams } from 'next/navigation';
import { characters } from '@/data/characters';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function StoryPage() {
  const params = useParams();
  const characterId = params.character as string;
  const storyId = params.storyId as string;

  const character = characters[characterId];
  if (!character) {
    throw new Error(`Character ${characterId} not found`);
  }

  const story = character.stories.find(s => s.id === storyId);
  if (!story) {
    throw new Error(`Story ${storyId} not found for character ${characterId}`);
  }

  return (
    <main className="min-h-screen pt-safe-top pb-safe-bottom">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <Link
          href="/histoires"
          className="inline-flex items-center text-white/70 hover:text-white my-4 sm:my-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Retour aux histoires
        </Link>

        <div className="glass-card p-4 sm:p-8">
          <div className="flex flex-col sm:flex-row sm:items-start gap-4 sm:gap-8">
            <div className="relative w-full sm:w-64 h-48 sm:h-64 rounded-xl overflow-hidden">
              <Image
                src={story.image}
                alt={story.title}
                fill
                className="object-cover"
                priority
              />
            </div>
            
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-3 sm:mb-4">
                <Image
                  src={character.image}
                  alt={character.name}
                  width={40}
                  height={40}
                  className="rounded-full"
                />
                <h2 className="text-lg sm:text-xl font-medium text-white/70">
                  {character.name}
                </h2>
              </div>

              <h1 className="text-2xl sm:text-4xl font-bold mb-3 sm:mb-4">{story.title}</h1>
              
              <div className="flex flex-wrap items-center gap-3 mb-4 sm:mb-6">
                <div className="px-3 py-1 rounded-full bg-white/10 text-sm">
                  {story.duration}
                </div>
                <div className="px-3 py-1 rounded-full bg-white/10 capitalize text-sm">
                  {story.difficulty}
                </div>
              </div>

              <p className="text-base sm:text-lg text-white/70 mb-6 sm:mb-8">
                {story.description}
              </p>

              <button className="w-full sm:w-auto btn-modern">
                <span className="relative z-10">Commencer l'histoire</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
