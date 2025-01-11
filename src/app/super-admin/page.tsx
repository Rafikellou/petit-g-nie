'use client';

import { useState, useEffect } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
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
}

export default function SuperAdminDashboard() {
  const [activeTab, setActiveTab] = useState('questions');
  const [kpiData, setKpiData] = useState<KPIData | null>(null);
  const [loading, setLoading] = useState(false);
  const supabase = createClientComponentClient();

  // États pour les options des menus déroulants
  const [availableTopics, setAvailableTopics] = useState<string[]>([]);
  const [availableSpecificities, setAvailableSpecificities] = useState<string[]>([]);
  const [availableSubSpecificities, setAvailableSubSpecificities] = useState<{ name: string; period: string }[]>([]);

  // État pour le formulaire de Master Question
  const [masterQuestion, setMasterQuestion] = useState<QuestionGenerationParams>({
    class: '',
    subject: '',
    topics: [],
    specificities: [],
    subSpecificities: [],
    period: ''
  });

  // État pour les questions générées
  const [generatedQuestion, setGeneratedQuestion] = useState<GeneratedQuestion | null>(null);
  const [similarQuestions, setSimilarQuestions] = useState<GeneratedQuestion[]>([]);
  const [showSimilarQuestions, setShowSimilarQuestions] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Mise à jour des topics quand la classe ou la matière change
  useEffect(() => {
    if (masterQuestion.class && masterQuestion.subject) {
      const topics = getTopics(masterQuestion.class, masterQuestion.subject);
      setAvailableTopics(topics);
      // Réinitialiser les champs dépendants
      setMasterQuestion(prev => ({
        ...prev,
        topics: [],
        specificities: [],
        subSpecificities: [],
        period: ''
      }));
      setAvailableSpecificities([]);
      setAvailableSubSpecificities([]);
    }
  }, [masterQuestion.class, masterQuestion.subject]);

  // Mise à jour des spécificités quand le topic change
  useEffect(() => {
    if (masterQuestion.class && masterQuestion.subject && masterQuestion.topics[0]) {
      const specificities = getSpecificities(masterQuestion.class, masterQuestion.subject, masterQuestion.topics[0]);
      setAvailableSpecificities(specificities);
      // Réinitialiser les champs dépendants
      setMasterQuestion(prev => ({
        ...prev,
        specificities: [],
        subSpecificities: [],
        period: ''
      }));
      setAvailableSubSpecificities([]);
    }
  }, [masterQuestion.topics[0]]);

  // Mise à jour des sous-spécificités quand la spécificité change
  useEffect(() => {
    if (
      masterQuestion.class && 
      masterQuestion.subject && 
      masterQuestion.topics[0] && 
      masterQuestion.specificities[0]
    ) {
      const subSpecificities = getSubSpecificities(
        masterQuestion.class,
        masterQuestion.subject,
        masterQuestion.topics[0],
        masterQuestion.specificities[0]
      );
      setAvailableSubSpecificities(subSpecificities);
      // Réinitialiser la période
      setMasterQuestion(prev => ({
        ...prev,
        subSpecificities: [],
        period: ''
      }));
    }
  }, [masterQuestion.specificities[0]]);

  // Mise à jour automatique de la période
  useEffect(() => {
    if (masterQuestion.subSpecificities[0]) {
      const selectedSubSpecificity = availableSubSpecificities.find(
        ss => ss.name === masterQuestion.subSpecificities[0]
      );
      if (selectedSubSpecificity) {
        setMasterQuestion(prev => ({
          ...prev,
          period: selectedSubSpecificity.period
        }));
      }
    }
  }, [masterQuestion.subSpecificities[0]]);

  // Chargement des KPIs
  useEffect(() => {
    const loadKPIData = async () => {
      try {
        const { data: usersCount } = await supabase
          .from('profiles')
          .select('*', { count: 'exact' });

        const { data: schoolsCount } = await supabase
          .from('schools')
          .select('*', { count: 'exact' });

        const { data: teachersCount } = await supabase
          .from('profiles')
          .select('*', { count: 'exact' })
          .eq('role', 'teacher');

        // Récupérer les nouveaux utilisateurs des 30 derniers jours
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        const { data: newTeachers } = await supabase
          .from('profiles')
          .select('*', { count: 'exact' })
          .eq('role', 'teacher')
          .gte('created_at', thirtyDaysAgo.toISOString());

        const { data: newParents } = await supabase
          .from('profiles')
          .select('*', { count: 'exact' })
          .eq('role', 'parent')
          .gte('created_at', thirtyDaysAgo.toISOString());

        const { data: newAdmins } = await supabase
          .from('profiles')
          .select('*', { count: 'exact' })
          .eq('role', 'admin')
          .gte('created_at', thirtyDaysAgo.toISOString());

        setKpiData({
          totalUsers: usersCount?.count || 0,
          totalSchools: schoolsCount?.count || 0,
          totalTeachers: teachersCount?.count || 0,
          newUsers: {
            teachers: newTeachers?.count || 0,
            parents: newParents?.count || 0,
            admins: newAdmins?.count || 0,
          },
        });
      } catch (error) {
        console.error('Erreur lors du chargement des KPIs:', error);
        toast.error('Erreur lors du chargement des statistiques');
      }
    };

    loadKPIData();
  }, []);

  const handleGenerateQuestion = async () => {
    try {
      setIsLoading(true);
      setError(null);
      setGeneratedQuestion(null);

      if (!masterQuestion.class || !masterQuestion.subject || !masterQuestion.topics[0] || 
          !masterQuestion.specificities[0] || !masterQuestion.subSpecificities[0] || !masterQuestion.period) {
        throw new Error("Veuillez remplir tous les champs");
      }

      const response = await generateMasterQuestion({
        class: masterQuestion.class,
        subject: masterQuestion.subject,
        topic: masterQuestion.topics[0],
        specificity: masterQuestion.specificities[0],
        subSpecificity: masterQuestion.subSpecificities[0],
        period: masterQuestion.period
      });

      try {
        const parsedQuestion = JSON.parse(response);
        
        // Validation du format de la réponse
        if (!parsedQuestion.question || !parsedQuestion.options || !parsedQuestion.correctAnswer || !parsedQuestion.explanation) {
          throw new Error("La réponse de l'API ne contient pas tous les champs requis");
        }

        if (!["A", "B", "C", "D"].includes(parsedQuestion.correctAnswer)) {
          throw new Error("La réponse correcte doit être A, B, C ou D");
        }

        setGeneratedQuestion(parsedQuestion);
        toast.success("Question générée avec succès !");
      } catch (parseError) {
        console.error("Erreur lors du parsing de la réponse:", parseError);
        throw new Error("Format de réponse invalide de l'API");
      }
    } catch (error) {
      console.error("Erreur lors de la génération de la question:", error);
      setError(error instanceof Error ? error.message : "Erreur inconnue");
      toast.error(error instanceof Error ? error.message : "Erreur lors de la génération de la question");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerateSimilarQuestions = async () => {
    if (!generatedQuestion) return;
    
    setLoading(true);
    try {
      const questions = await generateSimilarQuestions(generatedQuestion);
      setSimilarQuestions(questions);
      setShowSimilarQuestions(true);
      toast.success('Questions similaires générées avec succès');
    } catch (error) {
      console.error('Erreur lors de la génération des questions similaires:', error);
      toast.error('Erreur lors de la génération des questions similaires');
    } finally {
      setLoading(false);
    }
  };

  const saveQuestionsToDatabase = async () => {
    if (!similarQuestions.length) return;

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('questions')
        .insert(
          similarQuestions.map(q => ({
            ...q,
            class: masterQuestion.class,
            subject: masterQuestion.subject,
            topics: masterQuestion.topics,
            specificities: masterQuestion.specificities,
            sub_specificities: masterQuestion.subSpecificities,
            period: masterQuestion.period,
            created_at: new Date().toISOString(),
          }))
        );

      if (error) throw error;
      toast.success('Questions enregistrées avec succès');
      setShowSimilarQuestions(false);
      setSimilarQuestions([]);
      setGeneratedQuestion(null);
    } catch (error) {
      console.error('Erreur lors de l\'enregistrement des questions:', error);
      toast.error('Erreur lors de l\'enregistrement des questions');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Espace Super Admin</h1>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-7 gap-4 mb-6">
          <TabsTrigger value="questions" className="flex items-center gap-2">
            <Brain className="w-4 h-4" />
            Questions
          </TabsTrigger>
          <TabsTrigger value="dictees" className="flex items-center gap-2">
            <PenTool className="w-4 h-4" />
            Dictées
          </TabsTrigger>
          <TabsTrigger value="histoires" className="flex items-center gap-2">
            <BookOpen className="w-4 h-4" />
            Histoires
          </TabsTrigger>
          <TabsTrigger value="blagues" className="flex items-center gap-2">
            <Laugh className="w-4 h-4" />
            Blagues
          </TabsTrigger>
          <TabsTrigger value="kpis" className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4" />
            KPIs
          </TabsTrigger>
          <TabsTrigger value="communaute" className="flex items-center gap-2">
            <Users className="w-4 h-4" />
            Communauté
          </TabsTrigger>
        </TabsList>

        <TabsContent value="questions">
          <Card>
            <CardContent className="p-6">
              <h2 className="text-2xl font-semibold mb-4">Création de Master Questions</h2>
              <div className="p-8">
                <h1 className="text-2xl font-bold mb-6">Création de Master Questions</h1>
                
                <div className="space-y-6 max-w-2xl">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Niveau académique</label>
                      <Select 
                        onValueChange={(value) => setMasterQuestion({...masterQuestion, class: value})}
                        value={masterQuestion.class}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionner un niveau" />
                        </SelectTrigger>
                        <SelectContent>
                          {getAvailableClasses().map((cls) => (
                            <SelectItem key={cls} value={cls}>
                              {cls}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-1">Matière</label>
                      <Select
                        onValueChange={(value) => setMasterQuestion({...masterQuestion, subject: value})}
                        value={masterQuestion.subject}
                        disabled={!masterQuestion.class}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionner une matière" />
                        </SelectTrigger>
                        <SelectContent>
                          {getAvailableSubjects().map((subject) => (
                            <SelectItem key={subject} value={subject}>
                              {subject}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">Thématique</label>
                    <Select 
                      onValueChange={(value) => setMasterQuestion({...masterQuestion, topics: [value]})}
                      value={masterQuestion.topics[0]}
                      disabled={!masterQuestion.subject}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner une thématique" />
                      </SelectTrigger>
                      <SelectContent>
                        {availableTopics.map((topic) => (
                          <SelectItem key={topic} value={topic}>
                            {topic}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">Compétence</label>
                    <Select 
                      onValueChange={(value) => setMasterQuestion({...masterQuestion, specificities: [value]})}
                      value={masterQuestion.specificities[0]}
                      disabled={!masterQuestion.topics[0]}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner une compétence" />
                      </SelectTrigger>
                      <SelectContent>
                        {availableSpecificities.map((specificity) => (
                          <SelectItem key={specificity} value={specificity}>
                            {specificity}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">Sous-compétence</label>
                    <Select 
                      onValueChange={(value) => setMasterQuestion({...masterQuestion, subSpecificities: [value]})}
                      value={masterQuestion.subSpecificities[0]}
                      disabled={!masterQuestion.specificities[0]}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner une sous-compétence" />
                      </SelectTrigger>
                      <SelectContent>
                        {availableSubSpecificities.map((subSpec) => (
                          <SelectItem key={subSpec.name} value={subSpec.name}>
                            {subSpec.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">Période</label>
                    <Select
                      value={masterQuestion.period || "non-definie"}
                      disabled
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Période automatiquement définie" />
                      </SelectTrigger>
                      <SelectContent>
                        {masterQuestion.period ? (
                          <SelectItem value={masterQuestion.period}>
                            {masterQuestion.period}
                          </SelectItem>
                        ) : (
                          <SelectItem value="non-definie">
                            Sélectionnez une sous-compétence
                          </SelectItem>
                        )}
                      </SelectContent>
                    </Select>
                  </div>

                  <button
                    className="w-full bg-purple-600 text-white py-2 px-4 rounded-md hover:bg-purple-700 transition-colors"
                    onClick={handleGenerateQuestion}
                    disabled={isLoading || !masterQuestion.subSpecificities[0]}
                  >
                    {isLoading ? (
                      <span className="flex items-center justify-center">
                        <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        Génération en cours...
                      </span>
                    ) : (
                      "Générer la question"
                    )}
                  </button>

                  {error && (
                    <div className="text-red-500 text-sm mt-2">{error}</div>
                  )}

                  {generatedQuestion && (
                    <div className="mt-8">
                      <h3 className="text-xl font-semibold mb-4">Question générée</h3>
                      <QuestionDisplay
                        question={generatedQuestion.question}
                        options={generatedQuestion.options}
                        correctAnswer={generatedQuestion.correctAnswer}
                        explanation={generatedQuestion.explanation}
                      />

                      <div className="mt-4 space-x-4">
                        <Button
                          onClick={handleGenerateSimilarQuestions}
                          disabled={loading}
                          className="bg-blue-600 hover:bg-blue-700"
                        >
                          {loading ? "Génération..." : "Générer des questions similaires"}
                        </Button>
                      </div>

                      {showSimilarQuestions && similarQuestions.length > 0 && (
                        <div className="mt-8">
                          <h3 className="text-xl font-semibold mb-4">Questions similaires</h3>
                          <div className="space-y-8">
                            {similarQuestions.map((question, index) => (
                              <div key={index} className="border-t pt-6">
                                <h4 className="text-lg font-medium mb-4">Question similaire {index + 1}</h4>
                                <QuestionDisplay
                                  question={question.question}
                                  options={question.options}
                                  correctAnswer={question.correctAnswer}
                                  explanation={question.explanation}
                                />
                              </div>
                            ))}
                          </div>
                          
                          <div className="mt-6">
                            <Button
                              onClick={saveQuestionsToDatabase}
                              disabled={loading}
                              className="bg-green-600 hover:bg-green-700"
                            >
                              {loading ? "Sauvegarde..." : "Sauvegarder les questions"}
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="kpis">
          <Card>
            <CardContent className="p-6">
              <h2 className="text-2xl font-semibold mb-4">Tableau de bord</h2>
              {kpiData && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="p-4 bg-white rounded-lg shadow">
                    <h3 className="text-sm font-medium text-gray-500">Total Utilisateurs</h3>
                    <p className="text-2xl font-bold">{kpiData.totalUsers}</p>
                  </div>
                  <div className="p-4 bg-white rounded-lg shadow">
                    <h3 className="text-sm font-medium text-gray-500">Total Écoles</h3>
                    <p className="text-2xl font-bold">{kpiData.totalSchools}</p>
                  </div>
                  <div className="p-4 bg-white rounded-lg shadow">
                    <h3 className="text-sm font-medium text-gray-500">Total Enseignants</h3>
                    <p className="text-2xl font-bold">{kpiData.totalTeachers}</p>
                  </div>
                  <div className="p-4 bg-white rounded-lg shadow">
                    <h3 className="text-sm font-medium text-gray-500">Nouveaux utilisateurs (30j)</h3>
                    <div className="space-y-1">
                      <p className="text-sm">Enseignants: {kpiData.newUsers.teachers}</p>
                      <p className="text-sm">Parents: {kpiData.newUsers.parents}</p>
                      <p className="text-sm">Admins: {kpiData.newUsers.admins}</p>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="dictees">
          <Card>
            <CardContent className="p-6">
              <h2 className="text-2xl font-semibold mb-4">Gestion des dictées</h2>
              <p className="text-gray-500">Cette fonctionnalité sera bientôt disponible.</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="histoires">
          <Card>
            <CardContent className="p-6">
              <h2 className="text-2xl font-semibold mb-4">Gestion des histoires</h2>
              <p className="text-gray-500">Cette fonctionnalité sera bientôt disponible.</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="blagues">
          <Card>
            <CardContent className="p-6">
              <h2 className="text-2xl font-semibold mb-4">Gestion des blagues</h2>
              <p className="text-gray-500">Cette fonctionnalité sera bientôt disponible.</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="communaute">
          <Card>
            <CardContent className="p-6">
              <h2 className="text-2xl font-semibold mb-4">Histoires de la communauté</h2>
              <p className="text-gray-500">Cette fonctionnalité sera bientôt disponible.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
