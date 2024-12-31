'use client';

import { FC } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Home,
  Users,
  BookOpen,
  Settings,
  BarChart2,
  Bell,
  LogOut
} from 'lucide-react';

const AdminNavbar: FC = () => {
  const pathname = usePathname();

  const navItems = [
    { href: '/admin', label: 'Tableau de bord', icon: Home },
    { href: '/admin/users', label: 'Utilisateurs', icon: Users },
    { href: '/admin/content', label: 'Contenu', icon: BookOpen },
    { href: '/admin/analytics', label: 'Analytiques', icon: BarChart2 },
    { href: '/admin/notifications', label: 'Notifications', icon: Bell },
    { href: '/admin/settings', label: 'Paramètres', icon: Settings },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 bg-gray-800 border-b border-white/10 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo et titre */}
          <div className="flex items-center">
            <Link href="/admin" className="flex items-center">
              <span className="text-xl font-bold text-white">Admin Petit Génie</span>
            </Link>
          </div>

          {/* Navigation principale */}
          <div className="flex items-center space-x-4">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium ${
                  pathname === item.href
                    ? 'bg-gray-900 text-white'
                    : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                }`}
              >
                <item.icon className="w-5 h-5" />
                {item.label}
              </Link>
            ))}
          </div>

          {/* Actions utilisateur */}
          <div className="flex items-center">
            <button
              className="flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white"
              onClick={() => {
                // TODO: Implement logout
                console.log('Logout clicked');
              }}
            >
              <LogOut className="w-5 h-5" />
              Déconnexion
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default AdminNavbar;
