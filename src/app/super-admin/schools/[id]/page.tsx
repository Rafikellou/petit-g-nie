'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { ArrowLeft, Users, School as SchoolIcon, Settings, Copy, Check, X } from 'lucide-react';
import { Button } from '@/components/ui/ios-button';
import { School, Profile } from '@/types/auth';

interface TeacherWithUser extends Profile {
  user: {
    email: string;
  };
  school: School | null;
}

export default function SchoolDetails() {
  const params = useParams();
  const router = useRouter();
  const [school, setSchool] = useState<School | null>(null);
  const [teachers, setTeachers] = useState<TeacherWithUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const supabase = createClientComponentClient();

  useEffect(() => {
    const loadSchoolData = async () => {
      try {
        setLoading(true);

        // Charger les données de l'école
        const { data: schoolData, error: schoolError } = await supabase
          .from('schools')
          .select('*')
          .eq('id', params.id)
          .single();

        if (schoolError) throw schoolError;
        setSchool(schoolData);

        // Charger les enseignants
        const { data: teachersData, error: teachersError } = await supabase
          .from('profiles')
          .select('*, user:users(email), school:schools(*)')
          .eq('school_id', params.id)
          .eq('role', 'teacher');

        if (teachersError) throw teachersError;
        setTeachers(teachersData);

      } catch (error: any) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    loadSchoolData();
  }, [params.id]);

  const copyInvitationCode = () => {
    if (!school?.invitation_code) return;
    navigator.clipboard.writeText(school.invitation_code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDeleteSchool = async () => {
    try {
      setLoading(true);

      // Supprimer l'école
      const { error } = await supabase
        .from('schools')
        .delete()
        .eq('id', school?.id);

      if (error) throw error;

      router.push('/super-admin');
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-white/70">Chargement...</p>
      </div>
    );
  }

  if (error || !school) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-red-400">{error || "École non trouvée"}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-surface-dark border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            <button 
              onClick={() => router.push('/super-admin')}
              className="flex items-center space-x-2 text-white hover:text-white/80 transition tap-target touch-manipulation"
            >
              <ArrowLeft className="w-6 h-6" />
              <span className="text-lg font-medium">Retour</span>
            </button>
            <h1 className="text-xl font-bold">{school.nom_ecole}</h1>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Informations de l'école */}
        <div className="glass-card p-6 mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <h2 className="text-xl font-bold mb-2">{school.nom_ecole}</h2>
              <p className="text-white/70">{school.code_postal} {school.ville}</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                onClick={copyInvitationCode}
                className="flex items-center space-x-2"
              >
                {copied ? (
                  <Check className="w-5 h-5" />
                ) : (
                  <Copy className="w-5 h-5" />
                )}
                <span>
                  {copied ? 'Code copié !' : 'Copier le code d\'invitation'}
                </span>
              </Button>
              <Button
                onClick={() => setShowDeleteConfirm(true)}
                variant="destructive"
                className="flex items-center space-x-2"
              >
                <X className="w-5 h-5" />
                <span>Supprimer l'école</span>
              </Button>
            </div>
          </div>
        </div>

        {/* Liste des enseignants */}
        <div className="glass-card p-6">
          <h3 className="text-lg font-bold mb-4">Enseignants ({teachers.length})</h3>
          
          <div className="space-y-4">
            {teachers.length === 0 ? (
              <p className="text-white/70">Aucun enseignant pour le moment</p>
            ) : (
              teachers.map((teacher) => (
                <div 
                  key={teacher.id}
                  className="flex items-center justify-between p-4 bg-white/5 rounded-lg"
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                      <Users className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">
                        {teacher.family_name} {teacher.surname}
                      </p>
                      <p className="text-sm text-white/70">{teacher.user.email}</p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </main>

      {/* Modal de confirmation de suppression */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="glass-card p-6 max-w-md w-full space-y-4">
            <h2 className="text-xl font-bold text-red-400">Supprimer l'école</h2>
            <p className="text-white/70">
              Êtes-vous sûr de vouloir supprimer cette école ? Cette action est irréversible.
            </p>
            <div className="flex gap-4">
              <Button
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1"
                variant="secondary"
              >
                Annuler
              </Button>
              <Button
                onClick={handleDeleteSchool}
                className="flex-1"
                variant="destructive"
                disabled={loading}
              >
                {loading ? 'Suppression...' : 'Supprimer'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
