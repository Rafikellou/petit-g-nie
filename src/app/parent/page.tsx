'use client';

import { useUser } from '@/hooks/useUser';
import { useParentAuth } from '@/hooks/useParentAuth';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Clock, Lock, LockKeyhole } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { BaseLayout } from '@/components/layout/BaseLayout';
import { PinModal } from '@/components/auth/PinModal';

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
  const { user, loading: userLoading } = useUser();
  const { isVerified, setIsVerified, loading: authLoading } = useParentAuth();

  const handlePinSuccess = () => {
    setIsVerified(true);
  };

  if (userLoading || authLoading) {
    return (
      <BaseLayout>
        <div className="space-y-4">
          <Skeleton className="h-8 w-[250px]" />
          <Skeleton className="h-4 w-[300px]" />
          <div className="grid gap-8">
            <Skeleton className="h-[200px] w-full" />
            <Skeleton className="h-[300px] w-full" />
          </div>
        </div>
      </BaseLayout>
    );
  }

  if (!user) {
    return (
      <BaseLayout>
        <Alert variant="destructive">
          <AlertDescription>
            Une erreur est survenue lors du chargement de votre profil
          </AlertDescription>
        </Alert>
      </BaseLayout>
    );
  }

  if (!isVerified) {
    return (
      <BaseLayout>
        <PinModal
          isOpen={true}
          onClose={() => {}} // Ne rien faire à la fermeture
          onSuccess={handlePinSuccess}
          userEmail={user?.email}
        />
        <div className="flex items-center justify-center h-[calc(100vh-64px)]">
          <div className="text-center">
            <LockKeyhole className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h2 className="text-xl font-semibold text-white mb-2">
              Vous devez être connecté pour accéder à cette page
            </h2>
            <p className="text-gray-400">
              Veuillez entrer votre code PIN pour continuer
            </p>
          </div>
        </div>
      </BaseLayout>
    );
  }

  return (
    <BaseLayout>
      <div className="container mx-auto px-4 py-8">
        <div>
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">
              Contrôle parental {user?.surname_child ? `- ${user.surname_child}` : ''}
            </h1>
            <p className="text-gray-400">
              Gérez le temps d'utilisation et les restrictions d'accès
              {user.ecole && ` - ${user.ecole.nom_ecole}`}
            </p>
          </div>

          <div className="grid gap-8">
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
      </div>
    </BaseLayout>
  );
}
