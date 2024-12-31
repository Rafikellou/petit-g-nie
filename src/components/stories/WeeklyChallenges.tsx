'use client';

import { FC } from 'react';
import { Trophy, Users, Calendar, Gift } from 'lucide-react';
import { StoryChallenge, WEEKLY_CHALLENGES } from '@/types/story';

interface WeeklyChallengesProps {
  onChallengeSelect: (challenge: StoryChallenge) => void;
}

export const WeeklyChallenges: FC<WeeklyChallengesProps> = ({
  onChallengeSelect
}) => {
  const getCurrentChallenge = () => {
    const now = new Date();
    return WEEKLY_CHALLENGES.find(
      challenge =>
        new Date(challenge.startDate) <= now && new Date(challenge.endDate) >= now
    );
  };

  const currentChallenge = getCurrentChallenge();
  const timeRemaining = currentChallenge
    ? new Date(currentChallenge.endDate).getTime() - new Date().getTime()
    : 0;

  const formatTimeRemaining = (ms: number) => {
    const days = Math.floor(ms / (1000 * 60 * 60 * 24));
    const hours = Math.floor((ms % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    return `${days}j ${hours}h`;
  };

  return (
    <div className="bg-gradient-to-r from-yellow-500/20 to-purple-500/20 rounded-lg p-6 backdrop-blur-sm">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-white flex items-center gap-2">
          <Trophy className="w-6 h-6 text-yellow-400" />
          Défi de la Semaine
        </h3>
        {currentChallenge && (
          <div className="flex items-center gap-2 text-white/70">
            <Calendar className="w-5 h-5" />
            <span>Reste {formatTimeRemaining(timeRemaining)}</span>
          </div>
        )}
      </div>

      {currentChallenge ? (
        <div className="space-y-6">
          <div>
            <h4 className="text-lg font-medium text-white mb-2">
              {currentChallenge.title}
            </h4>
            <p className="text-white/70">{currentChallenge.description}</p>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-white/70">
              <Users className="w-5 h-5" />
              <span>{currentChallenge.participants} participants</span>
            </div>
            <button
              onClick={() => onChallengeSelect(currentChallenge)}
              className="px-4 py-2 bg-purple-500 rounded hover:bg-purple-600 transition-colors"
            >
              Participer
            </button>
          </div>

          <div>
            <div className="text-sm text-white/70 mb-2">Récompenses :</div>
            <div className="grid grid-cols-2 gap-4">
              {currentChallenge.prizes.map((prize, index) => (
                <div
                  key={index}
                  className="bg-white/5 rounded-lg p-3 flex items-start gap-3"
                >
                  <div className="text-2xl">{prize.icon}</div>
                  <div>
                    <div className="font-medium text-white">
                      {prize.name}
                    </div>
                    <div className="text-sm text-white/70">
                      {prize.description}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center text-white/70 py-8">
          Pas de défi en cours. Revenez bientôt !
        </div>
      )}
    </div>
  );
};
