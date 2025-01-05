'use client';

import { cn } from '@/lib/utils';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { PlusCircle, Brain, LineChart, Settings } from 'lucide-react';
import { useState, useEffect } from 'react';
import { MobileMenu } from '@/components/teacher/MobileMenu';

// Simuler les données de l'enseignant
const mockTeacher = {
  title: 'Mme',
  lastName: 'Dubois'
};

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
  const [teacher, setTeacher] = useState(mockTeacher);

  return (
    <div className="min-h-screen bg-gray-950">
      {/* Navigation fixe en haut avec message de bienvenue */}
      <div className="fixed top-16 left-0 right-0 z-10 bg-gray-900">
        {/* Message de bienvenue et menu burger */}
        <div className="border-b border-gray-800">
          <div className="container mx-auto px-4 py-4 flex justify-between items-center">
            <h2 className="text-xl font-medium text-gray-200">
              Bonjour {teacher.title} {teacher.lastName}
            </h2>
            <MobileMenu tabs={tabs} />
          </div>
        </div>

        {/* Navigation desktop */}
        <div className="hidden md:block border-b border-gray-800">
          <div className="container mx-auto px-4">
            <div className="flex space-x-8">
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
          </div>
        </div>
      </div>

      {/* Contenu principal avec padding-top ajusté */}
      <main className="container mx-auto px-4 pt-[120px] md:pt-[180px] pb-8">
        {children}
      </main>
    </div>
  );
}
