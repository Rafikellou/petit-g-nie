'use client';

import { cn } from '@/lib/utils';
import { Menu, X } from 'lucide-react';
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';

interface MobileMenuProps {
  tabs: {
    name: string;
    href: string;
    icon: React.ElementType;
  }[];
}

export function MobileMenu({ tabs }: MobileMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  // Fermer le menu quand on change de page
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  return (
    <div className="md:hidden">
      {/* Bouton burger */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 text-gray-400 hover:text-white"
      >
        {isOpen ? (
          <X className="h-6 w-6" />
        ) : (
          <Menu className="h-6 w-6" />
        )}
      </button>

      {/* Menu déroulant */}
      {isOpen && (
        <div className="fixed inset-0 z-50 bg-gray-950/90 pt-16">
          <div className="container mx-auto px-4 py-4">
            <div className="space-y-1">
              {tabs.map((tab) => {
                const isActive = pathname === tab.href;
                const Icon = tab.icon;
                return (
                  <Link
                    key={tab.href}
                    href={tab.href}
                    className={cn(
                      'flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-colors',
                      isActive
                        ? 'bg-turquoise-500/10 text-turquoise-500'
                        : 'text-gray-400 hover:bg-gray-800 hover:text-gray-300'
                    )}
                  >
                    <Icon className="h-5 w-5" />
                    {tab.name}
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
