import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { UserRole, Profile, School, Child, UserWithProfiles } from '@/types/auth'

const supabase = createClientComponentClient()

interface SignUpData {
  email: string;
  password: string;
  family_name: string;
  surname: string;
  role: UserRole;
  school_id?: string;
  invitation_code?: string;
}

export const authService = {
  // Inscription
  signUp: async (data: SignUpData) => {
    try {
      // Vérifier le code d'invitation pour les enseignants
      if (data.role === 'teacher' && data.invitation_code) {
        const { data: school, error: schoolError } = await supabase
          .from('schools')
          .select('id')
          .eq('invitation_code', data.invitation_code)
          .single()

        if (schoolError || !school) {
          throw new Error('Code d\'invitation invalide')
        }
        data.school_id = school.id
      }

      // Créer l'utilisateur
      const { data: auth, error: signUpError } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
      })

      if (signUpError) throw signUpError
      if (!auth.user) throw new Error('Erreur lors de la création du compte')

      // Créer le profil
      const { error: profileError } = await supabase
        .from('profiles')
        .insert([{
          user_id: auth.user.id,
          family_name: data.family_name,
          surname: data.surname,
          role: data.role,
          school_id: data.school_id,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }])

      if (profileError) throw profileError

      return { user: auth.user, error: null }
    } catch (error: any) {
      console.error('Error in signUp:', error)
      return { user: null, error }
    }
  },

  // Connexion par email
  signIn: async (email: string, password: string) => {
    try {
      const { data: { user }, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (signInError) throw signInError
      if (!user) throw new Error('Utilisateur non trouvé')

      // Récupérer les profils de l'utilisateur
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user.id)

      if (profilesError) throw profilesError

      // Si l'utilisateur n'a qu'un seul profil, le définir comme actif
      if (profiles && profiles.length === 1) {
        await authService.setActiveProfile(user.id, profiles[0].id)
      }

      return { 
        user: { 
          ...user, 
          profiles,
          active_profile: user.user_metadata?.active_profile 
            ? profiles?.find(p => p.id === user.user_metadata.active_profile)
            : profiles?.[0]
        }, 
        error: null 
      }
    } catch (error: any) {
      console.error('Error in signIn:', error)
      return { user: null, error }
    }
  },

  // Déconnexion
  signOut: async () => {
    try {
      const { error } = await supabase.auth.signOut()
      if (error) throw error
      return { error: null }
    } catch (error: any) {
      console.error('Error in signOut:', error)
      return { error }
    }
  },

  // Récupérer les données de l'utilisateur avec ses profils
  getCurrentUser: async () => {
    try {
      const { data: { user }, error: userError } = await supabase.auth.getUser()

      if (userError) throw userError
      if (!user) return { user: null, error: null }

      // Récupérer les profils de l'utilisateur
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user.id)

      if (profilesError) throw profilesError

      return { 
        user: { 
          ...user, 
          profiles: profiles || [],
          active_profile: user.user_metadata?.active_profile 
            ? profiles?.find(p => p.id === user.user_metadata.active_profile)
            : profiles?.[0]
        }, 
        error: null 
      }
    } catch (error: any) {
      console.error('Error in getCurrentUser:', error)
      return { user: null, error }
    }
  },

  // Mettre à jour le profil actif
  setActiveProfile: async (userId: string, profileId: string) => {
    try {
      const { error } = await supabase.auth.updateUser({
        data: { active_profile: profileId }
      })

      if (error) throw error
      return { error: null }
    } catch (error: any) {
      console.error('Error in setActiveProfile:', error)
      return { error }
    }
  },
}
