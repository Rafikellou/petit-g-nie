'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Home,
  HelpCircle,
  Book,
  BarChart2,
  Settings,
  Menu,
  X,
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
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Menu burger pour mobile */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-gray-900 px-4 py-3 flex items-center justify-between border-b border-gray-800">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-indigo-500 flex items-center justify-center text-white font-bold">
            FG
          </div>
          <span className="text-lg font-semibold text-white">Futur Génie</span>
        </div>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 text-gray-400 hover:text-white transition-colors"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Overlay sombre quand le menu est ouvert sur mobile */}
      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed top-0 left-0 z-50 h-screen bg-gray-900 transform transition-transform duration-300 ease-in-out
        lg:translate-x-0 lg:w-64
        w-64 ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        {/* Logo et titre (caché sur mobile car déjà dans le header) */}
        <div className="hidden lg:flex items-center gap-2 p-4 mb-4">
          <div className="w-8 h-8 rounded-lg bg-indigo-500 flex items-center justify-center text-white font-bold">
            FG
          </div>
          <span className="text-lg font-semibold text-white">Futur Génie</span>
        </div>

        {/* Navigation */}
        <nav className="px-2 py-4">
          {navigationItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className={`
                  flex items-center gap-2 px-4 py-3 rounded-lg mb-1
                  transition-colors duration-200
                  ${isActive
                    ? 'bg-indigo-500 text-white'
                    : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                  }
                `}
              >
                <item.icon size={20} />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </>
  );
}
