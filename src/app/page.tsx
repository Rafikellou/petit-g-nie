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
  BookOpenCheck
} from 'lucide-react';
import { ActivitySection } from '@/components/home/ActivitySection';

const recommendedActivities = [
  {
    href: '/quiz/recommended',
    title: 'Quiz : Les verbes du premier groupe',
    description: 'Recommandé par Mme. Martin',
    icon: GraduationCap,
    color: 'text-yellow-400',
    bgGradient: 'from-yellow-500/20 to-orange-500/20',
    recommendedDaysAgo: 2,
    teacherMessage: "Tu as bien progressé sur les verbes, continue !",
    progress: 60
  },
  {
    href: '/dictee/recommended',
    title: 'Dictée : Les homophones',
    description: 'Recommandé par Mme. Martin',
    icon: PenTool,
    color: 'text-orange-400',
    bgGradient: 'from-orange-500/20 to-yellow-500/20',
    recommendedDaysAgo: 1,
    teacherMessage: "Entraîne-toi sur ces homophones difficiles",
    progress: 45
  }
];

const trainingActivities = [
  {
    href: '/quiz',
    title: 'Quiz',
    description: 'Teste tes connaissances',
    icon: GraduationCap,
    color: 'text-yellow-400',
    bgGradient: 'from-yellow-500/20 to-orange-500/20',
    progress: 75
  },
  {
    href: '/dictee',
    title: 'Dictée',
    description: 'Améliore ton orthographe',
    icon: PenTool,
    color: 'text-orange-400',
    bgGradient: 'from-orange-500/20 to-yellow-500/20',
    progress: 40
  },
  {
    href: '/english',
    title: 'Anglais',
    description: 'Apprends de nouveaux mots',
    icon: Languages,
    color: 'text-blue-400',
    bgGradient: 'from-blue-500/20 to-indigo-500/20',
    progress: 30
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
  return (
    <main className="min-h-screen safe-area-inset">
      {/* Effets d'arrière-plan */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-50%] left-[-50%] w-[200%] h-[200%] bg-[radial-gradient(circle_at_center,rgba(0,242,195,0.03),transparent_70%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(108,99,255,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(108,99,255,0.05)_1px,transparent_1px)] bg-[size:14px_14px]" />
      </div>

      <div className="max-w-6xl mx-auto px-6 pt-safe-top pb-safe-bottom relative">
        <div className="text-center mb-8 md:mb-12">
          <h1 className="text-4xl md:text-5xl font-bold gradient-text mb-4">
            Espace Enfant
          </h1>
          <p className="text-lg text-white/70">
            Ton espace personnel pour apprendre et t'amuser
          </p>
        </div>

        <ActivitySection
          title="Activités recommandées par ton enseignant"
          description="Ces activités ont été spécialement choisies pour toi"
          activities={recommendedActivities}
        />

        <ActivitySection
          title="S'entraîner"
          description="Améliore tes compétences avec ces exercices"
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
  );
}
