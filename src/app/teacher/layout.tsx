'use client';

import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { mockTeacher } from '@/data/mockData';
import { MobileMenu } from '@/components/teacher/MobileMenu';
import { tabs } from '@/config/teacherTabs';

export default function TeacherLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [teacher, setTeacher] = useState(mockTeacher);

  return (
    <div className="min-h-screen bg-gray-950">
      <div className="container mx-auto px-4 pt-24">
        {/* Message de bienvenue */}
        <h1 className="text-2xl font-bold text-white mb-6">
          Bonjour {teacher.title} {teacher.lastName}
        </h1>

        {/* Navigation desktop */}
        <div className="hidden md:block mb-8">
          <nav className="flex space-x-4">
            {tabs.map((tab) => {
              const isActive = pathname === tab.href;
              const Icon = tab.icon;
              return (
                <a
                  key={tab.href}
                  href={tab.href}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-white/10 text-white'
                      : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  {tab.name}
                </a>
              );
            })}
          </nav>
        </div>

        {/* Navigation mobile */}
        <div className="md:hidden mb-6">
          <MobileMenu tabs={tabs} />
        </div>

        {/* Contenu principal */}
        <main>{children}</main>
      </div>
    </div>
  );
}
