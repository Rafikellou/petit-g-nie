'use client';

import { FC, useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, Users, BookOpen, Award, TrendingUp, Search, Loader2 } from 'lucide-react';
import { mockTeachers, mockStudents, mockProgress } from '@/data/users';
import type { StudentProgress as StudentProgressType } from '@/data/users';
import { StudentProgressComponent } from '@/components/teacher/StudentProgress';
import { Toaster } from 'react-hot-toast';
import { Button } from '@/components/ui/ios-button';

// Simuler un enseignant connecté
const LOGGED_IN_TEACHER_ID = 'teacher1';

interface TeacherType {
  id: string;
  class: {
    name: string;
    students: {
      id: string;
      name: string;
      class: string;
      avatar?: string;
      progress: StudentProgressType;
    }[];
  };
  stats: {
    averageClassProgress: number;
  };
}

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
  const [teacher, setTeacher] = useState<TeacherType | null>(null);
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
        const foundTeacher = mockTeachers.find((t: TeacherType) => t.id === LOGGED_IN_TEACHER_ID);
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
      <Toaster />
      {/* En-tête */}
      <header className="bg-gradient-to-b from-primary to-primary/80 text-white p-6">
        <div className="flex items-center justify-between mb-8">
          <Link href="/" className="flex items-center space-x-2">
            <ArrowLeft className="w-6 h-6" />
            <span>Retour</span>
          </Link>
        </div>

        {/* Statistiques rapides */}
        <div className="grid grid-cols-2 gap-4">
          <div className="glass-card p-4">
            <div className="flex items-start justify-between">
              <div className="p-2 bg-white/10 rounded-lg">
                <Users className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm text-white/70">Élèves</p>
                <p className="text-2xl font-bold">{teacher.class.students.length}</p>
              </div>
            </div>
          </div>

          {/* Autres statistiques */}
          <div className="glass-card p-4">
            <div className="flex items-start justify-between">
              <div className="p-2 bg-white/10 rounded-lg">
                <TrendingUp className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm text-white/70">Progression moyenne</p>
                <p className="text-2xl font-bold">{teacher.stats.averageClassProgress}%</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Contenu principal */}
      <main className="p-6">
        {/* Barre de recherche */}
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Rechercher un élève..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        {/* Liste des élèves */}
        <div className="space-y-4">
          {filteredStudents.map((student) => {
            const progress = student.progress;
            const overallProgress = calculateOverallProgress(progress);

            return (
              <div
                key={student.id}
                className="glass-card p-4 hover:bg-white/10 transition cursor-pointer"
                onClick={() => setSelectedStudentId(student.id)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    {student.avatar ? (
                      <img
                        src={student.avatar}
                        alt={student.name}
                        className="w-12 h-12 rounded-full"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                        <span className="text-xl font-bold text-primary">
                          {student.name.charAt(0)}
                        </span>
                      </div>
                    )}
                    <div>
                      <h3 className="font-medium">{student.name}</h3>
                      <p className="text-sm text-gray-400">
                        Progression: {Math.round(overallProgress)}%
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {/* Badges et autres indicateurs */}
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
          student={{
            id: selectedStudentId,
            name: teacher.class.students.find(s => s.id === selectedStudentId)?.name || '',
            class: teacher.class.name
          }}
          progress={teacher.class.students.find(s => s.id === selectedStudentId)?.progress || {}}
          onClose={() => setSelectedStudentId(null)}
        />
      )}
    </div>
  );
};

export default TeacherDashboard;
