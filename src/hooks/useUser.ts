import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { User as SupabaseUser } from '@supabase/supabase-js';
import { User } from '@/types/auth';

export function useUser() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchUserDetails = async (supabaseUser: SupabaseUser) => {
    try {
      const { data: userDetails, error } = await supabase
        .from('user_details')
        .select('*')
        .eq('user_id', supabaseUser.id)
        .single();

      if (error) throw error;

      setUser({
        id: supabaseUser.id,
        email: supabaseUser.email!,
        role: supabaseUser.user_metadata.role,
        surname_child: userDetails?.surname_child,
        class: userDetails?.class,
        ecole_id: userDetails?.ecole_id,
        pin: userDetails?.pin,
        created_at: userDetails?.created_at,
        updated_at: userDetails?.updated_at
      });
    } catch (error) {
      console.error('Error fetching user details:', error);
      setUser(null);
    }
  };

  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' || event === 'INITIAL_SESSION') {
        if (session?.user) {
          await fetchUserDetails(session.user);
        }
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
      }
      setLoading(false);
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  return { user, loading };
}
