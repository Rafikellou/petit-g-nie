'use client';

import { FC, useEffect, useState } from 'react';
import { Badge } from '@/data/achievements';

interface BadgeUnlockProps {
  badge: Badge;
  onClose: () => void;
}

export const BadgeUnlock: FC<BadgeUnlockProps> = ({ badge, onClose }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onClose, 300); // Attendre la fin de l'animation de sortie
    }, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center transition-opacity duration-300 ${
        isVisible ? 'opacity-100' : 'opacity-0'
      }`}
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
      <div
        className={`relative bg-gradient-to-r ${badge.gradient} p-1 rounded-xl transform transition-transform duration-500 ${
          isVisible ? 'scale-100' : 'scale-90'
        }`}
      >
        <div className="bg-gray-900/90 rounded-lg p-8 text-center">
          <div className="text-6xl mb-4 animate-bounce">{badge.icon}</div>
          <div className="text-2xl font-bold mb-2">Nouveau Badge Débloqué !</div>
          <div className="text-xl font-bold mb-2">{badge.name}</div>
          <div className="text-white/70">{badge.description}</div>
        </div>
      </div>
    </div>
  );
};
