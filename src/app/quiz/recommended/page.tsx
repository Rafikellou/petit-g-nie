'use client';

import { useEffect, useState } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useRouter } from 'next/navigation';
import { useUser } from '@/hooks/useUser';
import { BaseLayout } from '@/components/layout/BaseLayout';
import { Button } from '@/components/ui/ios-button';
import { QuestionDisplay } from '@/components/questions/QuestionDisplay';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

interface Question {
  id: string;
  question: string;
  options: {
    A: string;
    B: string;
    C: string;
    D: string;
  };
  correct_answer: string;
  explanation: string;
  class: string;
  subject: string;
  topic: string;
  specificity: string;
  'sub-specificity': string;
  period: string;
}

export default function RecommendedQuizPage() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { user } = useUser();
  const supabase = createClientComponentClient();

  useEffect(() => {
    const loadRecommendedQuestions = async () => {
      if (!user?.class) {
        router.push('/quiz');
        return;
      }

      try {
        const { data, error } = await supabase
          .from('questions')
          .select('*')
          .eq('class', user.class)
          .limit(5);

        if (error) throw error;

        setQuestions(data || []);
      } catch (error) {
        console.error('Erreur lors du chargement des questions recommandées:', error);
      } finally {
        setLoading(false);
      }
    };

    loadRecommendedQuestions();
  }, [user, supabase, router]);

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
            href="/quiz"
            className="inline-flex items-center text-white hover:text-white/80 transition"
          >
            <ArrowLeft className="w-6 h-6 mr-2" />
            <span>Retour aux quiz</span>
          </Link>
        </div>

        <h1 className="text-2xl md:text-4xl font-bold mb-6">Quiz recommandés</h1>
        
        {questions.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-xl text-gray-400 mb-6">
              Aucun quiz recommandé pour le moment.
            </p>
            <Button onClick={() => router.push('/quiz')}>
              Voir tous les quiz
            </Button>
          </div>
        ) : (
          <div className="space-y-8">
            {questions.map((question) => (
              <div key={question.id} className="bg-surface-dark p-6 rounded-lg">
                <QuestionDisplay
                  question={question.question}
                  options={question.options}
                  correctAnswer={question.correct_answer}
                  explanation={question.explanation}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </BaseLayout>
  );
}
