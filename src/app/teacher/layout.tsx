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
      <div className="border-b border-gray-800">
        <nav className="container mx-auto px-4 sm:px-6">
          <ul className="flex space-x-8 overflow-x-auto">
            {tabs.map((tab) => {
              const isActive = pathname === tab.href;
              return (
                <li key={tab.href}>
                  <Link
                    href={tab.href}
                    className={cn(
                      'flex items-center gap-2 border-b-2 px-1 py-4 text-sm font-medium',
                      isActive
                        ? 'border-turquoise-500 text-turquoise-500'
                        : 'border-transparent text-gray-400 hover:border-gray-300 hover:text-gray-300'
                    )}
                  >
                    <tab.icon className="h-5 w-5" />
                    {tab.name}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>
      <main className="container mx-auto px-4 sm:px-6 py-8">
        {children}
      </main>
    </div>
  );
}
