'use client';

import { useState, useEffect } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useRouter } from 'next/navigation';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  BarChart3,
  BookOpen,
  Brain,
  Edit3,
  Laugh,
  MessageSquare,
  Menu,
  PenTool,
  Users,
} from 'lucide-react';
import { generateMasterQuestion, generateSimilarQuestions, QuestionGenerationParams } from '@/services/deepseek';
import { toast } from 'sonner';
import {
  getAvailableClasses,
  getAvailableSubjects,
  getTopics,
  getSpecificities,
  getSubSpecificities,
  getPeriods
} from '@/services/masterQuestions';
import { QuestionDisplay } from '@/components/questions/QuestionDisplay';

interface KPIData {
  totalUsers: number;
  totalSchools: number;
  totalTeachers: number;
  newUsers: {
    teachers: number;
    parents: number;
    admins: number;
  };
}

interface GeneratedQuestion {
  question: string;
  options: {
    A: string;
    B: string;
    C: string;
    D: string;
  };
  correctAnswer: string;
  explanation: string;
  type: 'short' | 'long' | 'image';
}

interface FormState {
  availableTopics: string[];
  availableSpecificities: string[];
  availableSubSpecificities: { name: string; period: string }[];
  availableClasses: string[];
  availableSubjects: string[];
  availablePeriods: string[];
  selectedClass: string;
  selectedSubject: string;
  selectedTopic: string;
  selectedSpecificity: string;
  selectedSubSpecificity: string;
  selectedPeriod: string;
  selectedDifficulty: string;
  questionPrompt: string;
  generatedQuestions: GeneratedQuestion[];
  masterQuestion: QuestionGenerationParams;
  generatedQuestion: GeneratedQuestion | null;
  similarQuestions: GeneratedQuestion[];
  showSimilarQuestions: boolean;
  showInstructions: boolean;
  isEditing: boolean;
  editedQuestion: GeneratedQuestion | null;
  error: string | null;
  isLoading: boolean;
}

const initialFormState: FormState = {
  availableTopics: [],
  availableSpecificities: [],
  availableSubSpecificities: [],
  availableClasses: [],
  availableSubjects: [],
  availablePeriods: [],
  selectedClass: '',
  selectedSubject: '',
  selectedTopic: '',
  selectedSpecificity: '',
  selectedSubSpecificity: '',
  selectedPeriod: '',
  selectedDifficulty: '',
  questionPrompt: '',
  generatedQuestions: [],
  masterQuestion: {
    class_level: '',
    subject: '',
    topics: [],
    specificities: [],
    subSpecificities: [],
    period: ''
  },
  generatedQuestion: null,
  similarQuestions: [],
  showSimilarQuestions: false,
  showInstructions: false,
  isEditing: false,
  editedQuestion: null,
  error: null,
  isLoading: false
};

