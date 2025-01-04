'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Users, School, Settings, Search, Shield, UserPlus, Building2, BarChart3 } from 'lucide-react';
import { Button } from '@/components/ui/ios-button';

interface School {
  id: string;
  name: string;
  address: string;
  teachersCount: number;
  studentsCount: number;
  status: 'active' | 'pending' | 'inactive';
}

const mockSchools: School[] = [
  {
    id: '1',
    name: 'École Jean Moulin',
    address: '123 Rue de la République, 75001 Paris',
    teachersCount: 25,
    studentsCount: 450,
    status: 'active'
  },
  {
    id: '2',
    name: 'École Victor Hugo',
    address: '456 Avenue des Champs-Élysées, 75008 Paris',
    teachersCount: 30,
    studentsCount: 520,
    status: 'active'
  },
  {
    id: '3',
    name: 'École Marie Curie',
    address: '789 Boulevard Saint-Germain, 75006 Paris',
    teachersCount: 20,
    studentsCount: 380,
    status: 'pending'
  }
];

export default function SuperAdminDashboard() {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredSchools = mockSchools.filter(school =>
    school.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    school.address.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background safe-area-inset">
      <header className="bg-surface-dark border-b border-white/10 pt-safe-top">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            <Link 
              href="/"
              className="flex items-center space-x-2 text-white hover:text-white/80 transition tap-target touch-manipulation"
              aria-label="Retour à l'accueil"
            >
              <ArrowLeft className="w-6 h-6" />
              <span className="text-lg font-medium">Retour</span>
            </Link>
            <h1 className="text-xl font-bold">Super Admin</h1>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Statistiques générales */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="glass-card p-6">
            <div className="flex items-center space-x-4">
              <div className="rounded-full bg-primary/20 p-3">
                <Building2 className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-white/70">Écoles</p>
                <p className="text-2xl font-bold">{mockSchools.length}</p>
              </div>
            </div>
          </div>
          
          <div className="glass-card p-6">
            <div className="flex items-center space-x-4">
              <div className="rounded-full bg-green-500/20 p-3">
                <School className="w-6 h-6 text-green-400" />
              </div>
              <div>
                <p className="text-sm text-white/70">Enseignants</p>
                <p className="text-2xl font-bold">
                  {mockSchools.reduce((acc, school) => acc + school.teachersCount, 0)}
                </p>
              </div>
            </div>
          </div>
          
          <div className="glass-card p-6">
            <div className="flex items-center space-x-4">
              <div className="rounded-full bg-yellow-500/20 p-3">
                <Users className="w-6 h-6 text-yellow-400" />
              </div>
              <div>
                <p className="text-sm text-white/70">Élèves</p>
                <p className="text-2xl font-bold">
                  {mockSchools.reduce((acc, school) => acc + school.studentsCount, 0)}
                </p>
              </div>
            </div>
          </div>
          
          <div className="glass-card p-6">
            <div className="flex items-center space-x-4">
              <div className="rounded-full bg-purple-500/20 p-3">
                <BarChart3 className="w-6 h-6 text-purple-400" />
              </div>
              <div>
                <p className="text-sm text-white/70">Taux d'activité</p>
                <p className="text-2xl font-bold">
                  {Math.round((mockSchools.filter(s => s.status === 'active').length / mockSchools.length) * 100)}%
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Actions rapides */}
        <div className="flex gap-4 mb-8 overflow-x-auto hide-scrollbar py-2">
          <Button className="flex items-center space-x-2 whitespace-nowrap min-h-[44px]">
            <UserPlus className="w-5 h-5" />
            <span>Ajouter une école</span>
          </Button>
          <Button className="flex items-center space-x-2 whitespace-nowrap min-h-[44px]">
            <Settings className="w-5 h-5" />
            <span>Paramètres</span>
          </Button>
          <Button className="flex items-center space-x-2 whitespace-nowrap min-h-[44px]">
            <Shield className="w-5 h-5" />
            <span>Sécurité</span>
          </Button>
        </div>

        {/* Barre de recherche */}
        <div className="glass-card p-4 mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/40" />
            <input
              type="text"
              placeholder="Rechercher une école..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-lg pl-10 pr-4 py-3 text-white placeholder-white/40 focus:outline-none focus:border-primary transition-colors"
            />
          </div>
        </div>

        {/* Liste des écoles */}
        <div className="space-y-4">
          {filteredSchools.map((school) => (
            <div
              key={school.id}
              className="glass-card p-6 hover:bg-white/5 transition tap-target touch-manipulation"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                    <Building2 className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-lg font-medium">{school.name}</h3>
                    <p className="text-sm text-white/70">{school.address}</p>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <div className="flex items-center gap-4">
                    <div className="text-center">
                      <p className="text-sm text-white/70">Enseignants</p>
                      <p className="font-bold">{school.teachersCount}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm text-white/70">Élèves</p>
                      <p className="font-bold">{school.studentsCount}</p>
                    </div>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-sm ${
                    school.status === 'active' ? 'bg-green-500/20 text-green-400' :
                    school.status === 'pending' ? 'bg-yellow-500/20 text-yellow-400' :
                    'bg-red-500/20 text-red-400'
                  }`}>
                    {school.status === 'active' ? 'Actif' :
                     school.status === 'pending' ? 'En attente' :
                     'Inactif'}
                  </div>
                </div>
              </div>
            </div>
          ))}

          {filteredSchools.length === 0 && (
            <div className="text-center py-12">
              <Building2 className="w-12 h-12 text-white/20 mx-auto mb-4" />
              <p className="text-white/60">Aucune école ne correspond à votre recherche</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
