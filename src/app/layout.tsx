import './globals.css'
import '../styles/ios.css'
import { Inter } from 'next/font/google'
import Link from 'next/link'
import Image from 'next/image'
import { AchievementsProvider } from '@/contexts/AchievementsContext';
import { Users, GraduationCap, Bell } from 'lucide-react';
import { Metadata, Viewport } from 'next';
import { PinModal } from '@/components/auth/PinModal';
import { useState } from 'react';

const inter = Inter({ subsets: ['latin'] })

interface RootLayoutProps {
  children: React.ReactNode;
}

export const metadata: Metadata = {
  title: 'Futur Génie',
  description: 'Une application éducative interactive',
  viewport: {
    width: 'device-width',
    initialScale: 1,
    viewportFit: 'cover',
  },
  themeColor: '#0B1120',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Futur Génie',
  },
  manifest: '/manifest.json',
  icons: {
    apple: '/icons/apple-touch-icon.png',
    icon: [
      { url: '/icons/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/icons/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    ]
  }
}

export default function RootLayout({ children }: RootLayoutProps) {
  const [isPinModalOpen, setIsPinModalOpen] = useState(false);

  return (
    <html lang="fr" className="h-full">
      <body className={`${inter.className} min-h-full bg-background text-text-primary antialiased`}>
        <AchievementsProvider>
          <div className="safe-area-inset min-h-full">
            <nav className="fixed top-0 left-0 right-0 z-50 bg-[var(--background-dark)]/80 backdrop-blur-xl border-b border-[var(--card-border)] safe-top">
              <div className="container mx-auto px-4 sm:px-6 py-4">
                <div className="flex items-center justify-between">
                  <Link href="/" className="flex items-center gap-3">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 relative">
                      <Image 
                        src="/logo-original.png"
                        alt="Futur Génie"
                        fill
                        className="object-contain"
                        priority
                      />
                    </div>
                    <span className="text-lg sm:text-xl font-semibold text-gradient">La Salle Rouen</span>
                  </Link>
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
                      <Bell className="w-5 h-5" />
                      <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
                    </button>
                  </div>
                </div>
              </div>
            </nav>
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
