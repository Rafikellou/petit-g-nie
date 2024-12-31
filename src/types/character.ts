import { CharacterStory } from '@/types/story-types';

export interface Character {
  id: string;
  name: string;
  description: string;
  image: string;
  gradient: string;
  textColor: string;
  emoji?: string;
  stories: CharacterStory[];
}
