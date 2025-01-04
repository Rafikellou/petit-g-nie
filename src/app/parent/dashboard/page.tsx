'use client';

import { FC, useState } from 'react';
import { useProgress } from '@/hooks/useProgress';
import { badges, levels } from '@/data/achievements';
import { characters } from '@/data/characters';
import WeeklyProgressChart from '@/components/charts/WeeklyProgressChart';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

type Subject = 'français' | 'mathématiques' | 'histoire-géo' | 'sciences';

const SUBJECTS: { id: Subject; name: string }[] = [
  { id: 'français', name: 'Français' },
  { id: 'mathématiques', name: 'Mathématiques' },
  { id: 'histoire-géo', name: 'Histoire-Géo' },
  { id: 'sciences', name: 'Sciences' }
];

const ParentDashboard: FC = () => {
  const { progress, getQuizScoresBySubject, getLearningTimeData } = useProgress();
  const [selectedSubject, setSelectedSubject] = useState<'all' | Subject>('all');
  const currentLevel = levels.find(l => l.level === progress.currentLevel);
  const nextLevel = levels.find(l => l.level === progress.currentLevel + 1);

  const weeklyData = getLearningTimeData();

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {/* Taux de bonnes réponses */}
        <div className="glass-card p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Quiz - Taux de réussite</h3>
            <Select
              value={selectedSubject}
              onValueChange={setSelectedSubject}
            >
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Matière" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Toutes</SelectItem>
                {SUBJECTS.map(subject => (
                  <SelectItem key={subject.id} value={subject.id}>
                    {subject.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center justify-center h-32">
            <div className="text-center">
              <span className="text-4xl font-bold">
                {getQuizScoresBySubject(selectedSubject === 'all' ? undefined : selectedSubject)}%
              </span>
              <p className="text-sm text-white/70 mt-2">7 derniers jours</p>
            </div>
          </div>
        </div>

        {/* Temps d'apprentissage */}
        <div className="glass-card p-6">
          <h3 className="text-lg font-semibold mb-4">Temps d'apprentissage</h3>
          <div className="h-32">
            <WeeklyProgressChart data={weeklyData} />
          </div>
        </div>

        {/* Niveau de lecture */}
        <div className="glass-card p-6">
          <h3 className="text-lg font-semibold mb-4">Niveau de lecture</h3>
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-gradient-to-r from-purple-500/20 to-blue-500/20 flex items-center justify-center text-2xl font-bold">
              {progress.currentLevel}
            </div>
            <div>
              <p className="font-medium">{currentLevel?.name}</p>
              {nextLevel && (
                <div className="mt-2">
                  <div className="text-sm text-white/70 mb-1">
                    {progress.currentXP} / {nextLevel.requiredXP} XP
                  </div>
                  <div className="w-32 h-1.5 bg-white/10 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-purple-500 to-blue-500"
                      style={{ width: `${(progress.currentXP / nextLevel.requiredXP) * 100}%` }}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Badges */}
        <div className="glass-card p-6">
          <h3 className="text-lg font-semibold mb-4">Badges remportés</h3>
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
            {badges.map((badge) => {
              const isUnlocked = progress.earnedBadges?.includes(badge.id);
              return (
                <div 
                  key={badge.id}
                  className={`aspect-square rounded-lg flex items-center justify-center ${
                    isUnlocked 
                      ? 'bg-gradient-to-r from-purple-500/20 to-blue-500/20' 
                      : 'bg-white/5'
                  }`}
                >
                  {badge.icon}
                </div>
              );
            })}
          </div>
        </div>

        {/* Histoires par personnage */}
        <div className="glass-card p-6">
          <h3 className="text-lg font-semibold mb-4">Histoires terminées</h3>
          <div className="space-y-3">
            {Object.entries(progress.characterProgress || {}).map(([characterId, data]) => {
              const character = characters[characterId];
              if (!character) return null;
              return (
                <div key={characterId} className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-purple-500/20 to-blue-500/20 flex items-center justify-center">
                    <img src={character.image} alt={character.name} className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{character.name}</p>
                    <div className="w-full h-1.5 bg-white/10 rounded-full mt-1">
                      <div 
                        className="h-full bg-gradient-to-r from-purple-500 to-blue-500 rounded-full"
                        style={{ width: `${(data.storiesCompleted / data.totalStories) * 100}%` }}
                      />
                    </div>
                  </div>
                  <div className="text-sm text-white/70">
                    {data.storiesCompleted}/{data.totalStories}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Statistiques générales */}
        <div className="glass-card p-6">
          <h3 className="text-lg font-semibold mb-4">Statistiques</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white/5 rounded-lg p-3">
              <p className="text-2xl font-bold">{progress.generatedStories}</p>
              <p className="text-sm text-white/70">Histoires générées</p>
            </div>
            <div className="bg-white/5 rounded-lg p-3">
              <p className="text-2xl font-bold">{progress.viewedJokes}</p>
              <p className="text-sm text-white/70">Blagues visualisées</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ParentDashboard;
