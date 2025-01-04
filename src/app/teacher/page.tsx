'use client';

import { FC, useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, Users, BookOpen, Award, TrendingUp, Search, Loader2 } from 'lucide-react';
import { mockTeachers, mockStudents, mockProgress } from '@/data/users';
import type { StudentProgress as StudentProgressType } from '@/data/users';
import type { Teacher } from '@/types/teacher';
import { StudentProgressComponent } from '@/components/teacher/StudentProgress';
import { Toaster } from 'react-hot-toast';
import { Button } from '@/components/ui/ios-button';

// Simuler un enseignant connecté
const LOGGED_IN_TEACHER_ID = 'teacher1';

// Fonction pour calculer le pourcentage global de progression
const calculateOverallProgress = (progress: StudentProgressType) => {
  if (!progress) return 0;
  
  // Calculer le pourcentage d'histoires complétées
  const storiesCompleted = Object.values(progress.storiesProgress || {}).reduce((total, characterStories) => {
    return total + Object.values(characterStories).filter(story => story.completed).length;
  }, 0);

  // Calculer le total d'histoires
  const totalStories = Object.values(progress.storiesProgress || {}).reduce((total, characterStories) => {
    return total + Object.values(characterStories).length;
  }, 0);

  // Calculer le pourcentage
  return totalStories > 0 ? (storiesCompleted / totalStories) * 100 : 0;
};

const TeacherDashboard: FC = () => {
  const [teacher, setTeacher] = useState<Teacher | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null);

  useEffect(() => {
    // Simuler le chargement des données
    const loadTeacherData = async () => {
      try {
        // Simuler un délai réseau
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Trouver l'enseignant connecté
        const foundTeacher = mockTeachers.find(t => t.id === LOGGED_IN_TEACHER_ID);
        if (foundTeacher) {
          setTeacher(foundTeacher);
        }
      } catch (error) {
        console.error('Erreur lors du chargement des données:', error);
      } finally {
        setLoading(false);
      }
    };

    loadTeacherData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  if (!teacher) {
    return (
      <div className="p-4">
        <p>Erreur: Impossible de charger les données de l'enseignant.</p>
      </div>
    );
  }

  // Filtrer les élèves en fonction de la recherche
  const filteredStudents = teacher.class.students.filter(student =>
    student.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
                <p className="text-2xl font-bold">{teacher.class.students.length}</p>
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
          {filteredStudents.map((studentId: string) => {
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
        <StudentProgressComponent
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
