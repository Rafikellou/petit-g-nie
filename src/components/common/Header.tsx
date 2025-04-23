'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Users, LogOut, ArrowLeft } from 'lucide-react';
import { useUser } from '@/hooks/useUser';
import { usePinVerification } from '@/contexts/PinVerificationContext';
import { NotificationsList } from '@/components/notifications/NotificationsList';
import { PinModal } from '@/components/auth/PinModal';

interface HeaderProps {
  /** Si true, affiche le header principal avec le logo et le menu utilisateur */
  isMain?: boolean;
  /** Titre à afficher au centre ou à droite du header */
  title?: string;
  /** Si true, affiche un bouton de retour à gauche */
  showBackButton?: boolean;
  /** URL de destination pour le bouton de retour, par défaut '/' */
  backUrl?: string;
  /** Si true, masque les notifications */
  hideNotifications?: boolean;
  /** Si true, masque le menu utilisateur */
  hideUserMenu?: boolean;
  /** Classes CSS supplémentaires pour le header */
  className?: string;
}

export default function Header({
  isMain = false,
  title,
  showBackButton = false,
  backUrl = '/',
  hideNotifications = false,
  hideUserMenu = false,
  className = '',
}: HeaderProps) {
  const [isPinModalOpen, setIsPinModalOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const router = useRouter();
  const { user, loading } = useUser();
  const supabase = createClientComponentClient();
  const { verifyPin } = usePinVerification();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/auth');
  };

  const handlePinSuccess = () => {
    setIsPinModalOpen(false);
    verifyPin();
    router.push('/parent');
  };

  const baseClasses = "bg-surface-dark border-b border-white/10 pt-safe-top";
  const headerClasses = isMain 
    ? `fixed top-0 left-0 right-0 z-50 ${baseClasses} ${className}`
    : `${baseClasses} ${className}`;

  return (
    <header className={headerClasses}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
        <div className="flex items-center justify-between">
          {isMain ? (
            <Link 
              href="/" 
              className="flex items-center gap-2 sm:gap-3"
            >
              <Image
                src="/Logo futur génie fond transparent rogné.png"
                alt="Logo Futur Génie"
                width={40}
                height={40}
                className="w-10 h-10 sm:w-12 sm:h-12"
                priority
              />
              <span className="text-lg sm:text-xl font-semibold text-gradient">La Salle Rouen</span>
            </Link>
          ) : showBackButton ? (
            <Link 
              href={backUrl}
              className="flex items-center space-x-2 text-white hover:text-white/80 transition tap-target touch-manipulation"
              aria-label="Retour"
            >
              <ArrowLeft className="w-6 h-6" />
              <span className="text-lg font-medium">Retour</span>
            </Link>
          ) : null}
          
          {/* Titre au milieu ou à droite */}
          {isMain ? (
            <h1 className="hidden md:block text-2xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 text-transparent bg-clip-text">
              Futur Génie
            </h1>
          ) : title ? (
            <h1 className="text-xl font-bold">{title}</h1>
          ) : null}

          <div className="flex items-center gap-2">
            {!hideNotifications && <NotificationsList />}
            
            {!hideUserMenu && (
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
            )}
          </div>
        </div>
      </div>

      <PinModal 
        isOpen={isPinModalOpen} 
        onClose={() => setIsPinModalOpen(false)}
        onSuccess={handlePinSuccess}
      />
    </header>
  );
}
