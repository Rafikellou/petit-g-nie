'use client';

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Brain, Book, Gamepad, Laugh } from 'lucide-react';

const performanceAreas = [
  {
    name: 'Apprentissage',
    icon: Brain,
    stats: [
      { label: 'Quiz complétés', value: 24 },
      { label: 'Taux de réussite', value: '85%' }
    ]
  },
  {
    name: 'Lecture',
    icon: Book,
    stats: [
      { label: 'Histoires lues', value: 12 },
      { label: 'Temps de lecture', value: '3h 20m' }
    ]
  },
  {
    name: 'Jeux éducatifs',
    icon: Gamepad,
    stats: [
      { label: 'Jeux joués', value: 18 },
      { label: 'Score moyen', value: '720' }
    ]
  },
  {
    name: 'Divertissement',
    icon: Laugh,
    stats: [
      { label: 'Blagues découvertes', value: 8 },
      { label: 'Histoires créées', value: 3 }
    ]
  }
];

export default function PerformancePage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">
          Performances de l'enfant
        </h1>
        <p className="text-gray-400">
          Suivez les progrès et l'activité de votre enfant
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {performanceAreas.map(area => (
          <Card key={area.name}>
            <CardHeader>
              <div className="flex items-center gap-3">
                <area.icon className="w-5 h-5 text-turquoise-500" />
                <CardTitle>{area.name}</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <dl className="grid grid-cols-2 gap-4">
                {area.stats.map(stat => (
                  <div key={stat.label}>
                    <dt className="text-sm text-gray-400">{stat.label}</dt>
                    <dd className="text-2xl font-semibold text-white">{stat.value}</dd>
                  </div>
                ))}
              </dl>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
