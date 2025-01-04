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
    badges?: string[];
  };
  onClose: () => void;
}

export const StudentProgressComponent: React.FC<StudentProgressProps> = ({ student, progress, onClose }) => {
  const [activeTab, setActiveTab] = React.useState<'progress' | 'notes'>('progress');

  // Préparer les données pour les graphiques
  const quizData = Object.entries(progress.quizResults || {}).map(([quizId, result]) => ({
    name: `Quiz ${quizId}`,
    score: result.score,
  }));

  const storiesData = Object.entries(progress.storiesProgress || {}).map(([storyId, data]) => ({
    name: `Histoire ${storyId}`,
    completed: data.completed ? 100 : 0,
  }));

  const handleExportData = () => {
    try {
      const workbook = XLSX.utils.book_new();
      
      // Créer la feuille de données de quiz
      const quizWorksheet = XLSX.utils.json_to_sheet(quizData);
      XLSX.utils.book_append_sheet(workbook, quizWorksheet, "Quiz Results");
      
      // Créer la feuille de données d'histoires
      const storiesWorksheet = XLSX.utils.json_to_sheet(storiesData);
      XLSX.utils.book_append_sheet(workbook, storiesWorksheet, "Stories Progress");
      
      // Sauvegarder le fichier
      XLSX.writeFile(workbook, `${student.name}_progress_${new Date().toISOString().split('T')[0]}.xlsx`);
      
      toast.success('Données exportées avec succès !');
    } catch (error) {
      console.error('Erreur lors de l\'export:', error);
      toast.error('Erreur lors de l\'export des données');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="bg-surface-dark rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] overflow-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Progression de {student.name}</h2>
            <button
              onClick={onClose}
              className="text-white/60 hover:text-white transition"
            >
              ✕
            </button>
          </div>

          {/* Tabs */}
          <div className="flex space-x-4 mb-6">
            <button
              className={`px-4 py-2 rounded-lg transition ${
                activeTab === 'progress'
                  ? 'bg-primary text-white'
                  : 'bg-white/5 hover:bg-white/10'
              }`}
              onClick={() => setActiveTab('progress')}
            >
              Progression
            </button>
            <button
              className={`px-4 py-2 rounded-lg transition ${
                activeTab === 'notes'
                  ? 'bg-primary text-white'
                  : 'bg-white/5 hover:bg-white/10'
              }`}
              onClick={() => setActiveTab('notes')}
            >
              Notes
            </button>
          </div>

          {/* Contenu */}
          {activeTab === 'progress' ? (
            <div className="space-y-6">
              {/* Statistiques générales */}
              <div className="grid grid-cols-3 gap-4">
                <div className="glass-card p-4">
                  <div className="text-sm text-white/60 mb-1">Niveau</div>
                  <div className="text-2xl font-bold">{progress.level || 1}</div>
                </div>
                <div className="glass-card p-4">
                  <div className="text-sm text-white/60 mb-1">Quiz complétés</div>
                  <div className="text-2xl font-bold">
                    {Object.keys(progress.quizResults || {}).length}
                  </div>
                </div>
                <div className="glass-card p-4">
                  <div className="text-sm text-white/60 mb-1">Badges</div>
                  <div className="text-2xl font-bold">
                    {progress.badges?.length || 0}
                  </div>
                </div>
              </div>

              {/* Graphiques */}
              <div className="space-y-6">
                <div className="glass-card p-4">
                  <h3 className="text-lg font-semibold mb-4">Progression des quiz</h3>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={quizData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Line type="monotone" dataKey="score" stroke="#8884d8" />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className="glass-card p-4">
                  <h3 className="text-lg font-semibold mb-4">Histoires complétées</h3>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={storiesData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="completed" fill="#82ca9d" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex justify-end space-x-4">
                <button
                  onClick={handleExportData}
                  className="flex items-center space-x-2 px-4 py-2 bg-primary rounded-lg hover:bg-primary/80 transition"
                >
                  <ArrowDownTrayIcon className="w-5 h-5" />
                  <span>Exporter les données</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="glass-card p-4">
                <h3 className="text-lg font-semibold mb-4">Notes de l'enseignant</h3>
                <textarea
                  className="w-full h-32 bg-white/5 rounded-lg p-3 text-white placeholder-white/40"
                  placeholder="Ajouter une note..."
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
