'use client';

import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Search, BarChart, BookOpen, Brain, GamepadIcon } from 'lucide-react';
import { useState } from 'react';

const mockStudents = [
  {
    id: '1',
    name: 'Lucas Martin',
    stats: {
      recommended: { completion: 85, score: 92 },
      training: { completion: 75, score: 88 },
      stories: { completion: 60, score: 95 },
      games: { completion: 90, score: 94 }
    }
  },
  {
    id: '2',
    name: 'Emma Bernard',
    stats: {
      recommended: { completion: 92, score: 95 },
      training: { completion: 88, score: 90 },
      stories: { completion: 70, score: 85 },
      games: { completion: 95, score: 96 }
    }
  }
];

const sections = [
  {
    id: 'recommended',
    title: 'Activités recommandées',
    icon: BarChart
  },
  {
    id: 'training',
    title: 'Entrainement',
    icon: Brain
  },
  {
    id: 'stories',
    title: 'Histoires',
    icon: BookOpen
  },
  {
    id: 'games',
    title: 'Apprendre en s\'amusant',
    icon: GamepadIcon
  }
];

export function StudentPerformance() {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredStudents = mockStudents.filter(student =>
    student.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        <Input
          type="text"
          placeholder="Rechercher un élève..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      <div className="space-y-6">
        {filteredStudents.map((student) => (
          <Card key={student.id} className="p-6">
            <h3 className="text-xl font-semibold mb-6">{student.name}</h3>
            
            <div className="space-y-6">
              {sections.map((section) => (
                <div key={section.id} className="bg-gray-800/50 rounded-lg p-4">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 rounded-lg bg-gray-800">
                      <section.icon className="w-4 h-4" />
                    </div>
                    <h4 className="font-medium">{section.title}</h4>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-sm text-gray-400 mb-1">Complétion</div>
                      <div className="text-xl font-bold">
                        {student.stats[section.id].completion}%
                      </div>
                    </div>
                    
                    <div>
                      <div className="text-sm text-gray-400 mb-1">Score moyen</div>
                      <div className="text-xl font-bold">
                        {student.stats[section.id].score}%
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
