import { useState, useEffect } from 'react';
import { badges, levels, calculateXP } from '@/data/achievements';

interface QuizResult {
  score: number;
  subject: string;
  date: string;
}

interface Progress {
  storiesCompleted: number;
  generatedStories: number;
  viewedJokes: number;
  quizResults: QuizResult[];
  totalListeningTime: number;
  characterProgress: Record<string, {
    storiesCompleted: number;
    totalStories: number;
  }>;
  earnedBadges: string[];
  currentLevel: number;
  currentXP: number;
  dailyLearningTime: {
    date: string;
    minutes: number;
  }[];
}

const DEFAULT_PROGRESS: Progress = {
  storiesCompleted: 0,
  generatedStories: 0,
  viewedJokes: 0,
  quizResults: [],
  totalListeningTime: 0,
  characterProgress: {},
  earnedBadges: [],
  currentLevel: 1,
  currentXP: 0,
  dailyLearningTime: [],
};

export const useProgress = () => {
  const [progress, setProgress] = useState<Progress>(DEFAULT_PROGRESS);

  useEffect(() => {
    // Charger la progression depuis le localStorage
    const loadProgress = () => {
      const savedProgress = localStorage.getItem('user-progress');
      if (savedProgress) {
        setProgress(JSON.parse(savedProgress));
      }
    };

    loadProgress();
  }, []);

  const saveProgress = (newProgress: Progress) => {
    localStorage.setItem('user-progress', JSON.stringify(newProgress));
    setProgress(newProgress);
  };

  const updateProgress = (updates: Partial<Progress>) => {
    const newProgress = { ...progress, ...updates };
    // Calculer XP
    newProgress.currentXP = calculateXP(newProgress);
    // Mettre à jour le niveau
    for (const level of levels) {
      if (newProgress.currentXP >= level.requiredXP) {
        newProgress.currentLevel = level.level;
      }
    }
    // Vérifier les nouveaux badges
    const newBadges = badges.filter(badge => {
      if (newProgress.earnedBadges.includes(badge.id)) return false;

      switch (badge.requirement.type) {
        case 'stories_completed':
          return newProgress.storiesCompleted >= badge.requirement.value;
        
        case 'quiz_score':
          const perfectScores = newProgress.quizResults.filter(result => result.score === 100).length;
          return perfectScores >= badge.requirement.value;
        
        case 'total_time':
          return newProgress.totalListeningTime >= badge.requirement.value;
        
        case 'character_completed':
          const charProgress = newProgress.characterProgress[badge.requirement.characterId || ''];
          return charProgress && 
                 charProgress.storiesCompleted === charProgress.totalStories;
        
        default:
          return false;
      }
    });

    if (newBadges.length > 0) {
      newProgress.earnedBadges = [...newProgress.earnedBadges, ...newBadges.map(b => b.id)];
    }

    saveProgress(newProgress);
  };

  // Calculer le taux de bonnes réponses pour les 7 derniers jours par matière
  const getQuizScoresBySubject = (subject?: string) => {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const recentResults = progress.quizResults.filter(result => 
      new Date(result.date) >= sevenDaysAgo &&
      (!subject || result.subject === subject)
    );

    if (recentResults.length === 0) return 0;

    const averageScore = recentResults.reduce((sum, result) => sum + result.score, 0) / recentResults.length;
    return Math.round(averageScore);
  };

  // Calculer le temps d'apprentissage pour les 7 derniers jours
  const getLearningTimeData = () => {
    const days = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'];
    const today = new Date();
    const data = [];

    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      
      const dayData = progress.dailyLearningTime.find(d => d.date === dateStr);
      data.push({
        day: days[date.getDay()],
        value: dayData?.minutes || 0,
        label: `${days[date.getDay()]} : ${dayData?.minutes || 0} minutes d'apprentissage`
      });
    }

    return data;
  };

  return {
    progress,
    updateProgress,
    getQuizScoresBySubject,
    getLearningTimeData,
  };
};
