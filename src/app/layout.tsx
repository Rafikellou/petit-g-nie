import './globals.css'
import { Inter } from 'next/font/google'
import Link from 'next/link'
import { AchievementsProvider } from '@/contexts/AchievementsContext';
import { Users, GraduationCap } from 'lucide-react';

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Futur Génie',
  description: 'Votre assistant personnel pour apprendre le français',
  viewport: 'width=device-width, initial-scale=1, maximum-scale=1, viewport-fit=cover, user-scalable=no',
  themeColor: '#0F172A',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'Futur Génie',
  },
  manifest: '/manifest.json',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr">
      <head>
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="Futur Génie" />
        <link rel="apple-touch-icon" href="/icon-192x192.png" />
        <link rel="apple-touch-startup-image" href="/splash.png" />
      </head>
      <body className={`${inter.className} safe-top safe-bottom`}>
        <AchievementsProvider>
          <div className="min-h-screen">
            <nav className="fixed top-0 left-0 right-0 z-50 bg-[var(--background-dark)]/80 backdrop-blur-xl border-b border-[var(--card-border)] safe-top">
              <div className="container mx-auto px-4 sm:px-6 py-4">
                <div className="flex items-center justify-between">
                  <Link href="/" className="flex items-center gap-3">
                    <div className="icon-container w-10 h-10 sm:w-12 sm:h-12">
                      <span className="text-lg sm:text-xl font-bold text-[var(--primary)]">JB</span>
                    </div>
                    <span className="text-lg sm:text-xl font-semibold text-gradient">La Salle Rouen</span>
                  </Link>
                  <div className="flex items-center gap-2 sm:gap-4">
                    <Link 
                      href="/parent" 
                      className="flex items-center gap-2 px-3 py-2 sm:px-4 sm:py-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors text-sm sm:text-base"
                    >
                      <Users className="w-4 h-4 sm:w-5 sm:h-5" />
                      <span className="hidden sm:inline">Espace Parents</span>
                    </Link>
                    <Link 
                      href="/teacher" 
                      className="flex items-center gap-2 px-3 py-2 sm:px-4 sm:py-2 rounded-lg bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-300 transition-colors text-sm sm:text-base"
                    >
                      <GraduationCap className="w-4 h-4 sm:w-5 sm:h-5" />
                      <span className="hidden sm:inline">Espace Enseignant</span>
                    </Link>
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
