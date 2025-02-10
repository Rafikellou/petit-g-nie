export interface StorySchema {
  id: string;
  title: string;
  description: string;
  content?: string;
  image: string;
  difficulty: 'facile' | 'moyen' | 'avancé';
  duration: string;
  characterId: string;
  theme?: StoryThemeType;
}

export type StoryThemeType = 'adventure' | 'magic' | 'science' | 'nature' | 'space' | 'fantasy' | 'animals';
