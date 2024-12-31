import { useState, useEffect } from 'react';

interface StoryProgress {
  hasStarted: boolean;
  isCompleted: boolean;
  currentTime: number;
  quizUnlocked: boolean;
}

export const useStoryProgress = (characterId: string, storyId: string) => {
  const [progress, setProgress] = useState<StoryProgress>(() => {
    // Charger la progression depuis le localStorage
    const saved = localStorage.getItem(`story-progress-${characterId}-${storyId}`);
    return saved ? JSON.parse(saved) : {
      hasStarted: false,
      isCompleted: false,
      currentTime: 0,
      quizUnlocked: false
    };
  });

  // Sauvegarder la progression dans le localStorage
  useEffect(() => {
    localStorage.setItem(
      `story-progress-${characterId}-${storyId}`,
      JSON.stringify(progress)
    );
  }, [progress, characterId, storyId]);

  const updateProgress = (updates: Partial<StoryProgress>) => {
    setProgress(prev => ({ ...prev, ...updates }));
  };

  const startStory = () => {
    updateProgress({ hasStarted: true });
  };

  const completeStory = () => {
    updateProgress({
      isCompleted: true,
      quizUnlocked: true
    });
  };

  const updateTime = (time: number) => {
    updateProgress({ currentTime: time });
  };

  return {
    progress,
    startStory,
    completeStory,
    updateTime
  };
};
