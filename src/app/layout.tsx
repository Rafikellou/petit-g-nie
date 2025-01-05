import './globals.css'
import '../styles/ios.css'
import { Inter } from 'next/font/google'
import Link from 'next/link'
import Image from 'next/image'
import { AchievementsProvider } from '@/contexts/AchievementsContext';
import { Users, GraduationCap, Bell } from 'lucide-react';
import { Metadata, Viewport } from 'next';

const inter = Inter({ subsets: ['latin'] })

interface AppleWebAppMetadata {
  capable: boolean;
  statusBarStyle: 'default' | 'black' | 'black-translucent';
  title: string;
}

interface AppMetadata extends Metadata {
  viewport: Viewport;
  themeColor: string;
  appleWebApp: AppleWebAppMetadata;
  manifest: string;
}

export const metadata: AppMetadata = {
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
}

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="fr" className="h-full">
      <head>
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Futur Génie" />
        <meta name="theme-color" content="#0B1120" />
        <link rel="apple-touch-icon" href="/icons/apple-touch-icon.png?v=2" />
        <link rel="icon" type="image/png" sizes="32x32" href="/icons/favicon-32x32.png?v=2" />
        <link rel="icon" type="image/png" sizes="16x16" href="/icons/favicon-16x16.png?v=2" />
        <link rel="manifest" href="/manifest.json" />
      </head>
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
                    <span className="text-lg sm:text-xl font-semibold text-gradient">Futur Génie</span>
                  </Link>
                  <div className="flex items-center gap-2 sm:gap-4">
                    <Link 
                      href="/parent" 
                      className="flex items-center gap-2 px-3 py-2 sm:px-4 sm:py-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors text-sm sm:text-base"
                    >
                      <Users className="w-4 h-4 sm:w-5 sm:h-5" />
                      <span className="hidden sm:inline">Espace Parents</span>
                    </Link>
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
          </div>
        </AchievementsProvider>
      </body>
    </html>
  )
}
