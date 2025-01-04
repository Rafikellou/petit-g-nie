'use client';

import React from 'react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar
} from 'recharts';
import { ChatBubbleLeftIcon, ArrowDownTrayIcon, BellIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';
import * as XLSX from 'xlsx';

interface StudentProgressProps {
  student: {
    name: string;
    class: string;
    id: string | number;
  };
  progress: {
    level?: number;
    quizResults?: Record<string, any>;
    storiesProgress?: Record<string, any>;
  };
  onClose: () => void;
}

export const StudentProgressComponent: React.FC<StudentProgressProps> = ({ student, progress, onClose }) => {
  const [activeTab, setActiveTab] = React.useState<'progress' | 'notes'>('progress');

  // Préparer les données pour les graphiques
  const progressData = Object.entries(progress.quizResults || {}).map(([quizId, result]: [string, any]) => ({
    date: new Date(result.completedAt).toLocaleDateString(),
    score: result.score,
    quiz: quizId
  }));

  const readingData = Object.entries(progress.storiesProgress || {}).map(([storyId, story]: [string, any]) => ({
    story: story.title,
    time: story.readingTime || 0
  }));

  // Exporter les données
  const exportData = () => {
    const data = {
      'Informations élève': {
        Nom: student.name,
        Classe: student.class,
        Niveau: progress.level || 1
      },
      'Résultats des quiz': progressData,
      'Histoires lues': readingData,
      Badges: progress.badges || []
    };

    const wb = XLSX.utils.book_new();
    
    Object.entries(data).forEach(([sheetName, sheetData]) => {
      const ws = XLSX.utils.json_to_sheet(
        Array.isArray(sheetData) ? sheetData : [sheetData]
      );
      XLSX.utils.book_append_sheet(wb, ws, sheetName);
    });

    XLSX.writeFile(wb, `progression_${student.name.replace(' ', '_')}.xlsx`);
    toast.success('Données exportées avec succès');
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">
          Progrès de {student.name}
        </h2>
        <div className="flex items-center gap-4">
          <button
            onClick={() => toast('Aucune nouvelle notification')}
            className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
          >
            <BellIcon className="w-5 h-5" />
          </button>
          <button
            onClick={exportData}
            className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
          >
            <ArrowDownTrayIcon className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="flex gap-2">
        <button
          onClick={() => setActiveTab('progress')}
          className={`px-4 py-2 rounded-lg transition-colors ${
            activeTab === 'progress' ? 'bg-white/20' : 'bg-white/5 hover:bg-white/10'
          }`}
        >
          Progression
        </button>
        <button
          onClick={() => setActiveTab('notes')}
          className={`px-4 py-2 rounded-lg transition-colors ${
            activeTab === 'notes' ? 'bg-white/20' : 'bg-white/5 hover:bg-white/10'
          }`}
        >
          Notes
        </button>
      </div>

      {activeTab === 'progress' && (
        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-white/5 rounded-lg p-6">
            <h3 className="text-lg font-bold mb-4">Progression des scores</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={progressData}>
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

          <div className="bg-white/5 rounded-lg p-6">
            <h3 className="text-lg font-bold mb-4">Temps de lecture par histoire</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={readingData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                  <XAxis 
                    dataKey="story" 
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
                  <Bar dataKey="time" fill="#22c55e" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'notes' && (
        <div className="bg-white/5 rounded-lg p-6">
          <h3 className="text-lg font-bold mb-4">Notes et objectifs</h3>
          <p className="text-white/70">Fonctionnalité en cours de développement...</p>
        </div>
      )}

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white/5 rounded-lg p-4">
          <div className="text-sm text-white/70 mb-1">Score moyen</div>
          <div className="text-2xl font-bold">
            {Math.round(
              progressData.reduce((sum, data) => sum + data.score, 0) / 
              (progressData.length || 1)
            )}%
          </div>
        </div>
        <div className="bg-white/5 rounded-lg p-4">
          <div className="text-sm text-white/70 mb-1">Temps total de lecture</div>
          <div className="text-2xl font-bold">
            {readingData.reduce((sum, data) => sum + data.time, 0)} min
          </div>
        </div>
      </div>
    </div>
  );
}
