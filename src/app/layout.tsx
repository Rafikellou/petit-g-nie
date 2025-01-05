'use client';

import { Inter } from 'next/font/google';
import './globals.css';
import { AchievementsProvider } from '@/contexts/AchievementsContext';
import { Users, GraduationCap, Bell } from 'lucide-react';
import { PinModal } from '@/components/auth/PinModal';
import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

const inter = Inter({ subsets: ['latin'] })

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  const [isPinModalOpen, setIsPinModalOpen] = useState(false);

  return (
    <html lang="fr" className="h-full">
      <body className={`${inter.className} min-h-full bg-background text-text-primary antialiased`}>
        <AchievementsProvider>
          <div className="min-h-full">
            <header className="fixed top-0 left-0 right-0 z-50 bg-surface-dark border-b border-white/10 pt-safe-top">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
                <div className="flex items-center justify-between">
                  <Link 
                    href="/" 
                    className="flex items-center gap-2 sm:gap-3"
                  >
                    <Image
                      src="/logo.svg"
                      alt="Logo"
                      width={32}
                      height={32}
                      className="w-8 h-8 sm:w-10 sm:h-10"
                    />
                    <span className="text-lg sm:text-xl font-semibold text-gradient">La Salle Rouen</span>
                  </Link>
                  <div className="flex items-center gap-2 sm:gap-4">
                    <button 
                      onClick={() => setIsPinModalOpen(true)}
                      className="flex items-center gap-2 px-3 py-2 sm:px-4 sm:py-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors text-sm sm:text-base"
                    >
                      <Users className="w-4 h-4 sm:w-5 sm:h-5" />
                      <span>Espace Parents</span>
                    </button>
                    <button 
                      className="p-2 rounded-lg hover:bg-white/5 transition-colors relative"
                      aria-label="Notifications"
                    >
                      <Bell className="w-5 h-5 sm:w-6 sm:h-6" />
                      <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
                    </button>
                  </div>
                </div>
              </div>
            </header>
            <div className="pt-[calc(var(--safe-top)+4rem)]">
              {children}
            </div>
            <PinModal 
              isOpen={isPinModalOpen} 
              onClose={() => setIsPinModalOpen(false)} 
            />
          </div>
        </AchievementsProvider>
      </body>
    </html>
  );
}
