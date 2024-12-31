'use client';

import { FC, useState } from 'react';
import { Image as ImageIcon, RefreshCw, Download, Palette } from 'lucide-react';
import { StoryIllustration, ILLUSTRATION_STYLES } from '@/types/story';

interface StoryIllustratorProps {
  storyContent: string;
  onIllustrationGenerated: (illustration: StoryIllustration) => void;
}

export const StoryIllustrator: FC<StoryIllustratorProps> = ({
  storyContent,
  onIllustrationGenerated
}) => {
  const [selectedStyle, setSelectedStyle] = useState(ILLUSTRATION_STYLES[0].id);
  const [position, setPosition] = useState<'header' | 'middle' | 'end'>('header');
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentIllustration, setCurrentIllustration] = useState<StoryIllustration | null>(null);

  const generateIllustration = async () => {
    setIsGenerating(true);
    // Simuler la génération d'illustration
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const illustration: StoryIllustration = {
      id: Math.random().toString(36).substr(2, 9),
      url: 'https://picsum.photos/400/300', // Placeholder
      prompt: `Generate a ${selectedStyle} style illustration for: ${storyContent.substring(0, 100)}...`,
      position,
      style: selectedStyle as 'cartoon' | 'watercolor' | 'pixel' | 'comic'
    };

    setCurrentIllustration(illustration);
    onIllustrationGenerated(illustration);
    setIsGenerating(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-bold text-white">Ajouter une illustration</h3>
        <button
          onClick={generateIllustration}
          disabled={isGenerating}
          className="px-4 py-2 bg-purple-500 rounded flex items-center gap-2 hover:bg-purple-600 transition-colors disabled:opacity-50"
        >
          {isGenerating ? (
            <>
              <RefreshCw className="w-5 h-5 animate-spin" />
              Création en cours...
            </>
          ) : (
            <>
              <ImageIcon className="w-5 h-5" />
              Générer
            </>
          )}
        </button>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-white/70 mb-2">Style d'illustration</label>
          <div className="grid grid-cols-2 gap-2">
            {ILLUSTRATION_STYLES.map(style => (
              <button
                key={style.id}
                onClick={() => setSelectedStyle(style.id)}
                className={`p-3 rounded-lg text-left transition-all ${
                  selectedStyle === style.id
                    ? 'bg-purple-500'
                    : 'bg-white/5 hover:bg-white/10'
                }`}
              >
                <div className="text-2xl mb-1">{style.icon}</div>
                <div className="font-medium">{style.name}</div>
                <div className="text-xs text-white/70">{style.description}</div>
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-white/70 mb-2">Position dans l'histoire</label>
          <div className="space-y-2">
            {[
              { id: 'header', label: 'En-tête' },
              { id: 'middle', label: 'Milieu' },
              { id: 'end', label: 'Fin' }
            ].map(pos => (
              <button
                key={pos.id}
                onClick={() => setPosition(pos.id as 'header' | 'middle' | 'end')}
                className={`w-full p-3 rounded-lg text-left ${
                  position === pos.id
                    ? 'bg-purple-500'
                    : 'bg-white/5 hover:bg-white/10'
                }`}
              >
                {pos.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {currentIllustration && (
        <div className="bg-white/5 rounded-lg p-4">
          <div className="aspect-video rounded-lg overflow-hidden mb-4">
            <img
              src={currentIllustration.url}
              alt="Generated illustration"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Palette className="w-5 h-5 text-purple-400" />
              <span className="text-white/70">Style : {
                ILLUSTRATION_STYLES.find(s => s.id === currentIllustration.style)?.name
              }</span>
            </div>
            <button
              onClick={() => {/* TODO: Implement download */}}
              className="text-purple-400 hover:text-purple-300"
            >
              <Download className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
