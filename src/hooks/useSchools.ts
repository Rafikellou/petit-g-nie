import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

export interface School {
  id: string;
  nom_ecole: string;
}

export function useSchools() {
  const [schools, setSchools] = useState<School[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchSchools();
  }, []);

  const fetchSchools = async () => {
    try {
      console.log('Fetching schools...');
      const { data, error } = await supabase
        .from('ecoles')
        .select('id, nom_ecole')
        .order('nom_ecole');

      console.log('Schools data:', data);
      console.log('Schools error:', error);

      if (error) throw error;
      setSchools(data || []);
    } catch (error: any) {
      console.error('Error fetching schools:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return { schools, loading, error };
}
