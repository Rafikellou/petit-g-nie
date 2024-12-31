'use client';

import { useState } from 'react';
import { Wand2, BookOpen, Save, Volume2, Share2, Sparkles, Trophy } from 'lucide-react';
import { StoryTheme, StoryPrompt, GeneratedStory, STORY_THEMES, StoryChallenge, StoryIllustration, StoryCollaborator } from '@/types/story';
import confetti from 'canvas-confetti';
import { StoryIllustrator } from '@/components/stories/StoryIllustrator';
import { WeeklyChallenges } from '@/components/stories/WeeklyChallenges';
import { CollaborativeMode } from '@/components/stories/CollaborativeMode';
import { VoiceInput } from '@/components/VoiceInput';
import { formatDuration } from '@/utils/format';

export default function CreateStoryPage() {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [selectedTheme, setSelectedTheme] = useState<StoryTheme | null>(null);
  const [storyIdea, setStoryIdea] = useState('');
  const [characterName, setCharacterName] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedStory, setGeneratedStory] = useState<GeneratedStory | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [selectedChallenge, setSelectedChallenge] = useState<StoryChallenge | null>(null);
  const [illustrations, setIllustrations] = useState<StoryIllustration[]>([]);
  const [collaborators, setCollaborators] = useState<StoryCollaborator[]>([]);

  const handleThemeSelect = (theme: StoryTheme) => {
    setSelectedTheme(theme);
    setTimeout(() => setStep(2), 500);
  };

  const handleIdeaSubmit = () => {
    if (storyIdea.length > 10) {
      setStep(3);
    }
  };

  const generateStory = async () => {
    if (!selectedTheme || !storyIdea || !characterName) return;

    setIsGenerating(true);
    // Simuler la génération d'histoire
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    const story: GeneratedStory = {
      id: Math.random().toString(36).substr(2, 9),
      title: "L'Aventure Magique de " + characterName,
      description: `Une histoire fascinante où ${characterName} ${storyIdea.toLowerCase()}...`,
      content: `Il était une fois ${characterName} qui ${storyIdea.toLowerCase()}...`,
      image: '/images/placeholder-story.jpg',
      difficulty: 'facile',
      audioUrl: '',
      prompt: {
        theme: selectedTheme,
        idea: storyIdea,
        mainCharacter: { name: characterName }
      },
      createdAt: new Date().toISOString(),
      duration: formatDuration(Math.floor(Math.random() * 10) + 5),
      isPublic: false,
      likes: 0,
      ageRecommendation: { min: 6, max: 8 },
      illustrations: [],
      collaborators: []
    };

    setGeneratedStory(story);
    setIsGenerating(false);
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });
  };

  const toggleAudio = () => {
    setIsPlaying(!isPlaying);
  };

  const saveStory = () => {
    // TODO: Implémenter la sauvegarde
    alert('Histoire sauvegardée dans ta bibliothèque !');
  };

  return (
    <div className="container mx-auto p-8">
      {/* En-tête */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-4">
          Crée Ton Histoire
        </h1>
        <p className="text-white/70">
          Laisse libre cours à ton imagination et crée des histoires magiques !
        </p>
      </div>

      {/* Étapes */}
      <div className="max-w-4xl mx-auto">
        {/* Étape 1: Choix du thème */}
        {step === 1 && (
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold mb-4">
              1. Choisis un thème pour ton histoire
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {STORY_THEMES.map(theme => (
                <button
                  key={theme.id}
                  onClick={() => handleThemeSelect(theme.id)}
                  className={`card hover:scale-105 transition-transform ${
                    selectedTheme === theme.id ? 'ring-2 ring-[rgb(var(--primary))]' : ''
                  }`}
                >
                  <div className="p-4 text-center">
                    <div className="text-4xl mb-2">{theme.icon}</div>
                    <h3 className="font-medium mb-2">{theme.name}</h3>
                    <p className="text-sm text-white/70">{theme.description}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Étape 2: Idée de l'histoire */}
        {step === 2 && (
          <div className="card">
            <h2 className="text-2xl font-semibold mb-6">
              2. Quelle est ton idée d'histoire ?
            </h2>
            <div className="space-y-6">
              <div>
                <label className="block text-white/70 mb-2">
                  Décris ton idée en quelques phrases
                </label>
                <textarea
                  value={storyIdea}
                  onChange={(e) => setStoryIdea(e.target.value)}
                  placeholder="Il était une fois..."
                  className="input w-full h-32 resize-none"
                />
              </div>
              <div>
                <label className="block text-white/70 mb-2">
                  Comment s'appelle ton personnage principal ?
                </label>
                <input
                  type="text"
                  value={characterName}
                  onChange={(e) => setCharacterName(e.target.value)}
                  placeholder="Nom du personnage"
                  className="input w-full"
                />
              </div>
              <div className="flex justify-end space-x-4">
                <button
                  onClick={() => setStep(1)}
                  className="btn-secondary"
                >
                  Retour
                </button>
                <button
                  onClick={handleIdeaSubmit}
                  disabled={storyIdea.length < 10}
                  className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Continuer
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Étape 3: Génération et personnalisation */}
        {step === 3 && (
          <div className="space-y-8">
            {/* Options de génération */}
            <div className="card">
              <h2 className="text-2xl font-semibold mb-6">
                3. Personnalise ton histoire
              </h2>
              <div className="space-y-6">
                {/* Défis hebdomadaires */}
                <WeeklyChallenges
                  onChallengeSelect={(challenge) => {
                    setSelectedChallenge(challenge);
                    setSelectedTheme(challenge.theme);
                  }}
                />
                
                {/* Mode collaboratif */}
                <CollaborativeMode
                  storyId={generatedStory?.id || 'new-story'}
                  collaborators={collaborators}
                  onCollaboratorAdd={(email, role) => {
                    const newCollaborator: StoryCollaborator = {
                      id: Math.random().toString(36).substr(2, 9),
                      name: email.split('@')[0],
                      role,
                      contributions: 0
                    };
                    setCollaborators(prev => [...prev, newCollaborator]);
                  }}
                />

                {/* Illustrations */}
                <StoryIllustrator
                  storyContent={storyIdea}
                  onIllustrationGenerated={(illustration) => {
                    setIllustrations(prev => [...prev, illustration]);
                  }}
                />

                {/* Entrée vocale */}
                <VoiceInput
                  onResult={(text) => setStoryIdea(prev => prev + ' ' + text)}
                  placeholder="Raconte ton histoire..."
                />

                <div className="flex justify-end space-x-4">
                  <button
                    onClick={() => setStep(2)}
                    className="btn-secondary"
                  >
                    Retour
                  </button>
                  <button
                    onClick={generateStory}
                    disabled={isGenerating}
                    className="btn-primary"
                  >
                    {isGenerating ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                        Génération en cours...
                      </>
                    ) : (
                      <>
                        <Wand2 className="w-5 h-5" />
                        Générer l'histoire
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Histoire générée */}
            {generatedStory && (
              <div className="card">
                <h2 className="text-2xl font-semibold mb-6">
                  Ton histoire est prête !
                </h2>
                <div className="space-y-6">
                  <h3 className="text-xl font-medium">
                    {generatedStory.title}
                  </h3>
                  <p className="text-white/70">
                    {generatedStory.content}
                  </p>
                  <div className="flex justify-end space-x-4">
                    <button className="btn-secondary">
                      <Volume2 className="w-5 h-5" />
                      Écouter
                    </button>
                    <button className="btn-secondary">
                      <Share2 className="w-5 h-5" />
                      Partager
                    </button>
                    <button className="btn-primary">
                      <Save className="w-5 h-5" />
                      Sauvegarder
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
