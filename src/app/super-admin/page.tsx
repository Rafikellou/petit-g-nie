'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { ArrowLeft, Users, School, Settings, Search, Shield, UserPlus, Building2, BarChart3 } from 'lucide-react';
import { Button } from '@/components/ui/ios-button';
import { School as SchoolType } from '@/types/auth';

interface SchoolWithStats extends SchoolType {
  teachersCount: number;
  studentsCount: number;
}

export default function SuperAdminDashboard() {
  const [schools, setSchools] = useState<SchoolWithStats[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAddSchool, setShowAddSchool] = useState(false);
  const [newSchool, setNewSchool] = useState({
    nom_ecole: '',
    code_postal: '',
    ville: ''
  });
  const supabase = createClientComponentClient();

  // Charger les écoles et leurs statistiques
  useEffect(() => {
    const loadSchools = async () => {
      try {
        setLoading(true);
        
        // Récupérer les écoles
        const { data: schoolsData, error: schoolsError } = await supabase
          .from('schools')
          .select('*');

        if (schoolsError) throw schoolsError;

        // Pour chaque école, récupérer le nombre d'enseignants et d'élèves
        const schoolsWithStats = await Promise.all(schoolsData.map(async (school) => {
          // Compter les enseignants
          const { count: teachersCount } = await supabase
            .from('profiles')
            .select('*', { count: 'exact', head: true })
            .eq('school_id', school.id)
            .eq('role', 'teacher');

          // Compter les élèves
          const { count: studentsCount } = await supabase
            .from('children')
            .select('*', { count: 'exact', head: true })
            .eq('school_id', school.id);

          return {
            ...school,
            teachersCount: teachersCount || 0,
            studentsCount: studentsCount || 0,
          };
        }));

        setSchools(schoolsWithStats);
      } catch (error: any) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    loadSchools();
  }, []);

  // Filtrer les écoles
  const filteredSchools = schools.filter(school =>
    school.nom_ecole.toLowerCase().includes(searchQuery.toLowerCase()) ||
    school.ville.toLowerCase().includes(searchQuery.toLowerCase()) ||
    school.code_postal.includes(searchQuery)
  );

  // Ajouter une école
  const handleAddSchool = async () => {
    try {
      setLoading(true);
      
      // Générer un code d'invitation unique
      const invitationCode = Math.random().toString(36).substring(2, 15);

      const { data: school, error } = await supabase
        .from('schools')
        .insert({
          nom_ecole: newSchool.nom_ecole,
          code_postal: newSchool.code_postal,
          ville: newSchool.ville,
          invitation_code: invitationCode,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          status: 'active'
        })
        .select()
        .single();

      if (error) throw error;

      setSchools([...schools, { ...school, teachersCount: 0, studentsCount: 0 }]);
      setShowAddSchool(false);
      setNewSchool({ nom_ecole: '', code_postal: '', ville: '' });
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

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
                <p className="text-2xl font-bold">{schools.length}</p>
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
                  {schools.reduce((acc, school) => acc + school.teachersCount, 0)}
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
                  {schools.reduce((acc, school) => acc + school.studentsCount, 0)}
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
                  {schools.length > 0 ? Math.round((schools.filter(s => s.status === 'active').length / schools.length) * 100) : 0}%
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Actions rapides */}
        <div className="flex gap-4 mb-8 overflow-x-auto hide-scrollbar py-2">
          <Button 
            onClick={() => setShowAddSchool(true)}
            className="flex items-center space-x-2 whitespace-nowrap min-h-[44px]"
          >
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

        {/* Modal d'ajout d'école */}
        {showAddSchool && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="glass-card p-6 max-w-md w-full space-y-6">
              <h2 className="text-xl font-bold">Ajouter une école</h2>
              
              <div className="space-y-4">
                <div>
                  <label htmlFor="nom_ecole" className="block text-sm font-medium text-white mb-2">
                    Nom de l'école
                  </label>
                  <input
                    id="nom_ecole"
                    type="text"
                    value={newSchool.nom_ecole}
                    onChange={(e) => setNewSchool({ ...newSchool, nom_ecole: e.target.value })}
                    className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 text-white placeholder-white/50"
                    placeholder="Entrez le nom de l'école"
                  />
                </div>

                <div>
                  <label htmlFor="code_postal" className="block text-sm font-medium text-white mb-2">
                    Code postal
                  </label>
                  <input
                    id="code_postal"
                    type="text"
                    value={newSchool.code_postal}
                    onChange={(e) => setNewSchool({ ...newSchool, code_postal: e.target.value })}
                    className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 text-white placeholder-white/50"
                    placeholder="Entrez le code postal"
                    maxLength={5}
                    pattern="[0-9]*"
                  />
                </div>

                <div>
                  <label htmlFor="ville" className="block text-sm font-medium text-white mb-2">
                    Ville
                  </label>
                  <input
                    id="ville"
                    type="text"
                    value={newSchool.ville}
                    onChange={(e) => setNewSchool({ ...newSchool, ville: e.target.value })}
                    className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 text-white placeholder-white/50"
                    placeholder="Entrez la ville"
                  />
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <Button
                  onClick={() => setShowAddSchool(false)}
                  className="flex-1"
                  variant="secondary"
                >
                  Annuler
                </Button>
                <Button
                  onClick={handleAddSchool}
                  className="flex-1"
                  disabled={!newSchool.nom_ecole || !newSchool.code_postal || !newSchool.ville || loading}
                >
                  {loading ? 'Création...' : 'Créer'}
                </Button>
              </div>
            </div>
          </div>
        )}

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
          {loading ? (
            <div className="text-center py-12">
              <p className="text-white/70">Chargement des écoles...</p>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <p className="text-red-400">{error}</p>
            </div>
          ) : filteredSchools.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-white/70">Aucune école trouvée</p>
            </div>
          ) : (
            filteredSchools.map((school) => (
              <Link
                key={school.id}
                href={`/super-admin/schools/${school.id}`}
                className="block"
              >
                <div className="glass-card p-6 hover:bg-white/5 transition tap-target touch-manipulation">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                        <Building2 className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="text-lg font-medium">{school.nom_ecole}</h3>
                        <p className="text-sm text-white/70">{school.ville}</p>
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
              </Link>
            ))
          )}
        </div>
      </main>
    </div>
  );
}
