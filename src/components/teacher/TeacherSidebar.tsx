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
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-[var(--background)] px-4 py-3 flex items-center justify-between border-b border-[var(--card-border)]">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="burger-menu btn-icon"
          aria-label="Toggle menu"
        >
          {isOpen ? <X /> : <Menu />}
        </button>
        <span className="font-semibold">Menu</span>
      </div>

      {/* Menu mobile */}
      <div className={`mobile-menu ${isOpen ? 'visible' : 'hidden'} lg:hidden`}>
        <div className="pt-16 px-4">
          <nav className="space-y-1">
            {navigationItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`nav-link ${isActive ? 'active' : ''}`}
                  onClick={() => setIsOpen(false)}
                >
                  <item.icon className="w-5 h-5" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Menu desktop */}
      <div className="hidden lg:flex flex-col fixed top-0 left-0 h-full w-64 bg-[var(--background)] border-r border-[var(--card-border)] safe-top">
        <div className="p-4">
          <div className="icon-container mb-6">
            <span className="text-xl font-bold gradient-text">FG</span>
          </div>
          <nav className="space-y-1">
            {navigationItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`nav-link ${isActive ? 'active' : ''}`}
                >
                  <item.icon className="w-5 h-5" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>
      </div>
    </>
  );
}
