import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { UserRole, User, School } from '@/types/auth'

const supabase = createClientComponentClient()

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

  getCurrentUser: async () => {
    try {
      const { data: { user }, error } = await supabase.auth.getUser()
      if (error) throw error
      if (!user) return { user: null, error: null }

      // Récupérer les informations de l'école si nécessaire
      if (user.user_metadata.ecole_id) {
        const { data: ecole } = await supabase
          .from('ecoles')
          .select('id, nom_ecole')
          .eq('id', user.user_metadata.ecole_id)
          .single()

        return {
          user: {
            id: user.id,
            email: user.email!,
            role: user.user_metadata.role,
            ecole_id: user.user_metadata.ecole_id,
            ecole: ecole || undefined,
            surname_child: user.user_metadata.surname_child,
            class: user.user_metadata.class
          } as User,
          error: null
        }
      }

      return {
        user: {
          id: user.id,
          email: user.email!,
          role: user.user_metadata.role,
        } as User,
        error: null
      }
    } catch (error: any) {
      console.error('Error in getCurrentUser:', error)
      return { user: null, error }
    }
  }
}
