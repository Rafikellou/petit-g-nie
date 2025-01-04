'use client';

import { FC, useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, Users, BookOpen, Award, TrendingUp, Search, Loader2 } from 'lucide-react';
import { mockTeachers, mockStudents, mockProgress } from '@/data/users';
import type { StudentProgress } from '@/data/users';
import StudentProgress from '@/components/teacher/StudentProgress';
import { Toaster } from 'react-hot-toast';
import { Button } from '@/components/ui/ios-button';

// Simuler un enseignant connecté
const LOGGED_IN_TEACHER_ID = 'teacher1';

// Fonction pour calculer le pourcentage global de progression
const calculateOverallProgress = (progress: StudentProgress) => {
  if (!progress) return 0;
  
  // Calculer le pourcentage d'histoires complétées
  const storiesCompleted = Object.values(progress.storiesProgress || {}).reduce((total, characterStories) => {
    return total + Object.values(characterStories).filter(story => story.completed).length;
  }, 0);
  
  const totalStories = Object.values(progress.storiesProgress || {}).reduce((total, characterStories) => {
    return total + Object.keys(characterStories).length;
  }, 0);

  // Calculer la moyenne des scores des quiz
  const quizScores = Object.values(progress.quizResults || {}).map(quiz => quiz.score);
  const averageQuizScore = quizScores.length > 0 
    ? quizScores.reduce((a, b) => a + b, 0) / quizScores.length 
    : 0;

  // Combiner les métriques (50% histoires, 50% quiz)
  const storiesWeight = totalStories > 0 ? (storiesCompleted / totalStories) * 50 : 0;
  const quizWeight = quizScores.length > 0 ? (averageQuizScore / 100) * 50 : 0;

  return Math.round(storiesWeight + quizWeight);
};

const TeacherDashboard = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [teacher, setTeacher] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        await new Promise(resolve => setTimeout(resolve, 1000));
        const teacherData = mockTeachers[LOGGED_IN_TEACHER_ID];
        if (!teacherData) throw new Error("Enseignant non trouvé");
        setTeacher(teacherData);
      } catch (err) {
        setError("Une erreur est survenue lors du chargement des données");
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center safe-area-inset">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 safe-area-inset">
        <p className="text-red-500 text-lg mb-4">{error}</p>
        <Button onClick={() => window.location.reload()}>
          Réessayer
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background safe-area-inset">
      <header className="bg-surface-dark border-b border-white/10 pt-safe-top">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            <Link 
              href="/"
              className="flex items-center space-x-2 text-white hover:text-white/80 transition tap-target touch-manipulation"
              aria-label="Retour à l'accueil"
            >
              <ArrowLeft className="w-6 h-6" />
              <span className="text-lg font-medium">Retour</span>
            </Link>
            <h1 className="text-xl font-bold">Espace Enseignant</h1>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Statistiques générales */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="glass-card p-6">
            <div className="flex items-center space-x-4">
              <div className="rounded-full bg-primary/20 p-3">
                <Users className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-white/70">Élèves</p>
                <p className="text-2xl font-bold">{teacher?.students?.length || 0}</p>
              </div>
            </div>
          </div>
          
          <div className="glass-card p-6">
            <div className="flex items-center space-x-4">
              <div className="rounded-full bg-green-500/20 p-3">
                <BookOpen className="w-6 h-6 text-green-400" />
              </div>
              <div>
                <p className="text-sm text-white/70">Histoires lues</p>
                <p className="text-2xl font-bold">24</p>
              </div>
            </div>
          </div>
          
          <div className="glass-card p-6">
            <div className="flex items-center space-x-4">
              <div className="rounded-full bg-yellow-500/20 p-3">
                <Award className="w-6 h-6 text-yellow-400" />
              </div>
              <div>
                <p className="text-sm text-white/70">Points moyens</p>
                <p className="text-2xl font-bold">850</p>
              </div>
            </div>
          </div>
          
          <div className="glass-card p-6">
            <div className="flex items-center space-x-4">
              <div className="rounded-full bg-purple-500/20 p-3">
                <TrendingUp className="w-6 h-6 text-purple-400" />
              </div>
              <div>
                <p className="text-sm text-white/70">Progression</p>
                <p className="text-2xl font-bold">+12%</p>
              </div>
            </div>
          </div>
        </div>

        {/* Barre de recherche */}
        <div className="relative mb-8">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-white/40" />
          </div>
          <input
            type="text"
            placeholder="Rechercher un élève..."
            className="block w-full pl-10 pr-3 py-3 bg-surface-dark border border-white/10 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent min-h-[44px]"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Liste des élèves */}
        <div className="space-y-4">
          {teacher?.students?.map((studentId: string) => {
            const student = mockStudents[studentId];
            const progress = mockProgress[studentId];
            if (!student) return null;

            const overallProgress = calculateOverallProgress(progress);

            return (
              <div 
                key={studentId}
                className="glass-card p-6 hover:bg-white/5 transition cursor-pointer tap-target touch-manipulation"
                onClick={() => setSelectedStudentId(studentId)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                      <span className="text-lg font-bold">{student.name[0]}</span>
                    </div>
                    <div>
                      <h3 className="text-lg font-medium">{student.name}</h3>
                      <p className="text-sm text-white/70">{student.class}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-white/70">Progression</p>
                    <p className="text-lg font-bold">{overallProgress}%</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </main>

      {/* Modal de progression détaillée */}
      {selectedStudentId && (
        <StudentProgress
          student={mockStudents[selectedStudentId]}
          progress={mockProgress[selectedStudentId]}
          onClose={() => setSelectedStudentId(null)}
        />
      )}

      <Toaster />
    </div>
  );
};

export default TeacherDashboard;
