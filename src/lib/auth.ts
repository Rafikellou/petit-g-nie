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
      const { data: auth, error } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            family_name: data.family_name,
            surname: data.surname,
            role: data.role
          }
        }
      })

      if (error) throw error

      if (auth.user) {
        // Créer le profil
        const { error: profileError } = await supabase
          .from('profiles')
          .insert({
            id: auth.user.id,
            family_name: data.family_name,
            surname: data.surname,
            role: data.role,
            school_id: data.school_id,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          })

        if (profileError) throw profileError
      }

      return { user: auth.user, error: null }
    } catch (error: any) {
      return { user: null, error: error.message }
    }
  },

  // Connexion
  signIn: async (email: string, password: string) => {
    try {
      const { data: { user }, error } = await supabase.auth.signInWithPassword({
        email,
        password
      })

      if (error) throw error

      // Récupérer tous les profils de l'utilisateur
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)

      if (profilesError) throw profilesError

      // Récupérer le profil actif s'il existe
      const active_profile = user.user_metadata?.active_profile
        ? profiles?.find(p => p.id === user.user_metadata.active_profile)
        : profiles?.[0]

      return { 
        user: {
          ...user,
          profiles: profiles || [],
          active_profile
        } as UserWithProfiles, 
        error: null 
      }
    } catch (error: any) {
      return { user: null, error: error.message }
    }
  },

  // Créer une école (admin uniquement)
  createSchool: async (schoolData: { nom_ecole: string; code_postal: string; ville: string; }) => {
    try {
      const invitationCode = Math.random().toString(36).substring(2, 15)
      
      const { data: school, error } = await supabase
        .from('schools')
        .insert({
          nom_ecole: schoolData.nom_ecole,
          code_postal: schoolData.code_postal,
          ville: schoolData.ville,
          invitation_code: invitationCode,
          status: 'active',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .select()
        .single()

      if (error) throw error

      return { school, error: null }
    } catch (error: any) {
      return { school: null, error: error.message }
    }
  },

  // Ajouter un enfant (parent uniquement)
  addChild: async (parentId: string, childData: Omit<Child, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data: child, error } = await supabase
        .from('children')
        .insert({
          ...childData,
          parent_id: parentId,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .select()
        .single()

      if (error) throw error

      return { child, error: null }
    } catch (error: any) {
      return { child: null, error: error.message }
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
      return { error: error.message }
    }
  },

  // Déconnexion
  signOut: async () => {
    return await supabase.auth.signOut()
  },

  // Récupérer les données de l'utilisateur avec ses profils
  getCurrentUser: async () => {
    try {
      const { data: { user }, error } = await supabase.auth.getUser()
      if (error) throw error

      if (user) {
        const { data: profiles, error: profilesError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)

        if (profilesError) throw profilesError

        // Récupérer le profil actif s'il existe
        const active_profile = user.user_metadata?.active_profile
          ? profiles?.find(p => p.id === user.user_metadata.active_profile)
          : profiles?.[0]

        return { 
          user: {
            ...user,
            profiles: profiles || [],
            active_profile
          } as UserWithProfiles, 
          error: null 
        }
      }

      return { user: null, error: null }
    } catch (error: any) {
      return { user: null, error: error.message }
    }
  }
}
