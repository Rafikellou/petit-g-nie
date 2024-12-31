'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Home,
  HelpCircle,
  Book,
  BarChart2,
  Settings,
} from 'lucide-react';

const navigationItems = [
  {
    name: 'Accueil',
    href: '/teacher',
    icon: Home,
  },
  {
    name: 'Questions',
    href: '/teacher/questions',
    icon: HelpCircle,
  },
  {
    name: 'Leçons',
    href: '/teacher/lessons',
    icon: Book,
  },
  {
    name: 'Performances élèves',
    href: '/teacher/performance',
    icon: BarChart2,
  },
  {
    name: 'Paramètres',
    href: '/teacher/settings',
    icon: Settings,
  },
];

export default function TeacherSidebar() {
  const pathname = usePathname();

  return (
    <div className="w-64 h-screen bg-gray-900 fixed left-0 top-0 p-4">
      <div className="flex items-center gap-2 px-2 mb-8">
        <div className="w-8 h-8 rounded-lg bg-indigo-500 flex items-center justify-center text-white font-bold">
          FG
        </div>
        <span className="text-lg font-semibold">Futur Génie</span>
      </div>

      <nav className="space-y-1">
        {navigationItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                isActive
                  ? 'bg-indigo-500 text-white'
                  : 'text-gray-400 hover:text-white hover:bg-gray-800'
              }`}
            >
              <item.icon className="w-5 h-5" />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
