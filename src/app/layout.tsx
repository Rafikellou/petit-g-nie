'use client';

import { Inter } from 'next/font/google';
import { Toaster } from 'sonner';
import './globals.css';
import { AchievementsProvider } from '@/contexts/AchievementsContext';
import { Users, LogOut } from 'lucide-react';
import { PinModal } from '@/components/auth/PinModal';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { NotificationsList } from '@/components/notifications/NotificationsList';
import { useRouter } from 'next/navigation';
import { useUser } from '@/hooks/useUser';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

const inter = Inter({ subsets: ['latin'] })

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  const [isPinModalOpen, setIsPinModalOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const router = useRouter();
  const { user, loading } = useUser();
  const supabase = createClientComponentClient();

  useEffect(() => {
    // Rediriger vers la page de connexion si l'utilisateur n'est pas connecté
    if (!loading && !user) {
      router.push('/auth');
    }
  }, [user, loading, router]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/auth');
  };

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

                  <div className="flex items-center gap-2">
                    <NotificationsList />
                    <div className="relative">
                      <button
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
                      >
                        <Users className="w-4 h-4 sm:w-5 sm:h-5" />
                        <span className="hidden sm:inline">Compte</span>
                      </button>

                      {/* Menu déroulant */}
                      {isMenuOpen && (
                        <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-[#1A1A1B] border border-white/10">
                          <div className="py-1">
                            <button
                              onClick={() => {
                                setIsMenuOpen(false);
                                setIsPinModalOpen(true);
                              }}
                              className="w-full text-left px-4 py-2 text-sm hover:bg-white/5"
                            >
                              Espace parent
                            </button>
                            <button
                              onClick={() => {
                                setIsMenuOpen(false);
                                handleSignOut();
                              }}
                              className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-white/5 flex items-center gap-2"
                            >
                              <LogOut className="w-4 h-4" />
                              <span>Se déconnecter</span>
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
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
              onSuccess={() => {
                setIsPinModalOpen(false);
                router.push('/parent');
              }}
            />
          </div>
        </AchievementsProvider>
        <Toaster richColors position="top-right" />
      </body>
    </html>
  );
}
