'use client';

import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Clock, Lock, LockKeyhole } from 'lucide-react';

const categories = [
  { id: 'stories-listen', name: 'Écouter une histoire' },
  { id: 'stories-read', name: 'Lire une histoire' },
  { id: 'stories-create', name: 'Créer une histoire' },
  { id: 'games', name: 'Jeux éducatifs' },
  { id: 'jokes', name: 'Blagues' }
];

const timeFrames = [
  { value: 'day', label: 'Aujourd\'hui' },
  { value: 'week', label: 'Cette semaine' },
  { value: 'month', label: 'Ce mois' }
];

export default function ParentPage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">
          Contrôle parental
        </h1>
        <p className="text-gray-400">
          Gérez le temps d'utilisation et les restrictions d'accès
        </p>
      </div>

      <div className="grid gap-8">
        {/* Temps d'utilisation */}
        <Card>
          <Card.Header>
            <div className="flex items-center gap-3">
              <Clock className="w-5 h-5 text-turquoise-500" />
              <Card.Title>Temps d'utilisation</Card.Title>
            </div>
          </Card.Header>
          <Card.Content>
            <Tabs defaultValue="day" className="w-full">
              <TabsList>
                {timeFrames.map(frame => (
                  <TabsTrigger key={frame.value} value={frame.value}>
                    {frame.label}
                  </TabsTrigger>
                ))}
              </TabsList>

              {timeFrames.map(frame => (
                <TabsContent key={frame.value} value={frame.value}>
                  <div className="h-64 flex items-center justify-center text-gray-500">
                    Graphique du temps d'utilisation - {frame.label}
                  </div>
                </TabsContent>
              ))}
            </Tabs>
          </Card.Content>
        </Card>

        {/* Restrictions des catégories */}
        <Card>
          <Card.Header>
            <div className="flex items-center gap-3">
              <Lock className="w-5 h-5 text-turquoise-500" />
              <Card.Title>Restrictions des catégories</Card.Title>
            </div>
            <Card.Description>
              Définissez les restrictions pour chaque catégorie de contenu
            </Card.Description>
          </Card.Header>
          <Card.Content>
            <div className="space-y-4">
              {categories.map(category => (
                <div
                  key={category.id}
                  className="flex items-center justify-between p-4 bg-gray-900 rounded-lg"
                >
                  <span className="font-medium">{category.name}</span>
                  <div className="flex items-center gap-4">
                    <button className="px-3 py-1.5 text-sm rounded-lg bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20">
                      Restreindre
                    </button>
                    <button className="px-3 py-1.5 text-sm rounded-lg bg-red-500/10 text-red-500 hover:bg-red-500/20">
                      Interdire
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </Card.Content>
        </Card>
      </div>
    </div>
  );
}