export default function SuperAdminDashboard() {
  const router = useRouter();
  const supabase = createClientComponentClient();
  
  const [activeTab, setActiveTab] = useState('questions');
  const [loading, setLoading] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [formState, setFormState] = useState<FormState>(initialFormState);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [kpiData, setKpiData] = useState<KPIData | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const checkRole = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
          router.push('/auth');
          return;
        }
        
        const userRole = user.user_metadata?.role;
          
        if (userRole !== 'super_admin') {
          router.push('/');
          return;
        }
        
        setIsAuthorized(true);
      } catch (error) {
        console.error('Error checking role:', error);
        router.push('/auth');
      }
    };
    
    checkRole();
  }, [supabase, router]);

  // Charger les données initiales
  useEffect(() => {
    if (isAuthorized) {
      const loadInitialData = async () => {
        try {
          const classes = await getAvailableClasses();
          const subjects = await getAvailableSubjects();
          const periods = await getPeriods();
          const kpis = await loadKPIData();
          
          setFormState(prev => ({
            ...prev,
            availableClasses: classes,
            availableSubjects: subjects,
            availablePeriods: periods
          }));
          setKpiData(kpis);
        } catch (error) {
          console.error('Error loading initial data:', error);
          toast.error('Erreur lors du chargement des données');
        }
      };

      loadInitialData();
    }
  }, [isAuthorized]);

  // Mise à jour des topics quand la classe ou la matière change
  useEffect(() => {
    if (formState.masterQuestion.class_level && formState.masterQuestion.subject) {
      const topics = getTopics(formState.masterQuestion.class_level, formState.masterQuestion.subject);
      setFormState(prev => ({
        ...prev,
        availableTopics: topics,
        masterQuestion: {
          ...prev.masterQuestion,
          topics: [],
          specificities: [],
          subSpecificities: [],
          period: ''
        }
      }));
    }
  }, [formState.masterQuestion.class_level, formState.masterQuestion.subject]);

  // Mise à jour des spécificités quand le topic change
  useEffect(() => {
    if (formState.masterQuestion.class_level && 
        formState.masterQuestion.subject && 
        formState.masterQuestion.topics[0]) {
      const specificities = getSpecificities(
        formState.masterQuestion.class_level, 
        formState.masterQuestion.subject, 
        formState.masterQuestion.topics[0]
      );
      setFormState(prev => ({
        ...prev,
        availableSpecificities: specificities,
        masterQuestion: {
          ...prev.masterQuestion,
          specificities: [],
          subSpecificities: [],
          period: ''
        }
      }));
    }
  }, [formState.masterQuestion.topics[0]]);

  // Mise à jour des sous-spécificités quand la spécificité change
  useEffect(() => {
    if (formState.masterQuestion.class_level && 
        formState.masterQuestion.subject && 
        formState.masterQuestion.topics[0] && 
        formState.masterQuestion.specificities[0]) {
      const subSpecificities = getSubSpecificities(
        formState.masterQuestion.class_level,
        formState.masterQuestion.subject,
        formState.masterQuestion.topics[0],
        formState.masterQuestion.specificities[0]
      );
      setFormState(prev => ({
        ...prev,
        availableSubSpecificities: subSpecificities,
        masterQuestion: {
          ...prev.masterQuestion,
          subSpecificities: [],
          period: ''
        }
      }));
    }
  }, [formState.masterQuestion.specificities[0]]);

  // Mise à jour automatique de la période
  useEffect(() => {
    if (formState.masterQuestion.subSpecificities[0]) {
      const selectedSubSpecificity = formState.availableSubSpecificities.find(
        ss => ss.name === formState.masterQuestion.subSpecificities[0]
      );
      if (selectedSubSpecificity) {
        setFormState(prev => ({
          ...prev,
          masterQuestion: {
            ...prev.masterQuestion,
            period: selectedSubSpecificity.period
          }
        }));
      }
    }
  }, [formState.masterQuestion.subSpecificities[0], formState.availableSubSpecificities]);

  if (!isAuthorized) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">Vérification des autorisations...</h2>
          <p className="text-gray-400">Veuillez patienter</p>
        </div>
      </div>
    );
  }

  const updateFormState = (key: keyof FormState, value: any) => {
    setFormState(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const loadKPIData = async () => {
    try {
      const { data: usersCount } = await supabase
        .from('user_details')
        .select('*, users!inner(*)', { count: 'exact' });

      const { data: schoolsCount } = await supabase
        .from('ecole')
        .select('*', { count: 'exact' });

      const { data: teachersCount } = await supabase
        .from('user_details')
        .select('*, users!inner(*)', { count: 'exact' })
        .eq('users.role', 'teacher');

      // Récupérer les nouveaux utilisateurs des 30 derniers jours
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      const { data: newTeachers } = await supabase
        .from('user_details')
        .select('*, users!inner(*)', { count: 'exact' })
        .eq('users.role', 'teacher')
        .gte('user_details.created_at', thirtyDaysAgo.toISOString());

      const { data: newParents } = await supabase
        .from('user_details')
        .select('*, users!inner(*)', { count: 'exact' })
        .eq('users.role', 'parent')
        .gte('user_details.created_at', thirtyDaysAgo.toISOString());

      const { data: newAdmins } = await supabase
        .from('user_details')
        .select('*, users!inner(*)', { count: 'exact' })
        .eq('users.role', 'admin')
        .gte('user_details.created_at', thirtyDaysAgo.toISOString());

      return {
        totalUsers: usersCount?.length || 0,
        totalSchools: schoolsCount?.length || 0,
        totalTeachers: teachersCount?.length || 0,
        newUsers: {
          teachers: newTeachers?.length || 0,
          parents: newParents?.length || 0,
          admins: newAdmins?.length || 0,
        },
      };
    } catch (error) {
      console.error('Erreur lors du chargement des KPIs:', error);
      toast.error('Erreur lors du chargement des statistiques');
    }
  };

  const handleGenerateQuestion = async () => {
    try {
      setIsGenerating(true);
      updateFormState('error', null);
      updateFormState('generatedQuestion', null);

      if (!formState.masterQuestion.class_level || !formState.masterQuestion.subject || !formState.masterQuestion.topics[0] || 
          !formState.masterQuestion.specificities[0] || !formState.masterQuestion.subSpecificities[0] || !formState.masterQuestion.period) {
        throw new Error("Veuillez remplir tous les champs");
      }

      const response = await generateMasterQuestion({
        ...formState.masterQuestion
      });

      // La réponse est déjà un objet JSON parsé
      console.log("Réponse complète:", response);
      
      // Validation du format de la réponse
      if (!response.question || !response.options || !response.correctAnswer || !response.explanation || !response.type) {
        throw new Error("La réponse de l'API ne contient pas tous les champs requis");
      }

      if (!["A", "B", "C", "D"].includes(response.correctAnswer)) {
        throw new Error("La réponse correcte doit être A, B, C ou D");
      }

      if (!["short", "long", "image"].includes(response.type)) {
        throw new Error("Le type de question doit être short, long ou image");
      }

      updateFormState('generatedQuestion', response);
      toast.success("Question générée avec succès !");
    } catch (error) {
      console.error("Erreur lors de la génération de la question:", error);
      updateFormState('error', error instanceof Error ? error.message : "Erreur inconnue");
      toast.error(error instanceof Error ? error.message : "Erreur lors de la génération de la question");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleRegenerateQuestion = async () => {
    setIsGenerating(true);
    try {
      const response = await generateMasterQuestion({
        ...formState.masterQuestion
      });
      updateFormState('generatedQuestion', response);
      updateFormState('showSimilarQuestions', false);
      updateFormState('similarQuestions', []);
    } catch (error) {
      updateFormState('error', 'Erreur lors de la génération de la question');
      toast.error('Erreur lors de la génération de la question');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSendAdditionalInstructions = async () => {
    setIsGenerating(true);
    try {
      const response = await generateMasterQuestion({
        ...formState.masterQuestion
      });
      updateFormState('generatedQuestion', response);
      updateFormState('showSimilarQuestions', false);
      updateFormState('similarQuestions', []);
      updateFormState('showInstructions', false); // Ferme la zone de texte après l'envoi
    } catch (error) {
      updateFormState('error', 'Erreur lors de la génération de la question');
      toast.error('Erreur lors de la génération de la question');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSaveEditedQuestion = async () => {
    if (!formState.editedQuestion) return;
    updateFormState('generatedQuestion', formState.editedQuestion);
    updateFormState('isEditing', false);
  };

  const handleGenerateSimilarQuestions = async () => {
    if (!formState.generatedQuestion) return;
    
    setLoading(true);
    try {
      const questions = await generateSimilarQuestions(formState.generatedQuestion);
      updateFormState('similarQuestions', questions);
      updateFormState('showSimilarQuestions', true);
      toast.success('Questions similaires générées avec succès');
    } catch (error) {
      console.error('Erreur lors de la génération des questions similaires:', error);
      toast.error('Erreur lors de la génération des questions similaires');
    } finally {
      setLoading(false);
    }
  };

  const saveQuestionsToDatabase = async () => {
    if (!formState.generatedQuestion || !formState.similarQuestions.length) return;

    setLoading(true);
    try {
      // 1. D'abord, sauvegarder la question master
      const { data: masterQuestionData, error: masterError } = await supabase
        .from('master_questions')
        .insert({
          question: formState.generatedQuestion.question,
          options: formState.generatedQuestion.options,
          correct_answer: formState.generatedQuestion.correctAnswer,
          explanation: formState.generatedQuestion.explanation,
          type: formState.generatedQuestion.type,
          class_level: formState.masterQuestion.class_level,
          subject: formState.masterQuestion.subject,
          topic: formState.masterQuestion.topics[0],
          specificity: formState.masterQuestion.specificities[0],
          "sub-specificity": formState.masterQuestion.subSpecificities[0],
          period: formState.masterQuestion.period,
          created_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (masterError) {
        console.error('Erreur lors de la sauvegarde de la question master:', masterError);
        throw new Error(`Erreur lors de la sauvegarde de la question master: ${masterError.message}`);
      }

      if (!masterQuestionData) {
        throw new Error('Aucune donnée retournée après la sauvegarde de la question master');
      }

      console.log('Question master sauvegardée:', masterQuestionData);

      // 2. Préparer les données des questions similaires
      const similarQuestionsData = formState.similarQuestions.map(q => ({
        question: q.question,
        options: q.options,
        correct_answer: q.correctAnswer,
        explanation: q.explanation,
        type: q.type,
        class_level: formState.masterQuestion.class_level,
        subject: formState.masterQuestion.subject,
        topic: formState.masterQuestion.topics[0],
        specificity: formState.masterQuestion.specificities[0],
        "sub-specificity": formState.masterQuestion.subSpecificities[0],
        period: formState.masterQuestion.period,
        created_at: new Date().toISOString(),
        master_question_id: masterQuestionData.id
      }));

      console.log('Tentative de sauvegarde des questions similaires:', similarQuestionsData);

      // 3. Sauvegarder les questions similaires
      const { data: savedQuestions, error: similarError } = await supabase
        .from('questions')
        .insert(similarQuestionsData)
        .select();

      if (similarError) {
        console.error('Erreur lors de la sauvegarde des questions similaires:', similarError);
        throw new Error(`Erreur lors de la sauvegarde des questions similaires: ${similarError.message}`);
      }

      console.log('Questions similaires sauvegardées:', savedQuestions);

      toast.success('Questions enregistrées avec succès');
      updateFormState('showSimilarQuestions', false);
      updateFormState('similarQuestions', []);
      updateFormState('generatedQuestion', null);
    } catch (error) {
      console.error('Erreur lors de l\'enregistrement des questions:', error);
      toast.error(error instanceof Error ? error.message : 'Erreur lors de l\'enregistrement des questions');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-20">
      <div className="relative">
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
        >
          <Menu className="w-4 h-4 sm:w-5 sm:h-5" />
          <span className="hidden sm:inline">Menu</span>
        </button>

        {/* Menu déroulant */}
        {isMenuOpen && (
          <div className="absolute left-0 mt-2 w-48 rounded-md shadow-lg bg-[#1A1A1B] border border-white/10 z-50">
            <nav className="py-1">
              <button
                onClick={() => {
                  setActiveTab("questions");
                  setIsMenuOpen(false);
                }}
                className="w-full text-left px-4 py-2 text-sm hover:bg-white/5 flex items-center gap-2"
              >
                <PenTool className="w-4 h-4" />
                <span>Questions</span>
              </button>
              <button
                onClick={() => {
                  setActiveTab("kpis");
                  setIsMenuOpen(false);
                }}
                className="w-full text-left px-4 py-2 text-sm hover:bg-white/5 flex items-center gap-2"
              >
                <BarChart3 className="w-4 h-4" />
                <span>Statistiques</span>
              </button>
              <button
                onClick={() => {
                  setActiveTab("dictees");
                  setIsMenuOpen(false);
                }}
                className="w-full text-left px-4 py-2 text-sm hover:bg-white/5 flex items-center gap-2"
              >
                <Edit3 className="w-4 h-4" />
                <span>Dictées</span>
              </button>
              <button
                onClick={() => {
                  setActiveTab("histoires");
                  setIsMenuOpen(false);
                }}
                className="w-full text-left px-4 py-2 text-sm hover:bg-white/5 flex items-center gap-2"
              >
                <BookOpen className="w-4 h-4" />
                <span>Histoires</span>
              </button>
              <button
                onClick={() => {
                  setActiveTab("blagues");
                  setIsMenuOpen(false);
                }}
                className="w-full text-left px-4 py-2 text-sm hover:bg-white/5 flex items-center gap-2"
              >
                <Laugh className="w-4 h-4" />
                <span>Blagues</span>
              </button>
              <button
                onClick={() => {
                  setActiveTab("communaute");
                  setIsMenuOpen(false);
                }}
                className="w-full text-left px-4 py-2 text-sm hover:bg-white/5 flex items-center gap-2"
              >
                <Users className="w-4 h-4" />
                <span>Communauté</span>
              </button>
            </nav>
          </div>
        )}
      </div>

      <main className="p-4">
        {activeTab === "questions" && (
          <div className="space-y-4">
            <div className="card p-4">
              <div className="space-y-4">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Classe</label>
                    <Select
                      value={formState.masterQuestion.class_level}
                      onValueChange={(value) => updateFormState('masterQuestion', {
                        ...formState.masterQuestion,
                        class_level: value,
                        subject: '',
                        topics: [],
                        specificities: [],
                        subSpecificities: [],
                        period: ''
                      })}
                    >
                      <SelectTrigger className="select-trigger w-full">
                        <SelectValue placeholder="Sélectionner une classe" />
                      </SelectTrigger>
                      <SelectContent className="select-content">
                        {formState.availableClasses.map((c) => (
                          <SelectItem key={c} value={c} className="select-item">{c}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Matière</label>
                    <Select
                      value={formState.masterQuestion.subject}
                      onValueChange={(value) => updateFormState('masterQuestion', {
                        ...formState.masterQuestion,
                        subject: value,
                        topics: [],
                        specificities: [],
                        subSpecificities: [],
                        period: ''
                      })}
                    >
                      <SelectTrigger className="select-trigger w-full">
                        <SelectValue placeholder="Sélectionner une matière" />
                      </SelectTrigger>
                      <SelectContent className="select-content">
                        {formState.availableSubjects.map((s) => (
                          <SelectItem key={s} value={s} className="select-item">{s}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Thématique</label>
                    <Select
                      value={formState.masterQuestion.topics[0] || ''}
                      onValueChange={(value) => updateFormState('masterQuestion', {
                        ...formState.masterQuestion,
                        topics: [value],
                        specificities: [],
                        subSpecificities: [],
                        period: ''
                      })}
                    >
                      <SelectTrigger className="select-trigger w-full">
                        <SelectValue placeholder="Sélectionner une thématique" />
                      </SelectTrigger>
                      <SelectContent className="select-content">
                        {formState.availableTopics.map((t) => (
                          <SelectItem key={t} value={t} className="select-item">{t}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Compétence</label>
                    <Select
                      value={formState.masterQuestion.specificities[0] || ''}
                      onValueChange={(value) => updateFormState('masterQuestion', {
                        ...formState.masterQuestion,
                        specificities: [value],
                        subSpecificities: [],
                        period: ''
                      })}
                    >
                      <SelectTrigger className="select-trigger w-full">
                        <SelectValue placeholder="Sélectionner une compétence" />
                      </SelectTrigger>
                      <SelectContent className="select-content">
                        {formState.availableSpecificities.map((s) => (
                          <SelectItem key={s} value={s} className="select-item">{s}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Sous-compétence</label>
                    <Select
                      value={formState.masterQuestion.subSpecificities[0] || ''}
                      onValueChange={(value) => updateFormState('masterQuestion', {
                        ...formState.masterQuestion,
                        subSpecificities: [value]
                      })}
                    >
                      <SelectTrigger className="select-trigger w-full">
                        <SelectValue placeholder="Sélectionner une sous-compétence" />
                      </SelectTrigger>
                      <SelectContent className="select-content">
                        {formState.availableSubSpecificities.map((ss) => (
                          <SelectItem key={ss.name} value={ss.name} className="select-item">{ss.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <Button
                  onClick={handleGenerateQuestion}
                  disabled={isGenerating}
                  className="btn-primary w-full"
                >
                  {isGenerating ? (
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Génération...</span>
                    </div>
                  ) : (
                    "Générer une question"
                  )}
                </Button>
                
                {formState.generatedQuestion && (
                  <div className="flex flex-col gap-2">
                    <Button
                      onClick={handleRegenerateQuestion}
                      variant="outline"
                      className="w-full"
                      disabled={isGenerating}
                    >
                      Régénérer
                    </Button>
                    <Button
                      onClick={handleGenerateSimilarQuestions}
                      variant="outline"
                      className="w-full"
                      disabled={isGenerating || formState.showSimilarQuestions}
                    >
                      Questions similaires
                    </Button>
                  </div>
                )}
              </div>
            </div>

            {formState.showSimilarQuestions && formState.similarQuestions.length > 0 && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Questions similaires :</h3>
                {formState.similarQuestions.map((q, index) => (
                  <div key={index} className="card p-4">
                    <QuestionDisplay
                      question={q.question}
                      options={q.options}
                      correctAnswer={q.correctAnswer}
                      explanation={q.explanation}
                    />
                  </div>
                ))}
                <Button 
                  onClick={saveQuestionsToDatabase}
                  disabled={loading}
                  className="btn-primary w-full"
                >
                  {loading ? "Sauvegarde..." : "Sauvegarder toutes les questions"}
                </Button>
              </div>
            )}
          </div>
        )}

        {activeTab === "kpis" && (
          <div className="card p-4">
            <h2 className="text-lg font-semibold mb-4">Tableau de bord</h2>
            {kpiData && (
              <div className="grid grid-cols-1 gap-4">
                <div className="p-4 bg-white rounded-lg shadow-sm border">
                  <h3 className="text-sm font-medium text-gray-500">Total Utilisateurs</h3>
                  <p className="text-xl font-bold mt-1">{kpiData.totalUsers}</p>
                </div>
                <div className="p-4 bg-white rounded-lg shadow-sm border">
                  <h3 className="text-sm font-medium text-gray-500">Total Écoles</h3>
                  <p className="text-xl font-bold mt-1">{kpiData.totalSchools}</p>
                </div>
                <div className="p-4 bg-white rounded-lg shadow-sm border">
                  <h3 className="text-sm font-medium text-gray-500">Total Enseignants</h3>
                  <p className="text-xl font-bold mt-1">{kpiData.totalTeachers}</p>
                </div>
                <div className="p-4 bg-white rounded-lg shadow-sm border">
                  <h3 className="text-sm font-medium text-gray-500 mb-2">Nouveaux utilisateurs (30j)</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Enseignants</span>
                      <span className="font-medium">{kpiData.newUsers.teachers}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Parents</span>
                      <span className="font-medium">{kpiData.newUsers.parents}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Admins</span>
                      <span className="font-medium">{kpiData.newUsers.admins}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === "dictees" && (
          <div className="card p-4">
            <h2 className="text-lg font-semibold mb-2">Dictées</h2>
            <p className="text-sm text-gray-500">Bientôt disponible</p>
          </div>
        )}

        {activeTab === "histoires" && (
          <div className="card p-4">
            <h2 className="text-lg font-semibold mb-2">Histoires</h2>
            <p className="text-sm text-gray-500">Bientôt disponible</p>
          </div>
        )}

        {activeTab === "blagues" && (
          <div className="card p-4">
            <h2 className="text-lg font-semibold mb-2">Blagues</h2>
            <p className="text-sm text-gray-500">Bientôt disponible</p>
          </div>
        )}

        {activeTab === "communaute" && (
          <div className="card p-4">
            <h2 className="text-lg font-semibold mb-2">Communauté</h2>
            <p className="text-sm text-gray-500">Bientôt disponible</p>
          </div>
        )}
      </main>
    </div>
  );
}
