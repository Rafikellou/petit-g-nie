import { ReactNode } from 'react';
import AdminNavbar from '@/components/admin/AdminNavbar';

interface AdminLayoutProps {
  children: ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-900">
      <AdminNavbar />
      <main className="pt-16">
        {children}
      </main>
    </div>
  );
}
