import './globals.css'
import { Inter } from 'next/font/google'
import Link from 'next/link'
import { AchievementsProvider } from '@/contexts/AchievementsContext';
import { Lock } from 'lucide-react';

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Futur Génie',
  description: 'Votre assistant personnel pour apprendre le français',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr">
      <body className={inter.className}>
        <AchievementsProvider>
          <div className="min-h-screen">
            <nav className="fixed top-0 left-0 right-0 z-50 bg-[var(--background-dark)]/80 backdrop-blur-xl border-b border-[var(--card-border)]">
              <div className="container mx-auto px-6 py-4">
                <div className="flex items-center justify-between">
                  <Link href="/" className="flex items-center gap-3">
                    <div className="icon-container w-12 h-12">
                      <span className="text-xl font-bold text-[var(--primary)]">JB</span>
                    </div>
                    <span className="text-xl font-semibold text-gradient">La Salle Rouen</span>
                  </Link>
                  <div className="flex items-center gap-4">
                    <Link 
                      href="/parent" 
                      className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
                    >
                      <Lock className="w-4 h-4" />
                      <span>Espace Parent</span>
                    </Link>
                    <Link 
                      href="/teacher" 
                      className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-[rgb(var(--primary))] to-[rgb(var(--primary-dark))] hover:opacity-90 transition-opacity"
                    >
                      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M20 17V19C20 20.1046 19.1046 21 18 21H6C4.89543 21 4 20.1046 4 19V17M15 8L12 5M12 5L9 8M12 5V16" 
                          stroke="currentColor" 
                          strokeWidth="2" 
                          strokeLinecap="round" 
                          strokeLinejoin="round"
                        />
                      </svg>
                      <span>Espace Enseignant</span>
                    </Link>
                  </div>
                </div>
              </div>
            </nav>
            <main className="pt-20">
              {children}
            </main>
          </div>
        </AchievementsProvider>
      </body>
    </html>
  );
}
