'use client';

import { useParams } from 'next/navigation';
import { characters } from '@/data/characters';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import dynamic from 'next/dynamic';

const StoryContent = dynamic(() => import('./StoryContent'), { 
  loading: () => (
    <div className="flex justify-center">
      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-white/70"></div>
    </div>
  )
});

export default function StoryPage() {
  const params = useParams();
  const characterId = params.character as string;
  const storyId = params.storyId as string;

  const character = characters[characterId];
  if (!character) {
    throw new Error(`Character ${characterId} not found`);
  }

  const currentStoryIndex = character.stories.findIndex(s => s.id === storyId);
  if (currentStoryIndex === -1) {
    throw new Error(`Story ${storyId} not found for character ${characterId}`);
  }

  const story = character.stories[currentStoryIndex];
  const nextStory = character.stories[currentStoryIndex + 1];

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

        <div className="glass-card p-4 sm:p-8 mb-8">
          <div className="flex flex-col sm:flex-row sm:items-start gap-4 sm:gap-8">
            <div className="relative w-full sm:w-64 h-48 sm:h-64 rounded-xl overflow-hidden shrink-0">
              <Image
                src={story.image}
                alt={story.title}
                fill
                className="object-cover"
                priority
              />
            </div>
            
            <div className="flex-1 min-w-0">
              <h1 className="text-2xl sm:text-4xl font-bold mb-3 sm:mb-4">{story.title}</h1>
              
              <div className="flex flex-wrap items-center gap-3 mb-4 sm:mb-6">
                <div className="px-3 py-1 rounded-full bg-white/10 text-sm">
                  {story.duration}
                </div>
                <div className="px-3 py-1 rounded-full bg-white/10 capitalize text-sm">
                  {story.difficulty}
                </div>
              </div>

              <p className="text-base sm:text-lg text-white/70">
                {story.description}
              </p>
            </div>
          </div>
        </div>

        <div className="glass-card p-4 sm:p-8">
          <StoryContent characterId={characterId} storyId={storyId} />
        </div>

        {nextStory && (
          <div className="flex justify-center mt-8">
            <Link
              href={`/histoires/${characterId}/${nextStory.id}`}
              className="btn-modern inline-flex items-center gap-2"
            >
              <span>Prochain épisode</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        )}
      </div>
    </main>
  );
}
