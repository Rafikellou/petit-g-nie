'use client';

import { FC } from 'react';
import { Sparkles } from 'lucide-react';
import { StoryThemeType } from '@/types/story';

interface StoryPromptSuggestionsProps {
  theme: StoryThemeType;
  onSelect: (prompt: string) => void;
}

const THEME_SUGGESTIONS: Record<StoryThemeType, string[]> = {
  adventure: [
    'Un enfant qui trouve une carte au trésor dans le grenier',
    'Une expédition pour sauver un animal rare',
    'La découverte d\'une île mystérieuse',
  ],
  magic: [
    'Un apprenti magicien qui fait ses premiers sorts',
    'Une baguette magique qui exauce les vœux à l\'envers',
    'Un chat qui peut parler avec la lune',
  ],
  science: [
    'Une machine à voyager dans le temps faite avec des jouets',
    'Un robot qui apprend à faire des gâteaux',
    'Une expérience scientifique qui tourne à l\'aventure',
  ],
  nature: [
    'Un arbre qui raconte des histoires aux oiseaux',
    'Un jardin secret qui pousse pendant la nuit',
    'Une abeille qui organise une fête des fleurs',
  ],
  space: [
    'Un vaisseau spatial fait de boîtes en carton',
    'Une rencontre avec une étoile filante',
    'Un astronaute qui découvre une planète en bonbons',
  ],
  fantasy: [
    'Un dragon qui collectionne les livres',
    'Une licorne qui fait des arcs-en-ciel',
    'Un elfe qui apprend à voler',
  ],
  animals: [
    'Un chaton qui veut devenir un lion',
    'Un pingouin qui rêve de danser',
    'Un ours qui ouvre une école de musique',
  ],
};

export const StoryPromptSuggestions: FC<StoryPromptSuggestionsProps> = ({
  theme,
  onSelect,
}) => {
  const suggestions = THEME_SUGGESTIONS[theme];

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold flex items-center gap-2">
        <Sparkles className="w-5 h-5 text-primary" />
        Suggestions d'histoires
      </h3>
      <div className="grid gap-3">
        {suggestions.map((prompt, index) => (
          <button
            key={index}
            onClick={() => onSelect(prompt)}
            className="text-left p-4 rounded-lg bg-white/5 hover:bg-white/10 transition-colors duration-200"
          >
            {prompt}
          </button>
        ))}
      </div>
    </div>
  );
};
