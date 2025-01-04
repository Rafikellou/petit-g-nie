export type StoryThemeType = 
  | 'adventure'
  | 'magic'
  | 'science'
  | 'nature'
  | 'space'
  | 'fantasy'
  | 'animals';

export interface StoryTheme {
  id: StoryThemeType;
  name: string;
  description: string;
  icon: string;
  emoji: string;
}

export interface StoryPrompt {
  theme: StoryThemeType;
  idea: string;
  mainCharacter: {
    name: string;
    type?: string;
  };
  additionalDetails?: string;
  targetAgeRange?: {
    min: number;
    max: number;
  };
}

export interface StoryChallenge {
  id: string;
  title: string;
  description: string;
  theme: StoryThemeType;
  startDate: string;
  endDate: string;
  participants: number;
  prizes: {
    name: string;
    description: string;
    icon: string;
  }[];
}

export interface StoryIllustration {
  id: string;
  url: string;
  prompt: string;
  position: 'header' | 'middle' | 'end';
  style: 'cartoon' | 'watercolor' | 'pixel' | 'comic';
}

export interface StoryCollaborator {
  id: string;
  name: string;
  avatar?: string;
  role: 'author' | 'illustrator' | 'editor';
  contributions?: number;
}

export interface Story {
  id: string;
  title: string;
  description: string;
  content?: string;
  image: string;
  duration: string;
  difficulty: 'facile' | 'moyen' | 'avancé';
  audioUrl: string;
  createdAt?: string;
  isPublic?: boolean;
  likes?: number;
  theme?: StoryThemeType;
  character?: {
    id: string;
    name: string;
    image?: string;
    emoji?: string;
    gradient: string;
    textColor: string;
  };
}

export interface GeneratedStory {
  id: string;
  title: string;
  content: string;
  theme: StoryThemeType;
  mainCharacter: string;
  readingTime: string;
  createdAt: string;
  isPublic?: boolean;
  likes?: number;
  illustrations: StoryIllustration[];
  collaborators?: StoryCollaborator[];
  challengeId?: string;
  ageRecommendation?: {
    min: number;
    max: number;
  };
}

export interface StoryProgress {
  hasStarted: boolean;
  isCompleted: boolean;
  currentTime: number;
  quizUnlocked: boolean;
  lastUpdated?: string;
  score?: number;
}

export const STORY_THEMES: StoryTheme[] = [
  {
    id: 'adventure' as StoryThemeType,
    name: 'Aventure',
    description: 'Des histoires palpitantes remplies d\'action',
    icon: '🗺️',
    emoji: '🏞️'
  },
  {
    id: 'magic' as StoryThemeType,
    name: 'Magie',
    description: 'Un monde de sortilèges et de merveilles',
    icon: '✨',
    emoji: '⚡️'
  },
  {
    id: 'science' as StoryThemeType,
    name: 'Science',
    description: 'Découvre les mystères de la science',
    icon: '🔬',
    emoji: '🔭'
  },
  {
    id: 'nature' as StoryThemeType,
    name: 'Nature',
    description: 'Explore le monde naturel',
    icon: '🌿',
    emoji: '🌸'
  },
  {
    id: 'space' as StoryThemeType,
    name: 'Espace',
    description: 'Voyage à travers les étoiles',
    icon: '🚀',
    emoji: '👽'
  },
  {
    id: 'fantasy' as StoryThemeType,
    name: 'Fantaisie',
    description: 'Des mondes imaginaires extraordinaires',
    icon: '🐉',
    emoji: '🧚‍♀️'
  },
  {
    id: 'animals' as StoryThemeType,
    name: 'Animaux',
    description: 'Des histoires avec nos amis les bêtes',
    icon: '🦁',
    emoji: '🐶'
  }
];

export const ILLUSTRATION_STYLES = [
  {
    id: 'cartoon',
    name: 'Dessin animé',
    description: 'Style coloré et amusant',
    icon: '🎨'
  },
  {
    id: 'watercolor',
    name: 'Aquarelle',
    description: 'Style doux et artistique',
    icon: '🖌️'
  },
  {
    id: 'pixel',
    name: 'Pixel Art',
    description: 'Style rétro et jeux vidéo',
    icon: '👾'
  },
  {
    id: 'comic',
    name: 'Bande dessinée',
    description: 'Style BD et manga',
    icon: '💭'
  }
];

export const WEEKLY_CHALLENGES: StoryChallenge[] = [
  {
    id: 'challenge1',
    title: 'Le Voyage Interstellaire',
    description: 'Crée une histoire sur un voyage dans l\'espace avec un animal comme héros !',
    theme: 'space',
    startDate: '2024-12-01T00:00:00Z',
    endDate: '2024-12-07T23:59:59Z',
    participants: 42,
    prizes: [
      {
        name: 'Badge Explorateur Stellaire',
        description: 'Pour avoir créé une histoire spatiale unique',
        icon: '🚀'
      },
      {
        name: 'Points Bonus',
        description: '+100 points d\'expérience',
        icon: '⭐'
      }
    ]
  },
  {
    id: 'challenge2',
    title: 'La Forêt Enchantée',
    description: 'Imagine une aventure magique dans une forêt pleine de créatures fantastiques !',
    theme: 'magic',
    startDate: '2024-12-08T00:00:00Z',
    endDate: '2024-12-14T23:59:59Z',
    participants: 28,
    prizes: [
      {
        name: 'Badge Magicien des Mots',
        description: 'Pour avoir créé une histoire magique exceptionnelle',
        icon: '✨'
      },
      {
        name: 'Points Bonus',
        description: '+150 points d\'expérience',
        icon: '🌟'
      }
    ]
  }
];
