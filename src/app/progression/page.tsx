'use client';

import { FC } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, Trophy, Star, Clock, Target, Book, Award, TrendingUp } from 'lucide-react';
import { useProgress } from '@/hooks/useProgress';
import { badges, levels } from '@/data/achievements';
import { characters } from '@/data/characters';
import WeeklyProgressChart from '@/components/charts/WeeklyProgressChart';

interface WeeklyData {
  day: 'Lun' | 'Mar' | 'Mer' | 'Jeu' | 'Ven' | 'Sam' | 'Dim';
  value: number;
  label: string;
}

interface ProgressStat {
  label: string;
  value: string;
  icon: any;
  color: 'blue' | 'yellow' | 'green' | 'purple' | 'red' | 'orange';
  trend?: {
    direction: 'up' | 'down';
    percentage: number;
  };
}

const weeklyData: WeeklyData[] = [
  { day: 'Lun', value: 45, label: 'Lundi : 45 minutes' },
  { day: 'Mar', value: 40, label: 'Mardi : 40 minutes' },
  { day: 'Mer', value: 60, label: 'Mercredi : 60 minutes' },
  { day: 'Jeu', value: 35, label: 'Jeudi : 35 minutes' },
  { day: 'Ven', value: 50, label: 'Vendredi : 50 minutes' },
  { day: 'Sam', value: 45, label: 'Samedi : 45 minutes' },
  { day: 'Dim', value: 30, label: 'Dimanche : 30 minutes' },
];

const ProgressPage: FC = () => {
  const { progress } = useProgress();

  const stats: ProgressStat[] = [
    {
      label: 'Niveau actuel',
      value: '12',
      icon: Target,
      color: 'blue',
      trend: {
        direction: 'up',
        percentage: 15
      }
    },
    {
      label: 'Points XP',
      value: '2,450',
      icon: Star,
      color: 'yellow',
      trend: {
        direction: 'up',
        percentage: 8
      }
    },
    {
      label: 'Temps total',
      value: '24h',
      icon: Clock,
      color: 'green'
    },
    {
      label: 'Leçons complétées',
      value: '45',
      icon: Book,
      color: 'purple',
      trend: {
        direction: 'up',
        percentage: 12
      }
    }
  ];

  const achievements = [
    {
      title: 'Premier pas',
      description: 'Commence ton voyage d\'apprentissage',
      icon: '/badges/first-steps.png',
      progress: 100,
    },
    {
      title: 'Explorateur',
      description: 'Découvre 5 nouveaux sujets',
      icon: '/badges/explorer.png',
      progress: 80,
    },
    {
      title: 'Champion',
      description: 'Obtiens 3 notes parfaites',
      icon: '/badges/champion.png',
      progress: 60,
    }
  ];

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
            <h1 className="text-xl font-bold">Progression</h1>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">
        {/* Statistiques générales */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {stats.map((stat, index) => {
            const IconComponent = stat.icon;
            return (
              <div key={index} className="glass-card p-4 text-center">
                <div className={`w-12 h-12 mx-auto mb-3 rounded-full bg-${stat.color}-500/20 flex items-center justify-center`}>
                  <IconComponent className={`w-6 h-6 text-${stat.color}-400`} />
                </div>
                <div className="text-2xl font-bold mb-1">{stat.value}</div>
                <div className="text-sm text-white/70">{stat.label}</div>
              </div>
            );
          })}
        </div>

        {/* Graphique de progression hebdomadaire */}
        <div className="glass-card p-6 space-y-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-medium">Activité de la semaine</h2>
            <div className="flex items-center space-x-2 text-sm text-white/60">
              <Clock className="w-4 h-4" />
              <span>305 minutes au total</span>
            </div>
          </div>
          <div className="h-64">
            <WeeklyProgressChart data={weeklyData} />
          </div>
        </div>

        {/* Succès et badges */}
        <div className="glass-card p-6">
          <h2 className="text-lg font-medium mb-6">Succès débloqués</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {achievements.map((achievement, index) => (
              <div key={index} className="space-y-4">
                <div className="relative w-20 h-20 mx-auto">
                  <Image
                    src={achievement.icon}
                    alt={achievement.title}
                    fill
                    className="object-contain"
                  />
                </div>
                <div className="text-center">
                  <h3 className="font-medium mb-1">{achievement.title}</h3>
                  <p className="text-sm text-white/70 mb-3">{achievement.description}</p>
                  <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary"
                      style={{ width: `${achievement.progress}%` }}
                    />
                  </div>
                  <p className="text-sm text-white/60 mt-1">{achievement.progress}%</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Niveau et progression */}
        <div className="glass-card p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-medium mb-1">Niveau 12</h2>
              <p className="text-sm text-white/70">2,450 XP / 3,000 XP pour le niveau 13</p>
            </div>
            <div className="w-12 h-12 rounded-full bg-yellow-500/20 flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-yellow-400" />
            </div>
          </div>
          <div className="h-2 bg-white/10 rounded-full overflow-hidden mb-4">
            <div
              className="h-full bg-yellow-400"
              style={{ width: '82%' }}
            />
          </div>
          <p className="text-sm text-white/60 text-center">
            Plus que 550 XP pour atteindre le niveau 13
          </p>
        </div>
      </main>
    </div>
  );
};

export default ProgressPage;
