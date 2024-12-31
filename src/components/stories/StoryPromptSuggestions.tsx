'use client';

import { FC } from 'react';
import { Sparkles } from 'lucide-react';
import { StoryTheme } from '@/types/story';

interface StoryPromptSuggestionsProps {
  theme: StoryTheme;
  onSelect: (prompt: string) => void;
}

const THEME_SUGGESTIONS: Record<StoryTheme, string[]> = {
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
    'Un vaisseau spatial fait de bonbons',
    'Une planète où il pleut des arc-en-ciel',
    'Un extraterrestre qui cherche son doudou',
  ],
  fantasy: [
    'Un dragon qui a peur du feu',
    'Une licorne qui collectionne les chaussettes',
    'Un géant qui veut devenir danseur étoile',
  ],
  animals: [
    'Un chaton qui rêve de devenir pompier',
    'Une famille de souris qui vit dans un piano',
    'Un pingouin qui veut apprendre à voler',
  ],
};

export const StoryPromptSuggestions: FC<StoryPromptSuggestionsProps> = ({
  theme,
  onSelect,
}) => {
  return (
    <div className="mt-4">
      <div className="text-sm text-white/70 mb-2">Suggestions magiques :</div>
      <div className="space-y-2">
        {THEME_SUGGESTIONS[theme].map((suggestion, index) => (
          <button
            key={index}
            onClick={() => onSelect(suggestion)}
            className="w-full text-left p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-colors flex items-center gap-2 group"
          >
            <Sparkles className="w-4 h-4 text-purple-400 opacity-0 group-hover:opacity-100 transition-opacity" />
            <span className="text-white/90">{suggestion}</span>
          </button>
        ))}
      </div>
    </div>
  );
};
