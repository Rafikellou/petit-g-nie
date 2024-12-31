'use client';

import { FC, useState } from 'react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, PieChart, Pie, Cell
} from 'recharts';
import { 
  AcademicCapIcon, 
  BookOpenIcon, 
  ChartBarIcon, 
  UserGroupIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

interface ClassDashboardProps {
  classData: {
    students: any[];
    averageScores: any[];
    activityData: any[];
    alerts: any[];
  };
}

const COLORS = ['#6366f1', '#22c55e', '#f59e0b', '#ef4444'];

export const ClassDashboard: FC<ClassDashboardProps> = ({ classData }) => {
  const [timeFilter, setTimeFilter] = useState<'week' | 'month' | 'trimester'>('week');
  const [viewMode, setViewMode] = useState<'overview' | 'performance' | 'activity' | 'alerts'>('overview');

  // Calcul des statistiques de la classe
  const classStats = {
    averageScore: Math.round(
      classData.students.reduce((sum, student) => sum + student.averageScore, 0) / 
      classData.students.length
    ),
    totalActivities: classData.students.reduce((sum, student) => sum + student.completedActivities, 0),
    activeStudents: classData.students.filter(student => student.lastActive > Date.now() - 7 * 24 * 60 * 60 * 1000).length,
    strugglingStudents: classData.students.filter(student => student.averageScore < 60).length
  };

  // Distribution des niveaux
  const levelDistribution = [
    { name: 'Expert', value: classData.students.filter(s => s.averageScore >= 85).length },
    { name: 'Avancé', value: classData.students.filter(s => s.averageScore >= 70 && s.averageScore < 85).length },
    { name: 'Intermédiaire', value: classData.students.filter(s => s.averageScore >= 55 && s.averageScore < 70).length },
    { name: 'Débutant', value: classData.students.filter(s => s.averageScore < 55).length }
  ];

  // Générer un rapport de classe
  const generateClassReport = () => {
    // TODO: Implémenter la génération de rapport PDF
    toast.success('Rapport de classe généré et téléchargé');
  };

  return (
    <div className="space-y-8">
      {/* En-tête avec statistiques globales */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white/5 rounded-lg p-4">
          <div className="flex items-center gap-3 mb-2">
            <AcademicCapIcon className="w-5 h-5 text-indigo-400" />
            <div className="text-sm text-white/70">Score moyen</div>
          </div>
          <div className="text-2xl font-bold">{classStats.averageScore}%</div>
        </div>

        <div className="bg-white/5 rounded-lg p-4">
          <div className="flex items-center gap-3 mb-2">
            <BookOpenIcon className="w-5 h-5 text-green-400" />
            <div className="text-sm text-white/70">Activités complétées</div>
          </div>
          <div className="text-2xl font-bold">{classStats.totalActivities}</div>
        </div>

        <div className="bg-white/5 rounded-lg p-4">
          <div className="flex items-center gap-3 mb-2">
            <UserGroupIcon className="w-5 h-5 text-yellow-400" />
            <div className="text-sm text-white/70">Élèves actifs (7j)</div>
          </div>
          <div className="text-2xl font-bold">{classStats.activeStudents}</div>
        </div>

        <div className="bg-white/5 rounded-lg p-4">
          <div className="flex items-center gap-3 mb-2">
            <ExclamationTriangleIcon className="w-5 h-5 text-red-400" />
            <div className="text-sm text-white/70">Élèves en difficulté</div>
          </div>
          <div className="text-2xl font-bold">{classStats.strugglingStudents}</div>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex gap-2">
        <button
          onClick={() => setViewMode('overview')}
          className={`px-4 py-2 rounded-lg transition-colors ${
            viewMode === 'overview' ? 'bg-white/20' : 'bg-white/5 hover:bg-white/10'
          }`}
        >
          Vue d'ensemble
        </button>
        <button
          onClick={() => setViewMode('performance')}
          className={`px-4 py-2 rounded-lg transition-colors ${
            viewMode === 'performance' ? 'bg-white/20' : 'bg-white/5 hover:bg-white/10'
          }`}
        >
          Performance
        </button>
        <button
          onClick={() => setViewMode('activity')}
          className={`px-4 py-2 rounded-lg transition-colors ${
            viewMode === 'activity' ? 'bg-white/20' : 'bg-white/5 hover:bg-white/10'
          }`}
        >
          Activité
        </button>
        <button
          onClick={() => setViewMode('alerts')}
          className={`px-4 py-2 rounded-lg transition-colors ${
            viewMode === 'alerts' ? 'bg-white/20' : 'bg-white/5 hover:bg-white/10'
          }`}
        >
          Alertes
        </button>
      </div>

      {/* Filtres temporels */}
      <div className="flex items-center gap-4 bg-white/5 rounded-lg p-4">
        <ChartBarIcon className="w-5 h-5" />
        <select
          value={timeFilter}
          onChange={(e) => setTimeFilter(e.target.value as any)}
          className="bg-white/5 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-white/20"
        >
          <option value="week">Cette semaine</option>
          <option value="month">Ce mois</option>
          <option value="trimester">Ce trimestre</option>
        </select>
      </div>

      {viewMode === 'overview' && (
        <div className="grid md:grid-cols-2 gap-8">
          {/* Distribution des niveaux */}
          <div className="bg-white/5 rounded-lg p-6">
            <h3 className="text-lg font-bold mb-4">Distribution des niveaux</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={levelDistribution}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    label
                  >
                    {levelDistribution.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Progression moyenne */}
          <div className="bg-white/5 rounded-lg p-6">
            <h3 className="text-lg font-bold mb-4">Progression moyenne</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={classData.averageScores}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                  <XAxis 
                    dataKey="date" 
                    stroke="rgba(255,255,255,0.5)"
                    tick={{ fill: 'rgba(255,255,255,0.5)' }}
                  />
                  <YAxis 
                    stroke="rgba(255,255,255,0.5)"
                    tick={{ fill: 'rgba(255,255,255,0.5)' }}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'rgba(0,0,0,0.8)',
                      border: 'none',
                      borderRadius: '8px',
                      color: 'white'
                    }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="score" 
                    stroke="#6366f1" 
                    strokeWidth={2}
                    dot={{ fill: '#6366f1' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {viewMode === 'performance' && (
        <div className="space-y-6">
          {/* Liste des élèves avec leurs performances */}
          <div className="bg-white/5 rounded-lg p-6">
            <h3 className="text-lg font-bold mb-4">Performance des élèves</h3>
            <div className="space-y-4">
              {classData.students
                .sort((a, b) => b.averageScore - a.averageScore)
                .map((student, index) => (
                  <div 
                    key={student.id}
                    className="flex items-center justify-between p-3 bg-white/5 rounded-lg"
                  >
                    <div className="flex items-center gap-4">
                      <div className="text-lg font-medium">{student.name}</div>
                      {student.trend === 'up' ? (
                        <ArrowTrendingUpIcon className="w-5 h-5 text-green-400" />
                      ) : (
                        <ArrowTrendingDownIcon className="w-5 h-5 text-red-400" />
                      )}
                    </div>
                    <div className="text-xl font-bold">{student.averageScore}%</div>
                  </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {viewMode === 'activity' && (
        <div className="space-y-6">
          {/* Graphique d'activité */}
          <div className="bg-white/5 rounded-lg p-6">
            <h3 className="text-lg font-bold mb-4">Activité de la classe</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={classData.activityData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                  <XAxis 
                    dataKey="date" 
                    stroke="rgba(255,255,255,0.5)"
                    tick={{ fill: 'rgba(255,255,255,0.5)' }}
                  />
                  <YAxis 
                    stroke="rgba(255,255,255,0.5)"
                    tick={{ fill: 'rgba(255,255,255,0.5)' }}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'rgba(0,0,0,0.8)',
                      border: 'none',
                      borderRadius: '8px',
                      color: 'white'
                    }}
                  />
                  <Bar dataKey="quiz" stackId="a" fill="#6366f1" />
                  <Bar dataKey="stories" stackId="a" fill="#22c55e" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {viewMode === 'alerts' && (
        <div className="space-y-6">
          {/* Alertes et notifications */}
          <div className="bg-white/5 rounded-lg p-6">
            <h3 className="text-lg font-bold mb-4">Alertes et recommandations</h3>
            <div className="space-y-4">
              {classData.alerts.map((alert, index) => (
                <div 
                  key={index}
                  className={`p-4 rounded-lg ${
                    alert.type === 'warning' 
                      ? 'bg-yellow-400/10 border border-yellow-400/20' 
                      : alert.type === 'success'
                      ? 'bg-green-400/10 border border-green-400/20'
                      : 'bg-red-400/10 border border-red-400/20'
                  }`}
                >
                  <div className="font-medium mb-1">{alert.title}</div>
                  <div className="text-sm text-white/70">{alert.message}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
