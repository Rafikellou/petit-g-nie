import { UserRole, User, School } from '@/types/auth'
import { supabase } from './supabase'

interface SignUpData {
  email: string;
  password: string;
  role: UserRole;
  school_id?: string;
  invitation_code?: string;
  full_name?: string;
  child_name?: string;
  class_level?: string;
  school_data?: {
    nom_ecole: string;
    code_postal?: string;
    ville?: string;
    adresse?: string;
    telephone?: string;
    email?: string;
  };
  secret_key?: string;
}

export const authService = {
  signUp: async (data: SignUpData) => {
    try {
      // Vérifier le code secret pour les super admins
      if (data.role === 'super_admin') {
        // Vérifier que la clé secrète est correcte (à remplacer par une vérification plus sécurisée)
        const SUPER_ADMIN_SECRET_KEY = process.env.NEXT_PUBLIC_SUPER_ADMIN_SECRET_KEY || 'default_secret_key';
        if (data.secret_key !== SUPER_ADMIN_SECRET_KEY) {
          throw new Error('Clé secrète invalide pour la création d\'un compte super administrateur');
        }
      }

      // Vérifier le code d'invitation pour les enseignants et admins
      if ((data.role === 'teacher' || data.role === 'admin') && data.invitation_code) {
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

      // Si c'est un admin qui crée une nouvelle école
      let newSchoolId: string | undefined = undefined;
      if (data.role === 'admin' && data.school_data) {
        const { data: newSchool, error: schoolCreateError } = await supabase
          .from('schools')
          .insert({
            name: data.school_data.nom_ecole,
            postal_code: data.school_data.code_postal,
            city: data.school_data.ville,
            address: data.school_data.adresse,
            phone: data.school_data.telephone,
            email: data.school_data.email,
            invitation_code: Math.random().toString(36).substring(2, 8).toUpperCase() // Génère un code d'invitation aléatoire
          })
          .select('id')
          .single()

        if (schoolCreateError) {
          throw new Error('Erreur lors de la création de l\'école: ' + schoolCreateError.message)
        }

        if (newSchool) {
          newSchoolId = newSchool.id
          data.school_id = newSchoolId
        }
      }

      // Créer l'utilisateur
      const { data: auth, error: signUpError } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            role: data.role,
            school_id: data.school_id,
            full_name: data.full_name
          }
        }
      })

      if (signUpError) throw signUpError
      if (!auth.user) throw new Error('Erreur lors de la création du compte')

      // Créer l'entrée dans la table users
      const { error: userInsertError } = await supabase
        .from('users')
        .insert({
          id: auth.user.id,
          email: data.email,
          role: data.role,
          full_name: data.full_name || ''
        })

      if (userInsertError) {
        console.error('Erreur lors de la création de l\'utilisateur dans la table users:', userInsertError)
      }

      // Si c'est un enseignant ou admin, créer l'entrée dans school_users
      if ((data.role === 'teacher' || data.role === 'admin') && data.school_id) {
        const { error: schoolUserError } = await supabase
          .from('school_users')
          .insert({
            school_id: data.school_id,
            user_id: auth.user.id,
            role: data.role
          })

        if (schoolUserError) {
          console.error('Erreur lors de la création de la relation école-utilisateur:', schoolUserError)
        }
      }

      // Si c'est un parent et qu'il a fourni un nom d'enfant et une classe
      if (data.role === 'parent' && data.child_name && data.class_level) {
        // Créer l'enfant
        const { data: child, error: childError } = await supabase
          .from('children')
          .insert({
            full_name: data.child_name,
            class_level: data.class_level
          })
          .select('id')
          .single()

        if (childError) {
          console.error('Erreur lors de la création de l\'enfant:', childError)
        } else if (child) {
          // Créer la relation parent-enfant
          const { error: relationError } = await supabase
            .from('parent_children')
            .insert({
              parent_id: auth.user.id,
              child_id: child.id
            })

          if (relationError) {
            console.error('Erreur lors de la création de la relation parent-enfant:', relationError)
          }
        }
      }

      // Créer l'entrée dans user_details pour le PIN (si c'est un parent)
      if (data.role === 'parent') {
        const { error: detailsError } = await supabase
          .from('user_details')
          .insert({
            user_id: auth.user.id,
            surname_child: data.child_name || '',
            class_level: data.class_level || '',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          })

        if (detailsError) {
          console.error('Erreur lors de la création des détails utilisateur:', detailsError)
        }
      }

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

      // Récupérer le rôle de l'utilisateur depuis la base de données
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('role, full_name')
        .eq('id', user.id)
        .single()

      if (userError) {
        console.error('Erreur lors de la récupération du rôle:', userError)
        throw new Error('Erreur lors de la récupération des informations utilisateur')
      }

      const role = userData.role as UserRole
      let userInfo: Partial<User> = {
        id: user.id,
        email: user.email!,
        role: role
      }

      // Récupérer les détails spécifiques en fonction du rôle
      if (role === 'parent') {
        // Récupérer les détails de l'utilisateur pour le PIN
        const { data: userDetails, error: detailsError } = await supabase
          .from('user_details')
          .select('pin, surname_child, class_level')
          .eq('user_id', user.id)
          .single()

        if (detailsError && detailsError.code !== 'PGRST116') {
          console.error('Erreur lors de la récupération des détails:', detailsError)
        }

        if (userDetails) {
          userInfo = {
            ...userInfo,
            pin: userDetails.pin,
            surname_child: userDetails.surname_child,
            class_level: userDetails.class_level
          }
        }

        // Récupérer les enfants du parent
        const { data: children, error: childrenError } = await supabase
          .from('parent_children')
          .select(`
            child_id,
            children (
              id,
              full_name,
              class_level,
              classes (
                id,
                name,
                school_id
              )
            )
          `)
          .eq('parent_id', user.id)

        if (childrenError) {
          console.error('Erreur lors de la récupération des enfants:', childrenError)
        } else if (children && children.length > 0) {
          userInfo.children = children.map((item: any) => ({
            id: item.children.id,
            name: item.children.full_name,
            class_level: item.children.class_level,
            class_name: item.children.classes?.name,
            school_id: item.children.classes?.school_id
          }))
        }
      } else if (role === 'teacher' || role === 'admin' || role === 'super_admin') {
        // Pour les super_admin, récupérer toutes les écoles
        if (role === 'super_admin') {
          const { data: allSchools, error: schoolsError } = await supabase
            .from('schools')
            .select('*')
            .order('name', { ascending: true })

          if (schoolsError) {
            console.error('Erreur lors de la récupération des écoles:', schoolsError)
          } else if (allSchools) {
            userInfo.schools = allSchools.map(school => ({
              id: school.id,
              nom_ecole: school.name,
              adresse: school.address,
              ville: school.city,
              code_postal: school.postal_code,
              email: school.email,
              telephone: school.phone,
              invitation_code: school.invitation_code
            }))
          }
        } else {
          // Pour les enseignants et administrateurs, récupérer les écoles associées
          const { data: schoolUsers, error: schoolError } = await supabase
            .from('school_users')
            .select(`
              school_id,
              schools (
                id,
                name,
                address,
                city,
                postal_code,
                email,
                phone,
                invitation_code
              )
            `)
            .eq('user_id', user.id)

          if (schoolError) {
            console.error('Erreur lors de la récupération des écoles:', schoolError)
          } else if (schoolUsers && schoolUsers.length > 0) {
            userInfo.schools = schoolUsers.map((item: any) => ({
              id: item.schools.id,
              nom_ecole: item.schools.name,
              adresse: item.schools.address,
              ville: item.schools.city,
              code_postal: item.schools.postal_code,
              email: item.schools.email,
              telephone: item.schools.phone,
              invitation_code: item.schools.invitation_code
            }))
          }
        }

        // Si c'est un enseignant, récupérer ses classes
        if (role === 'teacher') {
          const { data: classTeachers, error: classError } = await supabase
            .from('class_teachers')
            .select(`
              class_id,
              classes (
                id,
                name,
                school_id
              )
            `)
            .eq('user_id', user.id)

          if (classError) {
            console.error('Erreur lors de la récupération des classes:', classError)
          } else if (classTeachers && classTeachers.length > 0) {
            userInfo.classes = classTeachers.map((item: any) => ({
              id: item.classes.id,
              name: item.classes.name,
              school_id: item.classes.school_id
            }))
          }
        }
      }

      return {
        user: userInfo as User,
        error: null
      }
    } catch (error: any) {
      console.error('Error in getCurrentUser:', error)
      return { user: null, error }
    }
  },
}
