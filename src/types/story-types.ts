import { Story as BaseStory } from '@/types/story';

/**
 * Represents a story that is associated with a character.
 * All properties from the base Story interface are required,
 * plus a required character property.
 */
export interface CharacterStory extends Omit<BaseStory, 'character'> {
  character: {
    id: string;
    name: string;
    image?: string;
    emoji?: string;
    gradient: string;
    textColor: string;
  };
}
