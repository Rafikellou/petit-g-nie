'use client';

import { FC, useState } from 'react';
import { Bell } from 'lucide-react';
import { Notification } from '@/data/notifications';
import Link from 'next/link';

interface NotificationBellProps {
  notifications: Notification[];
  onMarkAsRead: (notificationId: string) => void;
}

export const NotificationBell: FC<NotificationBellProps> = ({
  notifications,
  onMarkAsRead,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-full hover:bg-white/10 transition-colors"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <div className="absolute top-0 right-0 w-4 h-4 bg-red-500 rounded-full text-xs flex items-center justify-center">
            {unreadCount}
          </div>
        )}
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 mt-2 w-80 max-h-[70vh] overflow-y-auto rounded-lg bg-gray-900 border border-white/10 shadow-xl z-50">
            <div className="p-4 border-b border-white/10">
              <h3 className="font-medium">Notifications</h3>
            </div>
            {notifications.length > 0 ? (
              <div className="divide-y divide-white/10">
                {notifications.map(notification => (
                  <div
                    key={notification.id}
                    className={`p-4 ${!notification.read ? 'bg-white/5' : ''}`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex-1">
                        <div className="font-medium mb-1">{notification.title}</div>
                        <div className="text-sm text-white/70 mb-2">
                          {notification.message}
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-white/50">
                            {new Date(notification.timestamp).toLocaleDateString()}
                          </span>
                          {notification.actionUrl && (
                            <Link
                              href={notification.actionUrl}
                              className="text-xs text-blue-400 hover:text-blue-300"
                              onClick={() => onMarkAsRead(notification.id)}
                            >
                              Voir plus
                            </Link>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-4 text-center text-white/50">
                Aucune notification
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};
