'use client';

import { cn } from '@/lib/utils';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { PlusCircle, Brain, LineChart, Settings } from 'lucide-react';

const tabs = [
  {
    name: 'Ajouter une activité',
    href: '/teacher',
    icon: PlusCircle
  },
  {
    name: 'Adapter l\'entrainement',
    href: '/teacher/training',
    icon: Brain
  },
  {
    name: 'Performances',
    href: '/teacher/performance',
    icon: LineChart
  },
  {
    name: 'Paramètres',
    href: '/teacher/settings',
    icon: Settings
  }
];

export default function TeacherLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-gray-950">
      {/* Navigation fixe en haut */}
      <nav className="fixed top-[64px] left-0 right-0 z-10 bg-gray-900 border-b border-gray-800">
        <div className="container mx-auto px-4">
          {/* Version desktop */}
          <div className="hidden md:flex space-x-8">
            {tabs.map((tab) => {
              const isActive = pathname === tab.href;
              return (
                <Link
                  key={tab.href}
                  href={tab.href}
                  className={cn(
                    'flex items-center gap-2 border-b-2 px-1 py-4 text-sm font-medium transition-colors',
                    isActive
                      ? 'border-turquoise-500 text-turquoise-500'
                      : 'border-transparent text-gray-400 hover:border-gray-300 hover:text-gray-300'
                  )}
                >
                  <tab.icon className="h-5 w-5" />
                  {tab.name}
                </Link>
              );
            })}
          </div>

          {/* Version mobile */}
          <div className="flex md:hidden overflow-x-auto py-2 gap-4">
            {tabs.map((tab) => {
              const isActive = pathname === tab.href;
              return (
                <Link
                  key={tab.href}
                  href={tab.href}
                  className={cn(
                    'flex flex-col items-center gap-1 px-3 py-2 text-xs font-medium rounded-lg transition-colors whitespace-nowrap',
                    isActive
                      ? 'bg-turquoise-500/10 text-turquoise-500'
                      : 'text-gray-400 hover:bg-gray-800 hover:text-gray-300'
                  )}
                >
                  <tab.icon className="h-5 w-5" />
                  {tab.name}
                </Link>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Contenu principal avec padding-top pour éviter le chevauchement */}
      <main className="container mx-auto px-4 pt-[144px] pb-8">
        {children}
      </main>
    </div>
  );
}
