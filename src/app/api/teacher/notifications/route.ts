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
    const { classId, activityId, message, type = 'new_quiz' } = await request.json();
    
    if (!classId || !activityId || !message) {
      return NextResponse.json({ error: 'Données manquantes' }, { status: 400 });
    }
    
    // Vérifier que la classe appartient à l'enseignant
    const { data: classData, error: classError } = await supabase
      .from('classes')
      .select('id')
      .eq('id', classId)
      .eq('teacher_id', user.id)
      .single();
    
    if (classError || !classData) {
      return NextResponse.json({ error: 'Classe non trouvée ou non autorisée' }, { status: 403 });
    }
    
    // Récupérer tous les élèves de la classe
    const { data: students, error: studentsError } = await supabase
      .from('student_classes')
      .select('student_id')
      .eq('class_id', classId);
    
    if (studentsError) {
      console.error('Erreur lors de la récupération des élèves:', studentsError);
      return NextResponse.json({ error: 'Erreur lors de la récupération des élèves' }, { status: 500 });
    }
    
    if (!students || students.length === 0) {
      return NextResponse.json({ message: 'Aucun élève dans cette classe' }, { status: 200 });
    }
    
    // Créer une notification pour chaque élève
    const notifications = students.map(student => ({
      student_id: student.student_id,
      class_id: classId,
      activity_id: activityId,
      type,
      message
    }));
    
    const { data, error } = await supabase
      .from('student_notifications')
      .insert(notifications);
    
    if (error) {
      console.error('Erreur lors de la création des notifications:', error);
      return NextResponse.json({ error: 'Erreur lors de la création des notifications' }, { status: 500 });
    }
    
    return NextResponse.json({ 
      success: true, 
      message: `${notifications.length} notifications envoyées aux élèves` 
    });
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
    
    // Récupérer les notifications de l'élève
    const { data, error } = await supabase
      .from('student_notifications')
      .select('*')
      .eq('student_id', user.id)
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Erreur lors de la récupération des notifications:', error);
      return NextResponse.json({ error: 'Erreur lors de la récupération des notifications' }, { status: 500 });
    }
    
    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('Erreur serveur:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    
    // Vérifier l'authentification
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });
    }
    
    // Récupérer les données de la requête
    const { notificationId } = await request.json();
    
    if (!notificationId) {
      return NextResponse.json({ error: 'ID de notification manquant' }, { status: 400 });
    }
    
    // Marquer la notification comme lue
    const { error } = await supabase
      .from('student_notifications')
      .update({ is_read: true })
      .eq('id', notificationId)
      .eq('student_id', user.id);
    
    if (error) {
      console.error('Erreur lors de la mise à jour de la notification:', error);
      return NextResponse.json({ error: 'Erreur lors de la mise à jour de la notification' }, { status: 500 });
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Erreur serveur:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
