'use client';

import { FC, useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, Users, BookOpen, Award, TrendingUp, Search, Loader2 } from 'lucide-react';
import { mockTeachers, mockStudents, mockProgress } from '@/data/users';
import StudentProgress from '@/components/teacher/StudentProgress';
import { Toaster } from 'react-hot-toast';

// Simuler un enseignant connecté
const LOGGED_IN_TEACHER_ID = 'teacher1';

// Fonction utilitaire pour calculer la moyenne
const calculateAverage = (numbers: number[]) => {
  if (numbers.length === 0) return 0;
  return Math.round(numbers.reduce((a, b) => a + b, 0) / numbers.length);
};

// Fonction pour obtenir le temps de lecture total en minutes
const getReadingTime = (progress: any) => {
  return Object.values(progress.storiesProgress || {}).reduce((total: number, story: any) => 
    total + (story.readingTime || 0), 0
  );
};

const TeacherDashboard = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [teacher, setTeacher] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Simuler le chargement des données
    const loadData = async () => {
      try {
        setIsLoading(true);
        // Simuler un délai réseau
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

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Erreur</h2>
          <p className="text-white/70 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-white/10 rounded-lg hover:bg-white/20 transition-colors"
          >
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  if (isLoading || !teacher) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
          <p className="text-white/70">Chargement des données...</p>
        </div>
      </div>
    );
  }

  const filteredStudents = teacher.studentIds
    .map(id => mockStudents[id])
    .filter(student => 
      student?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student?.class?.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .filter(Boolean); // Filtrer les étudiants undefined

  const selectedStudent = selectedStudentId ? mockStudents[selectedStudentId] : null;
  const selectedProgress = selectedStudentId ? mockProgress[selectedStudentId] : null;

  // Calculer les statistiques globales
  const totalStoriesRead = Object.values(mockProgress).reduce(
    (total, progress) => total + Object.keys(progress?.storiesProgress || {}).length,
    0
  );

  const averageQuizScore = calculateAverage(
    Object.values(mockProgress).flatMap(progress =>
      Object.values(progress?.quizResults || {}).map(result => result.score)
    )
  );

  const totalBadges = Object.values(mockProgress).reduce(
    (total, progress) => total + (progress?.badges?.length || 0),
    0
  );

  return (
    <main className="min-h-screen py-24">
      <Toaster position="top-right" />
      {/* Effets d'arrière-plan */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-50%] left-[-50%] w-[200%] h-[200%] bg-[radial-gradient(circle_at_center,rgba(0,242,195,0.03),transparent_70%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(108,99,255,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(108,99,255,0.05)_1px,transparent_1px)] bg-[size:14px_14px]" />
      </div>

      <div className="max-w-6xl mx-auto px-6 relative">
        <Link
          href="/"
          className="inline-flex items-center text-white/70 hover:text-white mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Retour à l'accueil
        </Link>

        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">
            Bonjour, {teacher.name}
          </h1>
          <p className="text-white/70">
            Gérez votre classe et suivez les progrès de vos élèves
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {/* Statistiques de la classe */}
          <div className="glass-card p-8 md:col-span-3">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white/5 rounded-lg p-6">
                <div className="flex items-center gap-3 mb-2">
                  <Users className="w-5 h-5 text-blue-400" />
                  <span className="text-white/70">Élèves</span>
                </div>
                <div className="text-3xl font-bold">{filteredStudents.length}</div>
              </div>
              <div className="bg-white/5 rounded-lg p-6">
                <div className="flex items-center gap-3 mb-2">
                  <BookOpen className="w-5 h-5 text-green-400" />
                  <span className="text-white/70">Histoires lues</span>
                </div>
                <div className="text-3xl font-bold">{totalStoriesRead}</div>
              </div>
              <div className="bg-white/5 rounded-lg p-6">
                <div className="flex items-center gap-3 mb-2">
                  <Award className="w-5 h-5 text-yellow-400" />
                  <span className="text-white/70">Badges obtenus</span>
                </div>
                <div className="text-3xl font-bold">{totalBadges}</div>
              </div>
              <div className="bg-white/5 rounded-lg p-6">
                <div className="flex items-center gap-3 mb-2">
                  <TrendingUp className="w-5 h-5 text-purple-400" />
                  <span className="text-white/70">Moyenne des quiz</span>
                </div>
                <div className="text-3xl font-bold">{averageQuizScore}%</div>
              </div>
            </div>
          </div>

          {/* Liste des élèves */}
          <div className="glass-card p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">Mes élèves</h2>
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50" />
                <input
                  type="text"
                  placeholder="Rechercher..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 bg-white/5 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/20"
                />
              </div>
            </div>
            {filteredStudents.length === 0 ? (
              <div className="text-center py-8 text-white/50">
                Aucun élève trouvé
              </div>
            ) : (
              <div className="space-y-2">
                {filteredStudents.map(student => (
                  <button
                    key={student.id}
                    onClick={() => setSelectedStudentId(student.id)}
                    className={`w-full p-4 rounded-lg transition-colors ${
                      selectedStudentId === student.id
                        ? 'bg-white/20'
                        : 'bg-white/5 hover:bg-white/10'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium">{student.name}</div>
                        <div className="text-sm text-white/50">{student.class}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium">
                          Niveau {mockProgress[student.id]?.level || 1}
                        </div>
                        <div className="text-xs text-white/50">
                          {Object.keys(mockProgress[student.id]?.storiesProgress || {}).length} histoires
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Détails de l'élève sélectionné */}
          <div className="glass-card p-8 md:col-span-2">
            {selectedStudent && selectedProgress ? (
              <StudentProgress 
                student={selectedStudent}
                progress={selectedProgress}
              />
            ) : (
              <div className="h-full flex items-center justify-center text-white/50">
                Sélectionnez un élève pour voir ses progrès
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
};

export default function TeacherPage() {
  return <TeacherDashboard />;
}
