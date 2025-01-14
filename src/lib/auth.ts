import { UserRole, User, School } from '@/types/auth'
import { supabase } from './supabase'

interface SignUpData {
  email: string;
  password: string;
  role: UserRole;
  ecole_id?: string;
  invitation_code?: string;
}

export const authService = {
  signUp: async (data: SignUpData) => {
    try {
      // Vérifier le code d'invitation pour les enseignants
      if (data.role === 'teacher' && data.invitation_code) {
        const { data: ecole, error: ecoleError } = await supabase
          .from('ecoles')
          .select('id')
          .eq('invitation_code', data.invitation_code)
          .single()

        if (ecoleError || !ecole) {
          throw new Error('Code d\'invitation invalide')
        }
        data.ecole_id = ecole.id
      }

      // Créer l'utilisateur
      const { data: auth, error: signUpError } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            role: data.role,
            ecole_id: data.ecole_id
          }
        }
      })

      if (signUpError) throw signUpError
      if (!auth.user) throw new Error('Erreur lors de la création du compte')

      return { user: auth.user, error: null }
    } catch (error: any) {
      console.error('Error in signUp:', error)
      return { user: null, error }
    }
  },

  signIn: async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) throw error

      return { user: data.user, error: null }
    } catch (error: any) {
      console.error('Error in signIn:', error)
      return { user: null, error }
    }
  },

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

  resetPassword: async (email: string) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset-password`,
      })
      if (error) throw error
      return { error: null }
    } catch (error: any) {
      console.error('Error in resetPassword:', error)
      return { error }
    }
  },

  getCurrentUser: async () => {
    try {
      const { data: { user }, error } = await supabase.auth.getUser()
      if (error) throw error
      if (!user) return { user: null, error: null }

      // Récupérer les détails de l'utilisateur
      const { data: userDetails, error: detailsError } = await supabase
        .from('user_details')
        .select('surname_child, class')
        .eq('user_id', user.id)
        .single()

      if (detailsError) {
        console.error('Erreur lors de la récupération des détails:', detailsError)
      }

      // Récupérer les informations de l'école si nécessaire
      let ecole
      if (user.user_metadata.ecole_id) {
        const { data: ecoleData } = await supabase
          .from('ecoles')
          .select('id, nom_ecole')
          .eq('id', user.user_metadata.ecole_id)
          .single()
        ecole = ecoleData
      }

      return {
        user: {
          id: user.id,
          email: user.email!,
          role: user.user_metadata.role,
          ecole_id: user.user_metadata.ecole_id,
          ecole: ecole || undefined,
          surname_child: userDetails?.surname_child,
          class: userDetails?.class
        } as User,
        error: null
      }
    } catch (error: any) {
      console.error('Error in getCurrentUser:', error)
      return { user: null, error }
    }
  },
}
