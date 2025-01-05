import Link from 'next/link';
import { GraduationCap } from 'lucide-react';

export function Footer() {
  return (
    <footer className="mt-20 border-t border-white/10 py-8">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-center md:text-left">
            <p className="text-sm text-white/60">
              © 2025 Futur Génie. Tous droits réservés.
            </p>
          </div>
          
          <Link 
            href="/teacher"
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
          >
            <GraduationCap className="w-5 h-5" />
            <span>Espace Enseignant</span>
          </Link>
        </div>
      </div>
    </footer>
  );
}
