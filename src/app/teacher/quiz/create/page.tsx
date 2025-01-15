'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import ChatInterface from '@/components/chat/ChatInterface';
import { toast } from 'sonner';

interface QuizQuestion {
  question: string;
  options: {
    A: string;
    B: string;
    C: string;
    D: string;
  };
  correctAnswer: string;
  explanation: string;
}

interface TeacherInfo {
  title: string;
  full_name: string;
  class_name: string;
}

export default function CreateQuizPage() {
  const router = useRouter();
  const supabase = createClientComponentClient();
  const [validatedQuestions, setValidatedQuestions] = useState<QuizQuestion[]>([]);
  const [teacherInfo, setTeacherInfo] = useState<TeacherInfo | null>(null);
  const [systemPrompt] = useState<string>(
    "Bonjour, je suis Futur Génie et je vais vous aider à créer un quiz pour vos élèves. Quelle a été la leçon du jour ?"
  );
  const [conversationHistory, setConversationHistory] = useState<any[]>([]);

  useEffect(() => {
    async function loadTeacherInfo() {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        // Récupérer les informations de l'utilisateur
        const { data: userData, error: userError } = await supabase
          .from('users')
          .select('title, family_name')
          .eq('id', user.id)
          .single();

        if (userError) throw userError;

        // Récupérer les détails de l'utilisateur avec sa classe
        const { data: userDetails, error: detailsError } = await supabase
          .from('user_details')
          .select('class')
          .eq('user_id', user.id)
          .single();

        if (detailsError) throw detailsError;

        if (userData && userDetails) {
          setTeacherInfo({
            title: userData.title,
            full_name: userData.family_name,
            class_name: userDetails.class
          });
        }
      } catch (error) {
        console.error('Error loading teacher info:', error);
        toast.error('Erreur lors du chargement des informations');
      }
    }

    loadTeacherInfo();
  }, [supabase]);

  const handleSendMessage = async (message: string, history: any[]) => {
    try {
      // Filtrer et formater correctement l'historique
      const formattedHistory = history
        .filter(msg => msg.role !== 'system') // Exclure les messages système
        .map(msg => ({
          role: msg.role,
          content: msg.content
        }));

      const response = await fetch('/api/deepseek/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message,
          history: formattedHistory,
          context: "Tu es un assistant pédagogique nommé 'Futur Génie'. Tu dois générer des questions de quiz basées sur les instructions de l'enseignant. Chaque question doit avoir 4 options (A, B, C, D) et une seule réponse correcte. Garde en mémoire le contexte de la conversation pour générer des questions cohérentes avec les demandes précédentes."
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('API Error:', errorData);
        throw new Error(errorData.error || 'Erreur lors de la communication avec Deepseek');
      }

      const data = await response.json();
      setConversationHistory(prev => [...prev, { role: 'user', message }, { role: 'assistant', message: data.response }]);
      return data.response;
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  };

  const handleValidateQuestion = (message: { content: string }) => {
    try {
      // Extraire la question du message
      // On suppose que la réponse est formatée correctement
      const questionData = JSON.parse(message.content);
      setValidatedQuestions(prev => [...prev, questionData]);
      toast.success('Question validée et ajoutée au quiz');
    } catch (error) {
      toast.error('Format de question invalide');
    }
  };

  const handleGenerateActivity = async () => {
    if (validatedQuestions.length === 0) {
      toast.error('Aucune question n\'a été validée');
      return;
    }

    try {
      // Récupérer l'ID de la classe de l'enseignant
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Non authentifié');

      const { data: teacherData, error: teacherError } = await supabase
        .from('user_details')
        .select('class_id')
        .eq('user_id', user.id)
        .single();

      if (teacherError || !teacherData?.class_id) {
        throw new Error('Impossible de récupérer la classe');
      }

      // Créer l'activité
      const { data: activity, error: activityError } = await supabase
        .from('activities')
        .insert({
          type: 'quiz',
          class_id: teacherData.class_id,
          teacher_id: user.id,
          content: validatedQuestions,
          created_at: new Date().toISOString(),
          status: 'published'
        })
        .select()
        .single();

      if (activityError) throw activityError;

      toast.success('Quiz créé et publié avec succès !');
      router.push('/teacher/activities'); // Rediriger vers la liste des activités
    } catch (error) {
      console.error('Error creating activity:', error);
      toast.error('Erreur lors de la création de l\'activité');
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Créer un nouveau quiz</h1>
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-2">Instructions</h2>
          <p className="text-gray-400">
            1. Décrivez le contenu ou le sujet du quiz que vous souhaitez créer
            <br />
            2. Futur Génie vous proposera des questions adaptées
            <br />
            3. Validez les questions qui vous conviennent
            <br />
            4. Une fois satisfait, cliquez sur "Générer l'activité" pour la publier
          </p>
        </div>

        <ChatInterface
          onSendMessage={(message, history) => handleSendMessage(message, history)}
          onValidateMessage={handleValidateQuestion}
          onGenerateActivity={handleGenerateActivity}
          systemPrompt={systemPrompt}
          conversationHistory={conversationHistory}
        />

        {validatedQuestions.length > 0 && (
          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-2">
              Questions validées ({validatedQuestions.length})
            </h3>
            <div className="text-sm text-gray-400">
              Ces questions seront incluses dans le quiz final
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
