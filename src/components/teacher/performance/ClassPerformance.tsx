'use client';

import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BarChart, BookOpen, Brain, GamepadIcon } from 'lucide-react';

const sections = [
  {
    id: 'recommended',
    title: 'Activités recommandées',
    icon: BarChart,
    stats: {
      completionRate: 75,
      averageScore: 85,
      totalActivities: 24
    }
  },
  {
    id: 'training',
    title: 'Entrainement',
    icon: Brain,
    stats: {
      completionRate: 60,
      averageScore: 78,
      totalActivities: 48
    }
  },
  {
    id: 'stories',
    title: 'Histoires',
    icon: BookOpen,
    stats: {
      completionRate: 45,
      averageScore: 92,
      totalActivities: 15
    }
  },
  {
    id: 'games',
    title: 'Apprendre en s\'amusant',
    icon: GamepadIcon,
    stats: {
      completionRate: 80,
      averageScore: 88,
      totalActivities: 32
    }
  }
];

export function ClassPerformance() {
  return (
    <div className="space-y-8">
      {sections.map((section) => (
        <Card key={section.id} className="p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 rounded-lg bg-gray-800">
              <section.icon className="w-5 h-5" />
            </div>
            <h2 className="text-xl font-semibold">{section.title}</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gray-800/50 rounded-lg p-4">
              <div className="text-sm text-gray-400 mb-1">Taux de complétion</div>
              <div className="text-2xl font-bold">{section.stats.completionRate}%</div>
            </div>
            
            <div className="bg-gray-800/50 rounded-lg p-4">
              <div className="text-sm text-gray-400 mb-1">Score moyen</div>
              <div className="text-2xl font-bold">{section.stats.averageScore}%</div>
            </div>
            
            <div className="bg-gray-800/50 rounded-lg p-4">
              <div className="text-sm text-gray-400 mb-1">Activités totales</div>
              <div className="text-2xl font-bold">{section.stats.totalActivities}</div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
