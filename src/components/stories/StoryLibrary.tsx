'use client'

import { FC } from 'react';
import Image from 'next/image';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import Link from 'next/link';
import { BookOpen } from 'lucide-react';
import { CharacterStory } from '@/types/story-types';

const DEFAULT_STORY_IMAGE = '/images/story-placeholder.jpg';
const DEFAULT_AVATAR_IMAGE = '/images/avatar-placeholder.jpg';

export const StoryImage = ({ src, alt, width, height, className }: { 
  src: string, 
  alt: string, 
  width: number, 
  height: number, 
  className: string 
}) => {
  return (
    <Image
      src={src || DEFAULT_STORY_IMAGE}
      alt={alt}
      width={width}
      height={height}
      className={className}
      priority={true}
      unoptimized={true}
      onError={(e) => {
        const target = e.target as HTMLImageElement;
        target.src = DEFAULT_STORY_IMAGE;
      }}
    />
  );
};

export const CharacterImage = ({ src, alt, width, height, className }: {
  src: string,
  alt: string,
  width: number,
  height: number,
  className: string
}) => {
  return (
    <Image
      src={src || DEFAULT_AVATAR_IMAGE}
      alt={alt}
      width={width}
      height={height}
      className={className}
      onError={(e) => {
        const target = e.target as HTMLImageElement;
        target.src = DEFAULT_AVATAR_IMAGE;
      }}
    />
  );
};

export const StoryCard: FC<{ story: CharacterStory; index: number }> = ({ story, index }) => {
  return (
    <div className="glass-card p-8 hover:scale-[1.02] transition-transform duration-200">
      <Link href={`/stories/${story.character.id}/${story.id}`}>
        <div className="aspect-video rounded-lg mb-4 overflow-hidden relative group">
          {story.image ? (
            <StoryImage
              src={story.image}
              alt={story.title}
              width={640}
              height={360}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className={`w-full h-full bg-gradient-to-r ${story.character.gradient}`} />
          )}
          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <BookOpen className="w-12 h-12 text-white" />
          </div>
        </div>

        <div className="mb-4">
          <h2 className="text-xl font-bold mb-2">{story.title}</h2>
          <p className="text-white/70 text-sm">{story.description}</p>
        </div>

        <div className="flex items-center justify-between text-sm text-white/50">
          <div className="flex items-center gap-2">
            <CharacterImage
              src={story.character.image}
              alt={story.character.name}
              width={32}
              height={32}
              className="w-6 h-6 rounded-full"
            />
            <span>{story.character.name}</span>
          </div>
          <div className="flex items-center gap-4">
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
        </div>
      </Link>
    </div>
  );
};
