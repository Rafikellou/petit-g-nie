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
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';

const recommendedActivities = [
  {
    href: '/quiz/recommended',
    title: 'Quiz : Les verbes du premier groupe',
    description: 'Révise les verbes du premier groupe',
    icon: GraduationCap,
    color: 'text-yellow-400',
    bgGradient: 'from-yellow-500/20 to-orange-500/20'
  },
  {
    href: '/dictee/recommended',
    title: 'Dictée : Les homophones',
    description: 'Entraîne-toi sur les homophones',
    icon: PenTool,
    color: 'text-orange-400',
    bgGradient: 'from-orange-500/20 to-yellow-500/20'
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
  return (
    <>
      <Header />
      <main className="min-h-screen safe-area-inset pt-24">
        {/* Effets d'arrière-plan */}
        <div className="fixed inset-0 pointer-events-none">
          <div className="absolute top-[-50%] left-[-50%] w-[200%] h-[200%] bg-[radial-gradient(circle_at_center,rgba(0,242,195,0.03),transparent_70%)]" />
          <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(108,99,255,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(108,99,255,0.05)_1px,transparent_1px)] bg-[size:14px_14px]" />
        </div>

        <div className="max-w-6xl mx-auto px-6 pb-safe-bottom relative">
          <div className="text-center mb-8 md:mb-12">
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 text-transparent bg-clip-text mb-4">
              Bienvenue sur Futur Génie !
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
