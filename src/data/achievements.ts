export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  requirement: {
    type: 'stories_completed' | 'quiz_score' | 'total_time' | 'character_completed';
    value: number;
    characterId?: string;
  };
  gradient: string;
}

export interface Level {
  level: number;
  name: string;
  requiredXP: number;
  gradient: string;
}

export const badges: Badge[] = [
  // Badges généraux
  {
    id: 'first_story',
    name: 'Première Histoire',
    description: 'Tu as écouté ta première histoire !',
    icon: '📖',
    requirement: {
      type: 'stories_completed',
      value: 1
    },
    gradient: 'from-blue-500 to-purple-500'
  },
  {
    id: 'story_master',
    name: 'Maître des Histoires',
    description: 'Tu as écouté 10 histoires différentes !',
    icon: '🎭',
    requirement: {
      type: 'stories_completed',
      value: 10
    },
    gradient: 'from-purple-500 to-pink-500'
  },
  {
    id: 'quiz_genius',
    name: 'Génie des Quiz',
    description: 'Tu as obtenu 100% à 5 quiz différents !',
    icon: '🎯',
    requirement: {
      type: 'quiz_score',
      value: 5
    },
    gradient: 'from-green-500 to-emerald-500'
  },
  {
    id: 'dedicated_listener',
    name: 'Auditeur Passionné',
    description: 'Tu as passé plus de 2 heures à écouter des histoires !',
    icon: '🎧',
    requirement: {
      type: 'total_time',
      value: 7200 // en secondes
    },
    gradient: 'from-yellow-500 to-orange-500'
  },

  // Badges spécifiques aux personnages
  {
    id: 'anna_friend',
    name: 'Ami d\'Anna',
    description: 'Tu as terminé toutes les histoires d\'Anna !',
    icon: '🌟',
    requirement: {
      type: 'character_completed',
      value: 1,
      characterId: 'anna'
    },
    gradient: 'from-purple-500 to-pink-500'
  },
  {
    id: 'max_apprentice',
    name: 'Apprenti de Max',
    description: 'Tu as terminé toutes les histoires de Max !',
    icon: '🔮',
    requirement: {
      type: 'character_completed',
      value: 1,
      characterId: 'max'
    },
    gradient: 'from-blue-500 to-cyan-500'
  },
  {
    id: 'sophie_assistant',
    name: 'Assistant de Sophie',
    description: 'Tu as terminé toutes les histoires de Sophie !',
    icon: '🔬',
    requirement: {
      type: 'character_completed',
      value: 1,
      characterId: 'sophie'
    },
    gradient: 'from-green-500 to-teal-500'
  }
];

export const levels: Level[] = [
  {
    level: 1,
    name: 'Apprenti Lecteur',
    requiredXP: 0,
    gradient: 'from-blue-500 to-purple-500'
  },
  {
    level: 2,
    name: 'Lecteur Curieux',
    requiredXP: 100,
    gradient: 'from-purple-500 to-pink-500'
  },
  {
    level: 3,
    name: 'Explorateur d\'Histoires',
    requiredXP: 300,
    gradient: 'from-pink-500 to-red-500'
  },
  {
    level: 4,
    name: 'Aventurier des Mots',
    requiredXP: 600,
    gradient: 'from-red-500 to-orange-500'
  },
  {
    level: 5,
    name: 'Maître Conteur',
    requiredXP: 1000,
    gradient: 'from-orange-500 to-yellow-500'
  }
];

export const calculateXP = (progress: any): number => {
  let xp = 0;
  
  // XP pour les histoires terminées
  xp += progress.storiesCompleted * 20;
  
  // XP pour les quiz réussis
  Object.values(progress.quizScores || {}).forEach((score: any) => {
    if (score >= 80) xp += 30;
    else if (score >= 50) xp += 15;
  });
  
  // XP pour le temps d'écoute (1 XP par minute)
  xp += Math.floor(progress.totalListeningTime / 60);
  
  return xp;
};
