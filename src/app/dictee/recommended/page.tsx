'use client';

import { useEffect, useState } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useRouter } from 'next/navigation';
import { useUser } from '@/hooks/useUser';
import { BaseLayout } from '@/components/layout/BaseLayout';
import { Button } from '@/components/ui/ios-button';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

interface Dictation {
  id: string;
  title: string;
  content: string;
  difficulty: 'easy' | 'medium' | 'hard';
  class_level: string;
  topic: string;
  duration: number;
}

export default function RecommendedDictationsPage() {
  const [dictations, setDictations] = useState<Dictation[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { user } = useUser();
  const supabase = createClientComponentClient();

  useEffect(() => {
    const loadRecommendedDictations = async () => {
      if (!user?.class_level) {
        router.push('/dictee');
        return;
      }

      try {
        // Pour l'instant, on utilise des données fictives
        setDictations([
          {
            id: '1',
            title: 'Le petit chaperon rouge',
            content: 'Il était une fois une petite fille que tout le monde aimait...',
            difficulty: 'easy',
            class_level: user.class_level,
            topic: 'Contes classiques',
            duration: 10
          },
          {
            id: '2',
            title: 'Les saisons',
            content: 'Au printemps, la nature se réveille doucement...',
            difficulty: 'medium',
            class_level: user.class_level,
            topic: 'Nature',
            duration: 15
          }
        ]);
      } catch (error) {
        console.error('Erreur lors du chargement des dictées recommandées:', error);
      } finally {
        setLoading(false);
      }
    };

    loadRecommendedDictations();
  }, [user, router]);

  if (loading) {
    return (
      <BaseLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
        </div>
      </BaseLayout>
    );
  }

  return (
    <BaseLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Link 
            href="/dictee"
            className="inline-flex items-center text-white hover:text-white/80 transition"
          >
            <ArrowLeft className="w-6 h-6 mr-2" />
            <span>Retour aux dictées</span>
          </Link>
        </div>

        <h1 className="text-2xl md:text-4xl font-bold mb-6">Dictées recommandées</h1>
        
        {dictations.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-xl text-gray-400 mb-6">
              Aucune dictée recommandée pour le moment.
            </p>
            <Button onClick={() => router.push('/dictee')}>
              Voir toutes les dictées
            </Button>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2">
            {dictations.map((dictation) => (
              <div 
                key={dictation.id} 
                className="bg-surface-dark p-6 rounded-lg hover:bg-surface-dark/80 transition cursor-pointer"
                onClick={() => router.push(`/dictee/${dictation.id}`)}
              >
                <h3 className="text-xl font-semibold mb-2">{dictation.title}</h3>
                <div className="flex items-center gap-4 text-sm text-gray-400">
                  <span>Niveau: {dictation.class_level}</span>
                  <span>Difficulté: {dictation.difficulty}</span>
                  <span>Durée: {dictation.duration} min</span>
                </div>
                <p className="mt-4 text-gray-300 line-clamp-2">{dictation.content}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </BaseLayout>
  );
}
