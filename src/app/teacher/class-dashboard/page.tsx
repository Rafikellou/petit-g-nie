'use client';

import { useState } from 'react';
import { ClassDashboard } from '@/components/teacher/ClassDashboard';

// Données de test pour la démo
const mockClassData = {
  students: [
    { 
      id: 1, 
      name: 'Alice Martin', 
      averageScore: 85, 
      completedActivities: 42,
      lastActive: Date.now(),
      trend: 'up'
    },
    { 
      id: 2, 
      name: 'Lucas Bernard', 
      averageScore: 72, 
      completedActivities: 38,
      lastActive: Date.now() - 2 * 24 * 60 * 60 * 1000,
      trend: 'up'
    },
    { 
      id: 3, 
      name: 'Emma Dubois', 
      averageScore: 91, 
      completedActivities: 45,
      lastActive: Date.now(),
      trend: 'up'
    },
    { 
      id: 4, 
      name: 'Thomas Petit', 
      averageScore: 58, 
      completedActivities: 25,
      lastActive: Date.now() - 5 * 24 * 60 * 60 * 1000,
      trend: 'down'
    },
    { 
      id: 5, 
      name: 'Léa Robert', 
      averageScore: 79, 
      completedActivities: 36,
      lastActive: Date.now(),
      trend: 'up'
    }
  ],
  averageScores: [
    { date: '01/12', score: 75 },
    { date: '02/12', score: 77 },
    { date: '03/12', score: 76 },
    { date: '04/12', score: 79 },
    { date: '05/12', score: 78 },
    { date: '06/12', score: 80 },
    { date: '07/12', score: 82 }
  ],
  activityData: [
    { date: '01/12', quiz: 15, stories: 8 },
    { date: '02/12', quiz: 12, stories: 10 },
    { date: '03/12', quiz: 18, stories: 7 },
    { date: '04/12', quiz: 14, stories: 12 },
    { date: '05/12', quiz: 16, stories: 9 },
    { date: '06/12', quiz: 20, stories: 11 },
    { date: '07/12', quiz: 17, stories: 13 }
  ],
  alerts: [
    {
      type: 'warning',
      title: 'Baisse de participation',
      message: '3 élèves n\'ont pas complété d\'activités depuis plus de 5 jours.'
    },
    {
      type: 'success',
      title: 'Progression notable',
      message: 'La moyenne de classe a augmenté de 5% cette semaine.'
    },
    {
      type: 'error',
      title: 'Élèves en difficulté',
      message: '2 élèves ont un score moyen inférieur à 60%.'
    }
  ]
};

export default function ClassDashboardPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Tableau de bord de la classe</h1>
      <ClassDashboard classData={mockClassData} />
    </div>
  );
}
