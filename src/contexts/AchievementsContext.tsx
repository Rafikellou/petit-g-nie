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

interface AchievementsContextType {
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
  const [unlockedBadge, setUnlockedBadge] = useState<Badge | null>(null);

  const showBadgeUnlock = useCallback((badgeId: string) => {
    const badge = badges.find((b) => b.id === badgeId);
    if (badge) {
      setUnlockedBadge(badge);
    }
  }, []);

  return (
    <AchievementsContext.Provider value={{ showBadgeUnlock }}>
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
