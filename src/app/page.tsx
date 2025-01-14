'use client';

import { 
  BookOpen, 
  GraduationCap, 
  Headphones, 
  LightbulbIcon,
  Wand2,
  GamepadIcon,
  Languages,
  PenTool,
  Brain,
  BookOpenCheck,
  Check,
  Smile
} from 'lucide-react';
import { ActivitySection } from '@/components/home/ActivitySection';
import { BaseLayout } from '@/components/layout/BaseLayout';
import { useUser } from '@/hooks/useUser';
import { PinModal } from '@/components/auth/PinModal';
import { useState } from 'react';

const recommendedActivities = [
  {
    href: '/quiz/recommended',
    title: 'Quiz',
    icon: GraduationCap,
    color: 'text-yellow-400',
    bgGradient: 'from-yellow-900/40 to-yellow-800/40',
    isCompleted: false
  },
  {
    href: '/dictee/recommended',
    title: 'Dictée',
    icon: PenTool,
    color: 'text-emerald-400',
    bgGradient: 'from-emerald-900/40 to-emerald-800/40',
    isCompleted: true
  }
];

const trainingActivities = [
  {
    href: '/quiz',
    title: 'Quiz',
    description: 'Teste tes connaissances avec des quiz amusants et éducatifs',
    icon: GraduationCap,
    color: 'text-yellow-400',
    bgGradient: 'from-yellow-900/40 to-yellow-800/40'
  },
  {
    href: '/dictee',
    title: 'Dictée',
    description: 'Améliore ton orthographe et ta grammaire',
    icon: PenTool,
    color: 'text-emerald-400',
    bgGradient: 'from-emerald-900/40 to-emerald-800/40'
  },
  {
    href: '/english',
    title: 'Apprendre l\'Anglais',
    description: 'Découvre et pratique l\'anglais de manière ludique',
    icon: Languages,
    color: 'text-red-400',
    bgGradient: 'from-red-900/40 to-red-800/40'
  }
];

const storyActivities = [
  {
    href: '/listen',
    title: 'Écouter une histoire',
    description: 'Des histoires audio passionnantes',
    icon: Headphones,
    color: 'text-green-400',
    bgGradient: 'from-green-500/20 to-teal-500/20',
    progress: 55
  },
  {
    href: '/stories',
    title: 'Lire une histoire',
    description: 'Des histoires interactives',
    icon: BookOpen,
    color: 'text-purple-400',
    bgGradient: 'from-purple-500/20 to-blue-500/20',
    progress: 65
  },
  {
    href: '/creer-histoire',
    title: 'Créer une histoire',
    description: 'Laisse libre cours à ton imagination',
    icon: Wand2,
    color: 'text-pink-400',
    bgGradient: 'from-pink-500/20 to-rose-500/20',
    isNew: true
  }
];

const funActivities = [
  {
    href: '/jeux',
    title: 'Jeux éducatifs',
    description: 'Apprends en t\'amusant avec nos jeux',
    icon: GamepadIcon,
    color: 'text-blue-400',
    bgGradient: 'from-blue-500/20 to-indigo-500/20'
  },
  {
    href: '/blagues',
    title: 'Blagues',
    description: 'Découvre et partage des blagues amusantes',
    icon: Smile,
    color: 'text-amber-400',
    bgGradient: 'from-amber-500/20 to-orange-500/20'
  }
];

export default function Home() {
  const { user, loading } = useUser();
  const [showPinModal, setShowPinModal] = useState(false);

  const handlePinSuccess = () => {
    setShowPinModal(false);
    // Ajouter ici la logique après validation du PIN
  };

  return (
    <BaseLayout>
      <div className="max-w-6xl mx-auto px-6 pb-safe-bottom relative">
        <div className="container mx-auto px-4 py-8">
          <div className="mb-12">
            <h1 className="text-2xl md:text-4xl font-bold mb-2">
              {loading ? (
                <span>Chargement...</span>
              ) : user ? (
                <span className="text-violet-500">
                  {user.surname_child ? `Bonjour ${user.surname_child}!` : 'Bonjour!'}
                </span>
              ) : (
                "Connectez-vous pour commencer"
              )}
            </h1>
            <p className="text-base md:text-xl text-gray-400">
              Ton espace personnel pour apprendre et t'amuser
            </p>
          </div>

          <ActivitySection
            title="Activités recommandées"
            description="Ces activités ont été spécialement choisies pour toi"
            activities={recommendedActivities}
          />

          <ActivitySection
            title="Entraînement"
            description="Choisis une activité pour t'entraîner"
            activities={trainingActivities}
          />

          <ActivitySection
            title="Histoires"
            description="Découvre des histoires passionnantes"
            activities={storyActivities}
          />

          <ActivitySection
            title="Jeux"
            description="Amuse-toi tout en apprenant"
            activities={funActivities}
          />
        </div>
      </div>

      {/* Modal PIN */}
      <PinModal
        isOpen={showPinModal}
        onClose={() => setShowPinModal(false)}
        onSuccess={handlePinSuccess}
        userEmail={user?.email}
      />
    </BaseLayout>
  );
}
