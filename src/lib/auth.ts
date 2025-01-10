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
      console.log('Tentative de connexion pour:', email)

      if (!email || !password) {
        throw new Error('Email et mot de passe requis')
      }

      // Vérifier si l'utilisateur existe déjà
      const { data: { user: existingUser }, error: getUserError } = await supabase.auth.getUser()
      
      if (existingUser) {
        console.log('Utilisateur déjà connecté, déconnexion...')
        await supabase.auth.signOut()
      }

      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (signInError) {
        console.error('Erreur de connexion:', signInError)
        return { user: null, error: signInError }
      }

      if (!data.user) {
        console.error('Utilisateur non trouvé après connexion')
        return { user: null, error: new Error('Utilisateur non trouvé') }
      }

      console.log('Utilisateur connecté:', data.user.id)

      // Récupérer les profils de l'utilisateur avec plus d'informations
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('*, schools(*)')
        .eq('user_id', data.user.id)

      if (profilesError) {
        console.error('Erreur lors de la récupération des profils:', profilesError)
        return { user: null, error: profilesError }
      }

      if (!profiles || profiles.length === 0) {
        console.error('Aucun profil trouvé pour l\'utilisateur:', data.user.id)
        return { user: null, error: new Error('Profil utilisateur non trouvé') }
      }

      console.log('Profils récupérés:', profiles.length)

      // Si l'utilisateur n'a qu'un seul profil, le définir comme actif
      if (profiles.length === 1) {
        try {
          await authService.setActiveProfile(data.user.id, profiles[0].id)
          console.log('Profil actif défini:', profiles[0].id)
        } catch (setProfileError) {
          console.error('Erreur lors de la définition du profil actif:', setProfileError)
          // On continue même si la définition du profil actif échoue
        }
      }

      const user = { 
        ...data.user, 
        profiles,
        active_profile: data.user.user_metadata?.active_profile 
          ? profiles.find(p => p.id === data.user.user_metadata.active_profile)
          : profiles[0]
      }

      console.log('Connexion réussie avec profil actif:', user.active_profile?.id)
      return { user, error: null }
    } catch (error: any) {
      console.error('Erreur inattendue lors de la connexion:', error)
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

      if (userError) {
        console.error('Erreur lors de la récupération de l\'utilisateur:', userError)
        throw userError
      }

      if (!user) {
        console.log('Aucun utilisateur connecté')
        return { user: null, error: null }
      }

      // Récupérer les profils de l'utilisateur avec plus d'informations
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('*, schools(*)')
        .eq('user_id', user.id)

      if (profilesError) {
        console.error('Erreur lors de la récupération des profils:', profilesError)
        throw profilesError
      }

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
      console.error('Erreur dans getCurrentUser:', error)
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
