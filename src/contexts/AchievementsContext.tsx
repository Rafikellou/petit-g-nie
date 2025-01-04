'use client';

import {
  createContext,
  useContext,
  FC,
  ReactNode,
  useState,
  useCallback,
} from 'react';
import { Badge, badges } from '@/data/achievements';
import { BadgeUnlock } from '@/components/achievements/BadgeUnlock';
import toast from 'react-hot-toast';

interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlockedAt?: string;
}

interface AchievementsContextType {
  achievements: Achievement[];
  unlockAchievement: (achievementId: string) => void;
  showBadgeUnlock: (badgeId: string) => void;
}

const AchievementsContext = createContext<AchievementsContextType | null>(null);

export const useAchievements = () => {
  const context = useContext(AchievementsContext);
  if (!context) {
    throw new Error('useAchievements must be used within an AchievementsProvider');
  }
  return context;
};

interface AchievementsProviderProps {
  children: ReactNode;
}

export const AchievementsProvider: FC<AchievementsProviderProps> = ({
  children,
}) => {
  const [achievements, setAchievements] = useState<Achievement[]>([
    {
      id: 'first_story',
      name: 'Premier pas',
      description: 'Lire sa première histoire',
      icon: '📚',
    },
    {
      id: 'quiz_genius',
      name: 'Génie du quiz',
      description: 'Obtenir un score parfait',
      icon: '🎯',
    },
    {
      id: 'first_training',
      name: 'Apprenti',
      description: 'Compléter sa première session d\'entraînement',
      icon: '🎓',
    },
  ]);

  const [unlockedBadge, setUnlockedBadge] = useState<Badge | null>(null);

  const unlockAchievement = (achievementId: string) => {
    setAchievements(prev => prev.map(achievement => {
      if (achievement.id === achievementId && !achievement.unlockedAt) {
        const updatedAchievement = {
          ...achievement,
          unlockedAt: new Date().toISOString(),
        };
        showBadgeUnlock(updatedAchievement);
        return updatedAchievement;
      }
      return achievement;
    }));
  };

  const showBadgeUnlock = useCallback((badgeId: string) => {
    const badge = badges.find((b) => b.id === badgeId);
    if (badge) {
      setUnlockedBadge(badge);
    }
  }, []);

  const showBadgeUnlockToast = (achievement: Achievement) => {
    toast.custom((t) => (
      <div className={`${
        t.visible ? 'animate-enter' : 'animate-leave'
      } max-w-md w-full bg-white shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5`}>
        <div className="flex-1 w-0 p-4">
          <div className="flex items-start">
            <div className="flex-shrink-0 pt-0.5">
              <span className="text-2xl">{achievement.icon}</span>
            </div>
            <div className="ml-3 flex-1">
              <p className="text-sm font-medium text-gray-900">
                Nouveau badge débloqué !
              </p>
              <p className="mt-1 text-sm text-gray-500">
                {achievement.description}
              </p>
            </div>
          </div>
        </div>
        <div className="flex border-l border-gray-200">
          <button
            onClick={() => toast.dismiss(t.id)}
            className="w-full border border-transparent rounded-none rounded-r-lg p-4 flex items-center justify-center text-sm font-medium text-indigo-600 hover:text-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            Fermer
          </button>
        </div>
      </div>
    ));
  };

  return (
    <AchievementsContext.Provider value={{ achievements, unlockAchievement, showBadgeUnlock }}>
      {children}
      {unlockedBadge && (
        <BadgeUnlock
          badge={unlockedBadge}
          onClose={() => setUnlockedBadge(null)}
        />
      )}
    </AchievementsContext.Provider>
  );
};
