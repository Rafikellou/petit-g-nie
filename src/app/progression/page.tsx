'use client';

import { FC } from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { useProgress } from '@/hooks/useProgress';
import { badges, levels } from '@/data/achievements';
import { characters } from '@/data/characters';
import WeeklyProgressChart from '@/components/charts/WeeklyProgressChart';

const weeklyData = [
  { day: 'Lun', value: 45, label: 'Lundi : 45 minutes d\'apprentissage' },
  { day: 'Mar', value: 40, label: 'Mardi : 40 minutes d\'apprentissage' },
  { day: 'Mer', value: 60, label: 'Mercredi : 60 minutes d\'apprentissage' },
  { day: 'Jeu', value: 35, label: 'Jeudi : 35 minutes d\'apprentissage' },
  { day: 'Ven', value: 50, label: 'Vendredi : 50 minutes d\'apprentissage' },
  { day: 'Sam', value: 45, label: 'Samedi : 45 minutes d\'apprentissage' },
  { day: 'Dim', value: 30, label: 'Dimanche : 30 minutes d\'apprentissage' },
];

const ProgressPage: FC = () => {
  const { progress } = useProgress();
  const currentLevel = levels.find(l => l.level === progress.currentLevel);
  const nextLevel = levels.find(l => l.level === progress.currentLevel + 1);

  return (
    <main className="min-h-screen py-24">
      {/* Effets d'arrière-plan */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-50%] left-[-50%] w-[200%] h-[200%] bg-[radial-gradient(circle_at_center,rgba(0,242,195,0.03),transparent_70%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(108,99,255,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(108,99,255,0.05)_1px,transparent_1px)] bg-[size:14px_14px]" />
      </div>

      <div className="max-w-5xl mx-auto px-6 relative">
        <Link
          href="/"
          className="inline-flex items-center text-white/70 hover:text-white mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Retour à l'accueil
        </Link>

        <div className="grid gap-8">
          {/* Graphique de progression hebdomadaire */}
          <div className="glass-card p-8">
            <h2 className="text-3xl font-bold mb-6">Progression</h2>
            <WeeklyProgressChart data={weeklyData} />
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Niveau et XP */}
            <div className="glass-card p-8">
              <h2 className="text-3xl font-bold mb-6">
                Niveau {currentLevel?.level}: {currentLevel?.name}
              </h2>

              {nextLevel && (
                <div className="mb-8">
                  <div className="flex justify-between text-sm text-white/50 mb-2">
                    <span>{progress.currentXP} XP</span>
                    <span>{nextLevel.requiredXP} XP</span>
                  </div>
                  <div className="w-full h-3 bg-white/10 rounded-full overflow-hidden">
                    <div
                      className={`h-full bg-gradient-to-r ${currentLevel?.gradient}`}
                      style={{
                        width: `${Math.min(
                          ((progress.currentXP - currentLevel.requiredXP) /
                            (nextLevel.requiredXP - currentLevel.requiredXP)) *
                            100,
                          100
                        )}%`,
                      }}
                    />
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/5 rounded-lg p-4">
                  <div className="text-3xl mb-2">📚</div>
                  <div className="text-sm text-white/70">Histoires terminées</div>
                  <div className="text-2xl font-bold">{progress.storiesCompleted}</div>
                </div>
                <div className="bg-white/5 rounded-lg p-4">
                  <div className="text-3xl mb-2">🎯</div>
                  <div className="text-sm text-white/70">Quiz complétés</div>
                  <div className="text-2xl font-bold">
                    {progress.quizResults.length}
                  </div>
                </div>
                <div className="bg-white/5 rounded-lg p-4">
                  <div className="text-3xl mb-2">⭐</div>
                  <div className="text-sm text-white/70">Badges gagnés</div>
                  <div className="text-2xl font-bold">
                    {progress.earnedBadges.length}
                  </div>
                </div>
                <div className="bg-white/5 rounded-lg p-4">
                  <div className="text-3xl mb-2">⏱️</div>
                  <div className="text-sm text-white/70">Temps d'écoute</div>
                  <div className="text-2xl font-bold">
                    {Math.floor(progress.totalListeningTime / 60)}min
                  </div>
                </div>
              </div>
            </div>

            {/* Badges */}
            <div className="glass-card p-8">
              <h2 className="text-3xl font-bold mb-6">Mes Badges</h2>
              <div className="grid grid-cols-2 gap-4">
                {badges.map(badge => {
                  const isEarned = progress.earnedBadges.includes(badge.id);
                  return (
                    <div
                      key={badge.id}
                      className={`rounded-lg p-4 transition-all ${
                        isEarned
                          ? `bg-gradient-to-r ${badge.gradient}`
                          : 'bg-white/5 opacity-50'
                      }`}
                    >
                      <div className="text-3xl mb-2">{badge.icon}</div>
                      <div className="font-bold mb-1">{badge.name}</div>
                      <div className="text-sm text-white/70">
                        {badge.description}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Progression par personnage */}
          <div className="glass-card p-8">
            <h2 className="text-3xl font-bold mb-6">Progression par personnage</h2>
            <div className="grid gap-4 md:grid-cols-3">
              {Object.values(characters).map(character => {
                const charProgress = progress.characterProgress[character.id];
                const completionPercentage = charProgress
                  ? (charProgress.storiesCompleted / charProgress.totalStories) * 100
                  : 0;

                return (
                  <div key={character.id} className="bg-white/5 rounded-lg p-4">
                    <div className="flex items-center gap-3 mb-3">
                      <div
                        className={`w-12 h-12 rounded-full bg-gradient-to-r ${character.gradient} flex items-center justify-center`}
                      >
                        <span className={character.textColor}>
                          {character.image ? (
                            <img
                              src={character.image}
                              alt={character.name}
                              className="w-8 h-8 object-cover rounded-full"
                            />
                          ) : (
                            '👤'
                          )}
                        </span>
                      </div>
                      <div>
                        <div className="font-bold">{character.name}</div>
                        <div className="text-sm text-white/70">
                          {charProgress?.storiesCompleted || 0}/{character.stories.length} histoires
                        </div>
                      </div>
                    </div>
                    <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                      <div
                        className={`h-full bg-gradient-to-r ${character.gradient}`}
                        style={{ width: `${completionPercentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default ProgressPage;
