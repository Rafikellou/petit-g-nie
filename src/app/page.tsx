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
  Check
} from 'lucide-react';
import { ActivitySection } from '@/components/home/ActivitySection';
import { Footer } from '@/components/layout/Footer';
import { useUser } from '@/hooks/useUser';

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
    description: "Apprends en t'amusant",
    icon: GamepadIcon,
    color: 'text-indigo-400',
    bgGradient: 'from-indigo-500/20 to-purple-500/20',
    progress: 25
  },
  {
    href: '/blagues',
    title: 'Blagues',
    description: 'Rigole avec nos devinettes',
    icon: LightbulbIcon,
    color: 'text-pink-400',
    bgGradient: 'from-pink-500/20 to-red-500/20',
    progress: 15
  }
];

export default function Home() {
  const { user, teacher } = useUser();

  return (
    <>
      <main className="min-h-screen safe-area-inset pt-24">
        {/* Effets d'arrière-plan */}
        <div className="fixed inset-0 pointer-events-none">
          <div className="absolute top-[-50%] left-[-50%] w-[200%] h-[200%] bg-[radial-gradient(circle_at_center,rgba(0,242,195,0.03),transparent_70%)]" />
          <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(108,99,255,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(108,99,255,0.05)_1px,transparent_1px)] bg-[size:14px_14px]" />
        </div>

        <div className="max-w-6xl mx-auto px-6 pb-safe-bottom relative">
          <ActivitySection
            title={`Bonjour ${user?.firstName || ''}!`}
            description="Ton espace personnel pour apprendre et t'amuser"
            activities={[]}
            isMainTitle
          />

          <ActivitySection
            title={`Activités recommandées par ${teacher?.title || ''} ${teacher?.lastName || ''}`}
            description="Ces activités ont été spécialement choisies pour toi"
            activities={recommendedActivities}
          />

          <ActivitySection
            title="Amélioration continue"
            description="Exercices pour renforcer tes compétences"
            activities={trainingActivities}
          />

          <ActivitySection
            title="Histoires"
            description="Découvre, lis et crée des histoires passionnantes"
            activities={storyActivities}
          />

          <ActivitySection
            title="Apprendre en s'amusant"
            description="Des activités ludiques pour apprendre différemment"
            activities={funActivities}
          />
        </div>
      </main>
      <Footer />
    </>
  );
}
