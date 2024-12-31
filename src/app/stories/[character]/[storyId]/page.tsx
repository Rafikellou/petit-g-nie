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
    <main className="min-h-screen py-24">
      <div className="max-w-4xl mx-auto px-6">
        <Link
          href="/histoires"
          className="inline-flex items-center text-white/70 hover:text-white mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Retour aux histoires
        </Link>

        <div className="glass-card p-8">
          <div className="flex items-start gap-8">
            <div className="relative w-64 h-64 rounded-xl overflow-hidden">
              <Image
                src={story.image}
                alt={story.title}
                fill
                className="object-cover"
              />
            </div>
            
            <div className="flex-1">
              <div className="flex items-center gap-4 mb-4">
                <Image
                  src={character.image}
                  alt={character.name}
                  width={48}
                  height={48}
                  className="rounded-full"
                />
                <h2 className="text-xl font-medium text-white/70">
                  {character.name}
                </h2>
              </div>

              <h1 className="text-4xl font-bold mb-4">{story.title}</h1>
              
              <div className="flex items-center gap-6 mb-6">
                <div className="px-3 py-1 rounded-full bg-white/10">
                  {story.duration}
                </div>
                <div className="px-3 py-1 rounded-full bg-white/10 capitalize">
                  {story.difficulty}
                </div>
              </div>

              <p className="text-lg text-white/70 mb-8">
                {story.description}
              </p>

              <button className="btn-modern">
                <span className="relative z-10">Commencer l'histoire</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
