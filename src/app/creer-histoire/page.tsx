'use client';

import { useState } from 'react';
import { Wand2, BookOpen, Save, Volume2, Share2, Sparkles, Trophy, ArrowLeft, Loader2 } from 'lucide-react';
import { StoryTheme, StoryPrompt, GeneratedStory, STORY_THEMES, StoryChallenge, StoryIllustration, StoryCollaborator } from '@/types/story';
import confetti from 'canvas-confetti';
import { StoryIllustrator } from '@/components/stories/StoryIllustrator';
import { WeeklyChallenges } from '@/components/stories/WeeklyChallenges';
import { CollaborativeMode } from '@/components/stories/CollaborativeMode';
import { VoiceInput } from '@/components/VoiceInput';
import { formatDuration } from '@/utils/format';
import Link from 'next/link';
import { Button } from '@/components/ui/ios-button';

export default function CreateStoryPage() {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [selectedTheme, setSelectedTheme] = useState<StoryTheme | null>(null);
  const [storyIdea, setStoryIdea] = useState('');
  const [characterName, setCharacterName] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedStory, setGeneratedStory] = useState<GeneratedStory | null>(null);
  const [illustrations, setIllustrations] = useState<StoryIllustration[]>([]);
  const [isRecording, setIsRecording] = useState(false);

  const handleGenerate = async () => {
    if (!selectedTheme || !storyIdea || !characterName) return;
    
    setIsGenerating(true);
    try {
      // Simuler la génération d'histoire
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const story: GeneratedStory = {
        id: Date.now().toString(),
        title: "L'aventure magique",
        content: "Il était une fois...",
        theme: selectedTheme || 'adventure',
        mainCharacter: characterName,
        readingTime: formatDuration(5),
        createdAt: new Date().toISOString(),
        illustrations: [],
        isPublic: false,
        likes: 0,
        ageRecommendation: {
          min: 6,
          max: 12
        }
      };
      
      setGeneratedStory(story);
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-background safe-area-inset">
      <header className="bg-surface-dark border-b border-white/10 pt-safe-top">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            <Link 
              href="/"
              className="flex items-center space-x-2 text-white hover:text-white/80 transition tap-target touch-manipulation"
              aria-label="Retour à l'accueil"
            >
              <ArrowLeft className="w-6 h-6" />
              <span className="text-lg font-medium">Retour</span>
            </Link>
            <h1 className="text-xl font-bold">Créer une histoire</h1>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Étape 1: Choisir le thème */}
        {step === 1 && (
          <div className="space-y-8">
            <div className="text-center">
              <h2 className="text-2xl md:text-3xl font-bold mb-2">Choisis un thème</h2>
              <p className="text-white/70">Sélectionne le thème qui t'inspire le plus</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {STORY_THEMES.map((theme) => (
                <button
                  key={theme.id}
                  onClick={() => {
                    setSelectedTheme(theme);
                    setStep(2);
                  }}
                  className={`glass-card p-6 text-left transition tap-target touch-manipulation ${
                    selectedTheme?.id === theme.id ? 'ring-2 ring-primary' : 'hover:bg-white/5'
                  }`}
                >
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                      <span className="text-2xl">{theme.emoji}</span>
                    </div>
                    <div>
                      <h3 className="text-lg font-medium">{theme.name}</h3>
                      <p className="text-sm text-white/70">{theme.description}</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Étape 2: Détails de l'histoire */}
        {step === 2 && (
          <div className="space-y-8">
            <div className="text-center">
              <h2 className="text-2xl md:text-3xl font-bold mb-2">Détails de l'histoire</h2>
              <p className="text-white/70">Donne vie à ton histoire</p>
            </div>

            <div className="glass-card p-6 space-y-6">
              <div>
                <label htmlFor="characterName" className="block text-sm font-medium mb-2">
                  Nom du personnage principal
                </label>
                <input
                  id="characterName"
                  type="text"
                  value={characterName}
                  onChange={(e) => setCharacterName(e.target.value)}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent min-h-[44px]"
                  placeholder="Ex: Luna, Max, Charlie..."
                  required
                />
              </div>

              <div>
                <label htmlFor="storyIdea" className="block text-sm font-medium mb-2">
                  Ton idée d'histoire
                </label>
                <textarea
                  id="storyIdea"
                  value={storyIdea}
                  onChange={(e) => setStoryIdea(e.target.value)}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent min-h-[120px]"
                  placeholder="Raconte-nous ton idée..."
                  required
                />
              </div>

              <div className="flex items-center space-x-4">
                <Button
                  onClick={() => setStep(1)}
                  className="flex-1 min-h-[44px]"
                >
                  Retour
                </Button>
                <Button
                  onClick={handleGenerate}
                  className="flex-1 min-h-[44px] flex items-center justify-center space-x-2"
                  disabled={isGenerating || !storyIdea || !characterName}
                >
                  {isGenerating ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <>
                      <Wand2 className="w-5 h-5" />
                      <span>Générer</span>
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Étape 3: Histoire générée */}
        {step === 3 && generatedStory && (
          <div className="space-y-8">
            <div className="text-center">
              <h2 className="text-2xl md:text-3xl font-bold mb-2">{generatedStory.title}</h2>
              <p className="text-white/70">Temps de lecture estimé : {generatedStory.readingTime}</p>
            </div>

            <div className="glass-card p-6 space-y-6">
              <div className="prose prose-invert max-w-none">
                {generatedStory.content}
              </div>

              <div className="flex flex-wrap gap-4">
                <Button className="min-h-[44px] flex items-center space-x-2">
                  <Save className="w-5 h-5" />
                  <span>Sauvegarder</span>
                </Button>
                <Button className="min-h-[44px] flex items-center space-x-2">
                  <Volume2 className="w-5 h-5" />
                  <span>Écouter</span>
                </Button>
                <Button className="min-h-[44px] flex items-center space-x-2">
                  <Share2 className="w-5 h-5" />
                  <span>Partager</span>
                </Button>
              </div>
            </div>

            <StoryIllustrator story={generatedStory} onIllustrationGenerated={setIllustrations} />
          </div>
        )}
      </main>
    </div>
  );
}
