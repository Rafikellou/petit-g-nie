'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell } from 'lucide-react';

interface Notification {
  id: string;
  subject: string;
  createdAt: Date;
}

export function NotificationsList() {
  const [isOpen, setIsOpen] = useState(false);

  // Données factices pour les notifications
  const notifications: Notification[] = [
    {
      id: '1',
      subject: 'Mathématiques',
      createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 heures avant
    },
    {
      id: '2',
      subject: 'Français',
      createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000), // 5 heures avant
    },
    {
      id: '3',
      subject: 'Mathématiques',
      createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 jour avant
    },
    {
      id: '4',
      subject: 'Français',
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 jours avant
    },
    {
      id: '5',
      subject: 'Mathématiques',
      createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 jours avant
    },
  ];

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 24) {
      return `il y a ${diffInHours}h`;
    } else {
      const diffInDays = Math.floor(diffInHours / 24);
      return `il y a ${diffInDays}j`;
    }
  };

  return (
    <div className="relative">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 rounded-lg hover:bg-white/5 transition-colors relative"
      >
        <Bell className="w-6 h-6" />
        {notifications.length > 0 && (
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-xs flex items-center justify-center">
            {notifications.length}
          </span>
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            {/* Overlay pour fermer en cliquant en dehors */}
            <div 
              className="fixed inset-0 z-40"
              onClick={() => setIsOpen(false)}
            />

            {/* Liste des notifications */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="absolute right-0 top-full mt-2 w-80 bg-surface-dark border border-white/10 rounded-lg shadow-lg z-50 overflow-hidden"
            >
              <div className="p-4 border-b border-white/10">
                <h3 className="text-lg font-semibold">Notifications</h3>
              </div>
              
              <div className="max-h-[400px] overflow-y-auto">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className="p-4 border-b border-white/5 hover:bg-white/5 transition-colors"
                  >
                    <p className="text-sm text-white/90">
                      Une activité <span className="font-semibold">{notification.subject}</span> a été rajoutée pour toi
                    </p>
                    <p className="text-xs text-white/60 mt-1">
                      {formatTimeAgo(notification.createdAt)}
                    </p>
                  </div>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
