import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { User } from '@/types/auth'

export function useUser() {
  // AUTHENTICATION DISABLED - Returns a mock user to bypass all authentication checks
  console.log('[useUser] Authentication disabled - returning mock user');
  
  const mockUser = {
    id: 'mock-user-id',
    email: 'demo@example.com',
    role: 'parent' as const,
    surname_child: 'Demo User',
    class_level: 'CP',
    class_id: 'mock-class-id',
    pin: '1234',
    ecole_id: 'mock-school-id',
    ecole: {
      id: 'mock-school-id',
      nom_ecole: 'École Démo'
    }
  };

  return { 
    user: mockUser, 
    loading: false, 
    error: null 
  };

  /* ORIGINAL AUTHENTICATION CODE COMMENTED OUT
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchUser = async () => {
      try {
        console.log('[useUser] Début de la récupération des données utilisateur');
        setLoading(true);
        
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error('[useUser] Erreur de session:', sessionError);
          setError(sessionError.message);
          return;
        }
        
        if (!session) {
          console.log('[useUser] Pas de session active');
          setUser(null);
          return;
        }
        
        console.log('[useUser] Session utilisateur trouvée:', {
          id: session.user.id,
          email: session.user.email,
          role: session.user.user_metadata?.role,
          completeMetadata: session.user.user_metadata,
          jwt: session.access_token
        });

        const userData: User = {
          id: session.user.id,
          email: session.user.email || '',
          role: session.user.user_metadata?.role || 'parent',
        };

        // Pour les rôles admin et teacher, récupérer l'ID de l'école depuis school_users
        if (userData.role === 'admin' || userData.role === 'teacher') {
          console.log(`[useUser] Récupération de l'ID de l'école pour le rôle ${userData.role}`);
          
          try {
            // Tentative de récupération via school_users avec gestion d'erreur
            try {
              // Utiliser directement les métadonnées si disponibles
              const ecole_id = session.user.user_metadata?.ecole_id || session.user.user_metadata?.school_id;
              if (ecole_id) {
                console.log('[useUser] Utilisation de l\'ID de l\'école depuis les métadonnées:', ecole_id);
                userData.ecole_id = ecole_id;
              } else {
                // Essayer la méthode standard avec school_users
                const { data: schoolData, error: schoolError } = await supabase
                  .from('school_users')
                  .select('school_id')
                  .eq('user_id', session.user.id)
                  .eq('role', userData.role)
                  .single();
              
                console.log('[useUser] Résultat school_users:', { schoolData, schoolError });
              
                if (schoolError) {
                  console.error('[useUser] Erreur lors de la récupération de l\'ID de l\'école:', schoolError);
                } else if (schoolData) {
                  console.log('[useUser] ID de l\'école trouvé:', schoolData.school_id);
                  userData.ecole_id = schoolData.school_id;
                }
              }
            } catch (error) {
              console.error('[useUser] Exception lors de la récupération de l\'ID de l\'école:', error);
              // Ne pas propager l'erreur, continuer avec les autres données
            }
          } catch (error) {
            console.error('[useUser] Erreur lors de la récupération de l\'ID de l\'école:', error);
            // Ne pas propager l'erreur, continuer avec les autres données
          }
        }

        // Récupérer les détails utilisateur supplémentaires
        console.log('[useUser] Récupération des détails utilisateur');
        try {
          const { data: userDetails, error: userDetailsError } = await supabase
            .from('user_details')
            .select(`
              *,
              classes:class_id (class_level)
            `)
            .eq('user_id', session.user.id)
            .maybeSingle();
          
          console.log('[useUser] Résultat user_details:', { userDetails, userDetailsError });
          
          if (userDetailsError) {
            console.error('[useUser] Erreur lors de la récupération des détails utilisateur:', userDetailsError);
          }
          
          if (userDetails) {
            console.log('[useUser] Détails utilisateur trouvés');
            userData.surname_child = userDetails.surname_child;
            // Priorité à la classe liée, sinon utiliser class_level pour la compatibilité
            userData.class_level = userDetails.classes ? userDetails.classes.class_level : userDetails.class_level;
            userData.class_id = userDetails.class_id; // Ajouter class_id aux données utilisateur
            userData.pin = userDetails.pin;
          } else {
            console.log('[useUser] Aucun détail utilisateur trouvé');
          }
        } catch (error) {
          console.error('[useUser] Exception lors de la récupération des détails utilisateur:', error);
          // Ne pas propager l'erreur, continuer avec les autres données
        }

        console.log('[useUser] Données utilisateur finales:', userData);
        setUser(userData);
      } catch (error: any) {
        console.error('[useUser] Erreur lors de la récupération des données utilisateur:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();

    // Écouter les changements d'authentification
    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      console.log('[useUser] Changement d\'état d\'authentification, événement:', _event);
      fetchUser();
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [supabase]);

  return { user, loading, error }
  */
}
