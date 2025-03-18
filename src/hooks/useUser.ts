import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { User } from '@/types/auth'

export function useUser() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function getUser() {
      try {
        const { data: { session }, error: sessionError } = await supabase.auth.getSession()
        if (sessionError) throw sessionError

        if (!session?.user) {
          setUser(null)
          return
        }

        // Récupérer les détails de l'utilisateur depuis user_details
        const { data: userDetails, error: detailsError } = await supabase
          .from('user_details')
          .select('surname_child, class_level')
          .eq('user_id', session.user.id)
          .single()

        if (detailsError) {
          console.error('Erreur lors de la récupération des détails:', detailsError)
        }

        setUser({
          id: session.user.id,
          email: session.user.email!,
          role: session.user.user_metadata?.role,
          ecole_id: session.user.user_metadata?.ecole_id,
          surname_child: userDetails?.surname_child,
          class_level: userDetails?.class_level,
          created_at: session.user.created_at,
          updated_at: session.user.updated_at,
        })
      } catch (error) {
        console.error('Error in getUser:', error)
        setUser(null)
      } finally {
        setLoading(false)
      }
    }

    getUser()

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        getUser()
      } else {
        setUser(null)
      }
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  return { user, loading }
}
