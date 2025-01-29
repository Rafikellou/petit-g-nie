'use client';

import { useState, useEffect } from 'react';

interface StoryContentProps {
  characterId: string;
  storyId: string;
}

export default function StoryContent({ characterId, storyId }: StoryContentProps) {
  const [storyContent, setStoryContent] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStoryContent = async () => {
      try {
        const response = await fetch(`https://rgddalgzstcoysrcdetw.supabase.co/storage/v1/object/public/stories/${characterId}-et-${storyId}/${characterId}-et-${storyId}.txt`);
        if (!response.ok) {
          throw new Error(`Failed to fetch story content: ${response.statusText}`);
        }
        const text = await response.text();
        setStoryContent(text);
      } catch (error) {
        console.error('Error loading story:', error);
        setStoryContent('Désolé, une erreur est survenue lors du chargement de l\'histoire.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchStoryContent();
  }, [characterId, storyId]);

  if (isLoading) {
    return (
      <div className="flex justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-white/70"></div>
      </div>
    );
  }

  return (
    <div className="prose prose-invert max-w-none">
      {storyContent.split('\n').map((paragraph, index) => (
        paragraph.trim() && (
          <p key={index} className="text-white/90 leading-relaxed mb-4">
            {paragraph}
          </p>
        )
      ))}
    </div>
  );
}
