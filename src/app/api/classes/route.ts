import { NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

export async function GET() {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    
    // Vérifier si l'utilisateur est authentifié
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      return NextResponse.json(
        { error: 'Non autorisé' },
        { status: 401 }
      );
    }
    
    // Récupérer toutes les classes avec leurs écoles associées
    const { data, error } = await supabase
      .from('classes')
      .select(`
        id,
        name,
        school_id,
        class_level,
        schools (
          name
        )
      `)
      .order('name', { ascending: true });
    
    if (error) {
      console.error('Erreur lors de la récupération des classes:', error);
      return NextResponse.json(
        { error: 'Erreur lors de la récupération des classes' },
        { status: 500 }
      );
    }
    
    return NextResponse.json({ data });
  } catch (error) {
    console.error('Erreur serveur:', error);
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    );
  }
}
