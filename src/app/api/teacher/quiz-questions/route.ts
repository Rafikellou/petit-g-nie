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
    const { questions, masterQuestionId, quizId, classId } = await request.json();
    
    if (!questions || !Array.isArray(questions) || questions.length === 0) {
      return NextResponse.json({ error: 'Données manquantes ou invalides' }, { status: 400 });
    }
    
    // Préparer les données pour l'insertion
    const questionsToInsert = questions.map((question, index) => ({
      teacher_id: user.id,
      class_id: classId,
      master_question_id: masterQuestionId,
      quiz_id: quizId,
      content: question,
      order_index: index
    }));
    
    // Insérer les questions dans la base de données
    const { data, error } = await supabase
      .from('question_activite_teacher')
      .insert(questionsToInsert)
      .select();
    
    if (error) {
      console.error('Erreur lors de l\'enregistrement des questions:', error);
      return NextResponse.json({ error: 'Erreur lors de l\'enregistrement des questions' }, { status: 500 });
    }
    
    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('Erreur serveur:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const quizId = searchParams.get('quizId');
    
    if (!quizId) {
      return NextResponse.json({ error: 'ID du quiz manquant' }, { status: 400 });
    }
    
    const supabase = createRouteHandlerClient({ cookies });
    
    // Vérifier l'authentification
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });
    }
    
    // Récupérer les questions du quiz
    const { data, error } = await supabase
      .from('question_activite_teacher')
      .select('*')
      .eq('quiz_id', quizId)
      .order('order_index', { ascending: true });
    
    if (error) {
      console.error('Erreur lors de la récupération des questions:', error);
      return NextResponse.json({ error: 'Erreur lors de la récupération des questions' }, { status: 500 });
    }
    
    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('Erreur serveur:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const questionId = searchParams.get('questionId');
    
    if (!questionId) {
      return NextResponse.json({ error: 'ID de la question manquant' }, { status: 400 });
    }
    
    const supabase = createRouteHandlerClient({ cookies });
    
    // Vérifier l'authentification
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });
    }
    
    // Supprimer la question
    const { error } = await supabase
      .from('question_activite_teacher')
      .delete()
      .eq('id', questionId)
      .eq('teacher_id', user.id);
    
    if (error) {
      console.error('Erreur lors de la suppression de la question:', error);
      return NextResponse.json({ error: 'Erreur lors de la suppression de la question' }, { status: 500 });
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Erreur serveur:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
