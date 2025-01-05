'use client';

import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
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
          <CardHeader>
            <div className="flex items-center gap-3">
              <Clock className="w-5 h-5 text-turquoise-500" />
              <CardTitle>Temps d'utilisation</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
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
                  <div className="mt-4">
                    <p>Statistiques pour {frame.label.toLowerCase()}</p>
                  </div>
                </TabsContent>
              ))}
            </Tabs>
          </CardContent>
        </Card>

        {/* Restrictions par catégorie */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <Lock className="w-5 h-5 text-turquoise-500" />
              <CardTitle>Restrictions par catégorie</CardTitle>
            </div>
            <CardDescription>
              Définissez les restrictions pour chaque catégorie de contenu
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              {categories.map(category => (
                <div key={category.id} className="flex items-center justify-between p-4 rounded-lg bg-gray-900/50">
                  <span>{category.name}</span>
                  <div className="flex gap-2">
                    <button className="px-3 py-1.5 rounded bg-gray-800 hover:bg-gray-700 transition-colors">
                      <Lock className="w-4 h-4" />
                    </button>
                    <button className="px-3 py-1.5 rounded bg-gray-800 hover:bg-gray-700 transition-colors">
                      <LockKeyhole className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
