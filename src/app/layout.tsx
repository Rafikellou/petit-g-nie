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
      <body className={`${inter.className} min-h-full bg-[var(--background)] text-white antialiased`}>
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
                      src="/logo Futur Génie 4 cropped.png"
                      alt="Logo Futur Génie"
                      width={40}
                      height={40}
                      className="w-10 h-10 sm:w-12 sm:h-12"
                      priority
                    />
                    <span className="text-lg sm:text-xl font-semibold text-gradient">La Salle Rouen</span>
                  </Link>
                  
                  {/* Titre au milieu */}
                  <h1 className="hidden md:block text-2xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 text-transparent bg-clip-text">
                    Futur Génie
                  </h1>

                  <div className="flex items-center gap-2 sm:gap-4">
                    <button 
                      onClick={() => setIsPinModalOpen(true)}
                      className="flex items-center gap-2 px-3 py-2 sm:px-4 sm:py-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors text-sm sm:text-base"
                    >
                      <Users className="w-4 h-4 sm:w-5 sm:h-5" />
                      <span className="hidden sm:inline">Espace Parents</span>
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
