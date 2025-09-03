import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    
    // Vérifier l'authentification
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });
    }
    
    // Vérifier que l'utilisateur est un enseignant
    const { data: teacher, error: teacherError } = await supabase
      .from('teachers')
      .select('id')
      .eq('user_id', user.id)
      .single();
    
    if (teacherError || !teacher) {
      return NextResponse.json({ error: 'Accès non autorisé' }, { status: 403 });
    }
    
    // Récupérer les données de la requête
    const { masterQuestion, classId } = await request.json();
    
    if (!masterQuestion || !classId) {
      return NextResponse.json({ error: 'Données manquantes' }, { status: 400 });
    }
    
    // Insérer la question modèle dans la base de données
    const { data, error } = await supabase
      .from('question_modele_activite_teacher')
      .insert({
        teacher_id: user.id,
        class_id: classId,
        content: masterQuestion
      })
      .select()
      .single();
    
    if (error) {
      console.error('Erreur lors de l\'enregistrement de la question modèle:', error);
      return NextResponse.json({ error: 'Erreur lors de l\'enregistrement de la question modèle' }, { status: 500 });
    }
    
    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('Erreur serveur:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}

export async function GET(request: Request) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    
    // Vérifier l'authentification
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });
    }
    
    // Récupérer les questions modèles de l'enseignant
    const { data, error } = await supabase
      .from('question_modele_activite_teacher')
      .select('*')
      .eq('teacher_id', user.id)
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Erreur lors de la récupération des questions modèles:', error);
      return NextResponse.json({ error: 'Erreur lors de la récupération des questions modèles' }, { status: 500 });
    }
    
    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('Erreur serveur:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
