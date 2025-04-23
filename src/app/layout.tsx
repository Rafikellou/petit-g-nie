'use client';

import { Inter } from 'next/font/google';
import { Toaster } from 'sonner';
import './globals.css';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@/hooks/useUser';
import { AchievementsProvider } from '@/contexts/AchievementsContext';
import { PinVerificationProvider } from '@/contexts/PinVerificationContext';
import Header from '@/components/common/Header';

const inter = Inter({ subsets: ['latin'] })

interface RootLayoutProps {
  children: React.ReactNode;
}

// Le composant Header a été déplacé vers src/components/common/Header.tsx

export default function RootLayout({ children }: RootLayoutProps) {
  const router = useRouter();
  const { user, loading } = useUser();

  useEffect(() => {
    // Rediriger vers la page de connexion si l'utilisateur n'est pas connecté
    if (!loading && !user) {
      router.push('/auth');
    }
  }, [user, loading, router]);

  return (
    <html lang="fr" className="h-full">
      <body className={`${inter.className} min-h-full bg-[var(--background)] text-white antialiased`}>
        <AchievementsProvider>
          <PinVerificationProvider>
            <div className="min-h-full">
              <Header isMain={true} />
              <div className="pt-[calc(var(--safe-top)+4rem)]">
                {children}
              </div>
            </div>
          </PinVerificationProvider>
        </AchievementsProvider>
        <Toaster richColors position="top-right" />
      </body>
    </html>
  );
}
