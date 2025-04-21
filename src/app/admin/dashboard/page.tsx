'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import AdminNavbar from '@/components/admin/AdminNavbar'
import { supabase } from '@/lib/supabase'

export default function AdminDashboard() {
  console.log('[ADMIN] Début du rendu de la page dashboard admin')
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [schoolName, setSchoolName] = useState('')
  const [stats, setStats] = useState({
    teachersCount: 0,
    studentsCount: 0,
    classesCount: 0
  })
  const [authError, setAuthError] = useState<string | null>(null)

  useEffect(() => {
    const checkAuth = async () => {
      try {
        console.log('[ADMIN] Début de la vérification d\'authentification');
        
        const { data: sessionData, error: sessionError } = await supabase.auth.getSession()
        
        if (sessionError) {
          console.error('[ADMIN] Erreur de session:', sessionError);
          setAuthError('Erreur de session: ' + sessionError.message)
          return
        }
        
        if (!sessionData.session) {
          console.log('[ADMIN] Pas de session active');
          setAuthError('Aucune session active. Veuillez vous connecter.')
          router.push('/auth')
          return
        }

        console.log('[ADMIN] Session utilisateur:', {
          id: sessionData.session.user.id,
          email: sessionData.session.user.email,
          metadata: sessionData.session.user.user_metadata
        });

        // Vérifier si l'utilisateur est un administrateur
        const userRole = sessionData.session.user.user_metadata?.role || '';
        console.log('[ADMIN] Rôle utilisateur:', userRole);
        
        if (userRole !== 'admin') {
          console.log('[ADMIN] L\'utilisateur n\'est pas un admin, redirection');
          setAuthError('Vous n\'avez pas les droits d\'administrateur nécessaires pour accéder à cette page.')
          // Si l'utilisateur n'est pas un admin, le rediriger vers la page appropriée
          if (userRole === 'super_admin') {
            router.push('/super-admin');
          } else if (userRole === 'teacher') {
            router.push('/teacher');
          } else {
            router.push('/');
          }
          return;
        }

        // Récupérer l'ID de l'école de l'administrateur via les métadonnées utilisateur
        console.log('[ADMIN] Récupération de l\'ID de l\'école via métadonnées');
        
        // Récupérer l'ID de l'école depuis les métadonnées utilisateur
        const schoolIdFromMetadata = sessionData.session.user.user_metadata?.school_id || 
                                    sessionData.session.user.user_metadata?.ecole_id;
        
        if (schoolIdFromMetadata) {
          console.log('[ADMIN] ID de l\'école trouvé dans les métadonnées:', schoolIdFromMetadata);
          
          // Récupérer les informations de l'école
          const { data: schoolInfo, error: schoolInfoError } = await supabase
            .from('schools')
            .select('*')
            .eq('id', schoolIdFromMetadata)
            .single();
            
          if (schoolInfoError) {
            console.error('[ADMIN] Erreur lors de la récupération des informations de l\'école:', schoolInfoError);
            setAuthError('Erreur lors de la récupération des informations de l\'école: ' + schoolInfoError.message)
            return;
          }
          
          if (!schoolInfo) {
            console.error('[ADMIN] Aucune école trouvée avec cet ID');
            setAuthError('Aucune école trouvée avec l\'ID: ' + schoolIdFromMetadata)
            return;
          }
          
          console.log('[ADMIN] École trouvée (métadonnées):', schoolInfo.name);
          setSchoolName(schoolInfo.name);
          await fetchStats(schoolIdFromMetadata);
          setLoading(false);
          return;
        } else {
          console.error('[ADMIN] Aucun ID d\'école trouvé dans les métadonnées utilisateur');
          setAuthError('Aucun ID d\'école trouvé dans votre profil. Veuillez contacter un administrateur.')
          return;
        }
      } catch (error) {
        console.error('[ADMIN] Erreur lors de la vérification de l\'authentification:', error)
        setAuthError('Erreur lors de la vérification de l\'authentification: ' + (error as Error).message)
      } finally {
        setLoading(false)
      }
    }

    checkAuth()
  }, [router])

  const fetchStats = async (schoolId: string) => {
    try {
      console.log('[ADMIN] Récupération des statistiques pour l\'école:', schoolId);
      
      // Nombre d'enseignants
      const { data: teachers, error: teachersError } = await supabase
        .from('school_users')
        .select('user_id')
        .eq('school_id', schoolId)
        .eq('role', 'teacher')

      console.log('[ADMIN] Résultat enseignants:', { teachers, teachersError });

      // Nombre de classes
      const { data: classes, error: classesError } = await supabase
        .from('classes')
        .select('id')
        .eq('school_id', schoolId)

      console.log('[ADMIN] Résultat classes:', { classes, classesError });

      // Nombre d'élèves (approximation)
      const { data: students, error: studentsError } = await supabase
        .from('class_students')
        .select('user_id')
        .in('class_id', classes?.map(c => c.id) || [])

      console.log('[ADMIN] Résultat élèves:', { students, studentsError });

      setStats({
        teachersCount: teachers?.length || 0,
        classesCount: classes?.length || 0,
        studentsCount: students?.length || 0
      })
    } catch (error) {
      console.error('[ADMIN] Erreur lors de la récupération des statistiques:', error)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white">
        <div className="flex justify-center items-center h-screen flex-col">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
          <p className="text-white">Chargement du tableau de bord administrateur...</p>
        </div>
      </div>
    )
  }
  
  if (authError) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white">
        <div className="flex justify-center items-center h-screen flex-col">
          <div className="bg-red-500/20 p-6 rounded-lg border border-red-500 max-w-md">
            <h2 className="text-xl font-bold mb-2">Erreur d'authentification</h2>
            <p className="mb-4">{authError}</p>
            <button 
              onClick={() => router.push('/auth')} 
              className="mt-2 bg-white text-gray-900 px-4 py-2 rounded-md hover:bg-gray-100"
            >
              Retour à la connexion
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white">
      <AdminNavbar />
      
      <main className="max-w-7xl mx-auto px-4 py-8 pt-24">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">{schoolName}</h1>
          <p className="text-gray-400">Tableau de bord administrateur</p>
        </div>

        {/* Statistiques */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-lg border border-gray-700">
            <h2 className="text-xl font-semibold mb-2">Classes</h2>
            <p className="text-4xl font-bold text-blue-400">{stats.classesCount}</p>
            <div className="mt-4">
              <a 
                href="/admin/classes" 
                className="text-blue-400 hover:text-blue-300 text-sm flex items-center"
              >
                Gérer les classes →
              </a>
            </div>
          </div>
          
          <div className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-lg border border-gray-700">
            <h2 className="text-xl font-semibold mb-2">Enseignants</h2>
            <p className="text-4xl font-bold text-green-400">{stats.teachersCount}</p>
            <div className="mt-4">
              <a 
                href="/admin/users" 
                className="text-blue-400 hover:text-blue-300 text-sm flex items-center"
              >
                Gérer les utilisateurs →
              </a>
            </div>
          </div>
          
          <div className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-lg border border-gray-700">
            <h2 className="text-xl font-semibold mb-2">Élèves</h2>
            <p className="text-4xl font-bold text-purple-400">{stats.studentsCount}</p>
          </div>
        </div>

        {/* Actions rapides */}
        <div className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-lg border border-gray-700 mb-8">
          <h2 className="text-xl font-semibold mb-4">Actions rapides</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <a 
              href="/admin/classes?action=create" 
              className="bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-md flex items-center justify-center"
            >
              Créer une classe
            </a>
            <a 
              href="/admin/users" 
              className="bg-green-600 hover:bg-green-700 text-white p-4 rounded-md flex items-center justify-center"
            >
              Inviter un enseignant
            </a>
            <a 
              href="/admin/settings" 
              className="bg-purple-600 hover:bg-purple-700 text-white p-4 rounded-md flex items-center justify-center"
            >
              Paramètres de l'école
            </a>
          </div>
        </div>
      </main>
    </div>
  )
}
