'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import ChatInterface from '@/components/chat/ChatInterface';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import GenerationAnimation from '@/components/quiz/GenerationAnimation';
import QuestionReview from '@/components/quiz/QuestionReview';

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

// Interface simplifiée pour les informations de l'enseignant
interface TeacherInfo {
  surname?: string;
  class_name?: string;
}

interface Message {
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
  validated?: boolean;
  formattedContent?: any; // Contenu JSON formaté après validation
}

export default function CreateQuizPage() {
  const router = useRouter();
  const supabase = createClientComponentClient();
  const [validatedQuestions, setValidatedQuestions] = useState<QuizQuestion[]>([]);
  const [teacherInfo, setTeacherInfo] = useState<TeacherInfo | null>(null);
  const [systemPrompt, setSystemPrompt] = useState<string>(
    "Bonjour, je suis Futur Génie et je vais vous aider à créer un quiz pour vos élèves. Quelle a été la leçon du jour ?"
  );
  const [conversationHistory, setConversationHistory] = useState<Message[]>([]);
  const [masterQuestion, setMasterQuestion] = useState<QuizQuestion | null>(null);
  const [step, setStep] = useState<'create_master' | 'generate_variations' | 'review'>('create_master');
  const [isGeneratingVariations, setIsGeneratingVariations] = useState(false);

  useEffect(() => {
    async function loadTeacherInfo() {
      try {
        // Récupérer les informations de l'utilisateur depuis les métadonnées de l'utilisateur
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
          console.warn('Utilisateur non authentifié. Utilisation des valeurs par défaut.');
          return;
        }
        
        // Récupérer le prénom depuis les métadonnées utilisateur
        const surname = user.user_metadata?.surname || 'Enseignant';
        
        setTeacherInfo({
          surname: surname,
          // Nous n'avons pas besoin de la classe pour l'affichage initial
          class_name: 'Votre classe'
        });
        
        // Mettre à jour le message système avec le prénom de l'enseignant
        setSystemPrompt(`Bonjour ${surname}, je suis Futur Génie et je vais vous aider à créer un quiz pour vos élèves. Quelle a été la leçon du jour ?`);
      } catch (error) {
        console.error('Error loading teacher info:', error);
        toast.error('Erreur lors du chargement des informations');
      }
    };

    loadTeacherInfo();
  }, [supabase]);

  const handleSendMessage = async (message: string, history: Message[]) => {
    try {
      // Filtrer et formater correctement l'historique
      const formattedHistory = history
        .filter(msg => msg.role !== 'system') // Exclure les messages système
        .map(msg => ({
          role: msg.role,
          content: msg.content
        }));

      // Définir le contexte en fonction de l'étape actuelle
      let context = "";
      if (step === 'create_master') {
        context = "Tu es un assistant pédagogique nommé 'Futur Génie'. Tu dois aider l'enseignant à créer UNE SEULE question de quiz modèle (master question) basée sur ses instructions. Utilise un langage naturel, convivial et pédagogique. Explique ta démarche et propose une question de qualité qui servira de modèle pour générer d'autres questions similaires plus tard. N'hésite pas à être créatif et à adapter ton langage au niveau scolaire concerné. La question doit être présentée sous forme de QCM avec 4 options (A, B, C, D) dont une seule est correcte.";
      } else if (step === 'generate_variations') {
        context = "Tu es un assistant pédagogique nommé 'Futur Génie'. Je t'ai fourni une question modèle (master question). Génère 10 questions similaires en termes de difficulté et de format, mais avec un contenu différent. Utilise un langage naturel et pédagogique. Explique ta démarche et présente les questions générées de manière claire et structurée. Chaque question doit être un QCM avec 4 options (A, B, C, D) dont une seule est correcte.";
      }

      const response = await fetch('/api/deepseek/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message,
          history: formattedHistory,
          context: context
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('API Error:', errorData);
        throw new Error(errorData.error || 'Erreur lors de la communication avec Deepseek');
      }

      const data = await response.json();
      setConversationHistory(prev => [...prev, { role: 'user', content: message, timestamp: new Date() }, { role: 'assistant', content: data.response, timestamp: new Date() }]);
      return data.response;
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  };

  // La fonction cleanAndParseJSON a été remplacée par l'API de formatage
  
  const handleValidateQuestion = async (message: Message) => {
    try {
      console.log('Message à valider:', message);
      
      // Étape 1: Si le message n'a pas encore été validé, nous devons le formater
      if (!message.validated) {
        console.log('Première étape: validation du message textuel');
        
        // Marquer le message comme validé
        const updatedMessage = { ...message, validated: true };
        
        // Mettre à jour l'historique de conversation
        setConversationHistory(prev => {
          return prev.map(msg => 
            msg === message ? updatedMessage : msg
          );
        });
        
        // Envoyer la réponse à l'API de formatage pour la convertir en JSON
        try {
          const isArray = step === 'generate_variations'; // Si nous sommes à l'étape des variations, nous attendons un tableau
          
          toast.loading('Formatage de la réponse en cours...', {
            id: 'format-toast',
            duration: 10000
          });
          
          const formatResponse = await fetch('/api/deepseek/format', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              rawResponse: message.content,
              isArray
            }),
          });
          
          toast.dismiss('format-toast');
          
          if (!formatResponse.ok) {
            const errorData = await formatResponse.json();
            throw new Error(errorData.error || 'Erreur lors du formatage de la réponse');
          }
          
          const formatData = await formatResponse.json();
          const formattedContent = formatData.formattedResponse;
          
          console.log('Contenu formaté:', formattedContent);
          
          // Mettre à jour le message avec le contenu formaté
          const finalMessage = { ...updatedMessage, formattedContent };
          
          setConversationHistory(prev => {
            return prev.map(msg => 
              msg === updatedMessage ? finalMessage : msg
            );
          });
          
          // Maintenant que nous avons le contenu formaté, nous pouvons le traiter
          processFormattedContent(formattedContent);
        } catch (formatError) {
          console.error('Erreur lors du formatage:', formatError);
          toast.error(`Erreur lors du formatage: ${formatError instanceof Error ? formatError.message : 'Erreur inconnue'}`);
        }
      } else if (message.formattedContent) {
        // Étape 2: Le message a déjà été validé et formaté, nous pouvons traiter directement le contenu formaté
        console.log('Deuxième étape: traitement du contenu déjà formaté');
        processFormattedContent(message.formattedContent);
      } else {
        throw new Error('Le message a été validé mais ne contient pas de données formatées');
      }
    } catch (error) {
      console.error('Erreur lors de la validation:', error);
      toast.error(`Format de question invalide: ${error instanceof Error ? error.message : 'Erreur inconnue'}`);
    }
  };
  
  // Fonction pour traiter le contenu formaté
  const processFormattedContent = (questionData: any) => {
    try {
      console.log('Traitement des données formatées:', questionData);
      
      // Vérifier que les données ont le bon format
      if (Array.isArray(questionData)) {
        // C'est un tableau de questions
        if (questionData.length === 0) {
          throw new Error('Le tableau de questions est vide');
        }
        
        // Vérifier que chaque question a le bon format
        for (const question of questionData) {
          if (!question.question || !question.options || !question.correctAnswer) {
            console.warn('Question incomplète dans le tableau:', question);
          }
        }
      } else {
        // C'est une seule question
        if (!questionData.question || !questionData.options || !questionData.correctAnswer) {
          throw new Error('Format de question incomplet');
        }
      }
      
      if (step === 'create_master') {
        // Si nous sommes à l'étape de création de la master question
        // Vérifier que c'est bien une seule question et pas un tableau
        if (Array.isArray(questionData)) {
          // Si c'est un tableau mais qu'il ne contient qu'une seule question, on prend la première
          if (questionData.length === 1) {
            setMasterQuestion(questionData[0]);
          } else {
            throw new Error('Une seule question modèle est attendue, pas un tableau de questions');
          }
        } else {
          setMasterQuestion(questionData);
        }
        setStep('generate_variations');
        toast.success('Question modèle validée! Vous pouvez maintenant générer des variations.');
      } else if (step === 'generate_variations') {
        // Si nous sommes à l'étape de validation des variations
        // Vérifier si c'est un tableau de questions
        if (Array.isArray(questionData)) {
          setValidatedQuestions(questionData);
          setStep('review');
          toast.success(`${questionData.length} questions générées et validées!`);
        } else {
          // Si c'est une seule question
          setValidatedQuestions(prev => [...prev, questionData]);
          toast.success('Question validée et ajoutée au quiz');
        }
      }
    } catch (error) {
      console.error('Erreur lors du traitement des données formatées:', error);
      throw error; // Propager l'erreur pour qu'elle soit gérée par handleValidateQuestion
    }
  };
  
  // Fonction pour nettoyer le Markdown (astérisques, etc.) des réponses de Deepseek
  const cleanMarkdown = (text: string): string => {
    // Supprimer les astérisques utilisés pour le gras et l'italique
    let cleaned = text.replace(/\*\*(.+?)\*\*/g, '$1'); // Supprimer les ** pour le gras
    cleaned = cleaned.replace(/\*(.+?)\*/g, '$1');       // Supprimer les * pour l'italique
    
    // Supprimer les délimiteurs de titres
    cleaned = cleaned.replace(/^#+\s+(.+)$/gm, '$1');
    
    // Supprimer les délimiteurs de code inline
    cleaned = cleaned.replace(/`([^`]+)`/g, '$1');
    
    // Supprimer les liens Markdown mais garder le texte
    cleaned = cleaned.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1');
    
    return cleaned;
  };

  const handleGenerateVariations = async () => {
    if (!masterQuestion) {
      toast.error('Vous devez d\'abord valider une question modèle');
      return;
    }
    
    setIsGeneratingVariations(true);
    
    // Afficher un toast de longue durée pour indiquer que la génération est en cours
    toast.loading('Génération des questions en cours...', {
      duration: 60000, // 60 secondes, sera automatiquement fermé si la génération se termine avant
      id: 'generation-toast'
    });
    
    try {
      // Étape 1: Demander à Deepseek de générer des variations en langage naturel
      const message = `Voici ma question modèle: ${JSON.stringify(masterQuestion)}. Génère-moi 10 questions similaires en difficulté et format, mais avec un contenu différent. Pour chaque question, assure-toi d'inclure: la question, les 4 options (A, B, C, D), la réponse correcte, et une explication. Présente-les de façon structurée et claire.`;
      
      // Utiliser l'historique actuel pour maintenir le contexte
      const formattedHistory = conversationHistory
        .filter(msg => msg.role !== 'system')
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
          context: "Tu es un assistant pédagogique nommé 'Futur Génie'. Je t'ai fourni une question modèle. Génère 10 questions similaires en termes de difficulté et de format, mais avec un contenu différent. Utilise un langage naturel, convivial et pédagogique. Explique ta démarche et présente les questions générées de manière claire et structurée. Chaque question doit être un QCM avec 4 options (A, B, C, D) dont une seule est correcte. N'utilise pas de formatage Markdown comme les astérisques pour le gras ou l'italique."
        }),
      });
      
      if (!response.ok) {
        toast.dismiss('generation-toast');
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erreur lors de la communication avec Deepseek');
      }
      
      const data = await response.json();
      
      // Nettoyer le Markdown de la réponse
      const cleanedResponse = cleanMarkdown(data.response);
      
      // Ajouter les messages à l'historique
      const userMessage: Message = {
        role: 'user',
        content: message,
        timestamp: new Date()
      };
      
      const assistantMessage: Message = {
        role: 'assistant',
        content: cleanedResponse,
        timestamp: new Date(),
        validated: false // Marquer comme non validé initialement
      };
      
      setConversationHistory(prev => [...prev, userMessage, assistantMessage]);
      
      // Fermer le toast de génération
      toast.dismiss('generation-toast');
      toast.success('Questions générées! Veuillez valider pour continuer.');
      setIsGeneratingVariations(false);
    } catch (error) {
      console.error('Erreur lors de la génération des variations:', error);
      toast.error('Erreur lors de la génération des variations');
      setIsGeneratingVariations(false);
    }
  };

  const handleGenerateActivity = async () => {
    if (validatedQuestions.length === 0) {
      toast.error('Aucune question n\'a été validée');
      return;
    }

    try {
      // Récupérer l'ID de l'utilisateur connecté
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Non authentifié');
      
      // Demander à l'utilisateur de sélectionner une classe
      const classLevel = prompt('Pour quelle classe souhaitez-vous créer ce quiz? (ex: CP, CE1, CE2, CM1, CM2)');
      
      if (!classLevel) {
        toast.error('Vous devez spécifier une classe pour créer le quiz.');
        return;
      }

      // Afficher un toast pour indiquer que l'enregistrement est en cours
      const toastId = toast.loading('Enregistrement du quiz en cours...');
      
      // Enregistrer d'abord la question maîtresse si elle existe
      if (masterQuestion) {
        console.log('Enregistrement de la question maîtresse:', masterQuestion);
        const { error: masterQuestionError } = await supabase
          .from('master_questions')
          .insert({
            teacher_id: user.id,
            content: masterQuestion,
            created_at: new Date().toISOString()
          });
        
        if (masterQuestionError) {
          console.error('Erreur lors de l\'enregistrement de la question maîtresse:', masterQuestionError);
          // Continuer même en cas d'erreur
        } else {
          console.log('Question maîtresse enregistrée avec succès');
        }
      }

      // Créer l'activité
      const { data: activity, error: activityError } = await supabase
        .from('activities')
        .insert({
          type: 'quiz',
          class_level: classLevel,
          teacher_id: user.id,
          content: validatedQuestions,
          created_at: new Date().toISOString(),
          status: 'published'
        })
        .select()
        .single();

      if (activityError) throw activityError;

      toast.dismiss(toastId);
      toast.success('Quiz créé et publié avec succès !');
      router.push('/teacher/activities'); // Rediriger vers la liste des activités
    } catch (error) {
      console.error('Error creating activity:', error);
      toast.error('Erreur lors de la création de l\'activité');
    }
  };
  
  // Fonction pour mettre à jour les questions validées
  const handleUpdateQuestions = (updatedQuestions: QuizQuestion[]) => {
    setValidatedQuestions(updatedQuestions);
    toast.success('Questions mises à jour avec succès!');
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Créer un nouveau quiz</h1>
        
        {/* Étape actuelle */}
        <div className="mb-6 bg-gray-800 p-4 rounded-lg">
          <h2 className="text-xl font-semibold mb-2">Étape actuelle</h2>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step === 'create_master' || step === 'generate_variations' || step === 'review' ? 'bg-green-600' : 'bg-gray-600'}`}>1</div>
              <div className="h-1 w-8 bg-gray-600"></div>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step === 'generate_variations' || step === 'review' ? 'bg-green-600' : 'bg-gray-600'}`}>2</div>
              <div className="h-1 w-8 bg-gray-600"></div>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step === 'review' ? 'bg-green-600' : 'bg-gray-600'}`}>3</div>
            </div>
            <div className="text-white">
              {step === 'create_master' && 'Créer une question modèle'}
              {step === 'generate_variations' && 'Générer des variations'}
              {step === 'review' && 'Finaliser le quiz'}
            </div>
          </div>
        </div>
        
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-2">Instructions</h2>
          {step === 'create_master' && (
            <p className="text-gray-400">
              1. Décrivez le contenu ou le sujet du quiz que vous souhaitez créer
              <br />
              2. Futur Génie vous proposera une question modèle
              <br />
              3. Validez cette question ou demandez-en une autre
            </p>
          )}
          {step === 'generate_variations' && (
            <p className="text-gray-400">
              1. Vous avez validé une question modèle
              <br />
              2. Cliquez sur "Générer des variations" pour créer 10 questions similaires
              <br />
              3. Vous pourrez ensuite valider l'ensemble des questions générées
            </p>
          )}
          {step === 'review' && (
            <p className="text-gray-400">
              1. Vos questions ont été générées
              <br />
              2. Vous pouvez modifier chaque question individuellement
              <br />
              3. Cliquez sur "Créer le quiz" pour publier l'activité
            </p>
          )}
        </div>

        {/* Afficher l'interface de chat uniquement dans les étapes de création de question maître */}
        {(step === 'create_master' || step === 'generate_variations') && (
          <ChatInterface
            onSendMessage={handleSendMessage}
            onValidateMessage={handleValidateQuestion}
            onGenerateActivity={handleGenerateActivity}
            systemPrompt={systemPrompt}
          />
        )}
        
        {/* Animation de génération pendant le chargement */}
        {isGeneratingVariations && (
          <div className="mt-6">
            <GenerationAnimation />
          </div>
        )}
        
        {/* Bouton pour générer des variations après validation de la master question */}
        {step === 'generate_variations' && masterQuestion && !isGeneratingVariations && (
          <div className="mt-6 p-4 bg-gray-800 rounded-lg">
            <h3 className="text-lg font-semibold mb-2">Question modèle validée</h3>
            <div className="mb-4 p-3 bg-gray-700 rounded">
              <p><strong>Question:</strong> {masterQuestion.question}</p>
              <p><strong>Options:</strong></p>
              <ul className="list-disc pl-5">
                <li>A: {masterQuestion.options.A}</li>
                <li>B: {masterQuestion.options.B}</li>
                <li>C: {masterQuestion.options.C}</li>
                <li>D: {masterQuestion.options.D}</li>
              </ul>
              <p><strong>Réponse correcte:</strong> {masterQuestion.correctAnswer}</p>
              <p><strong>Explication:</strong> {masterQuestion.explanation}</p>
            </div>
            <Button 
              onClick={handleGenerateVariations} 
              disabled={isGeneratingVariations}
              className="w-full py-2 px-4 bg-indigo-600 hover:bg-indigo-700 rounded-lg font-medium"
            >
              Générer 10 questions similaires
            </Button>
          </div>
        )}

        {/* Interface de révision des questions */}
        {step === 'review' && validatedQuestions.length > 0 && (
          <div className="mt-6">
            <QuestionReview 
              questions={validatedQuestions}
              onUpdateQuestions={handleUpdateQuestions}
              onGenerateActivity={handleGenerateActivity}
            />
          </div>
        )}
      </div>
    </div>
  );
}
