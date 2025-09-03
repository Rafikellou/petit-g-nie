-- Création de la table pour les questions modèles des enseignants
CREATE TABLE IF NOT EXISTS question_modele_activite_teacher (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  teacher_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  class_id UUID REFERENCES classes(id) ON DELETE SET NULL,
  content JSONB NOT NULL, -- Contient la question, options, réponse correcte et explication
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Création de la table pour les questions générées pour les quiz
CREATE TABLE IF NOT EXISTS question_activite_teacher (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  teacher_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  class_id UUID REFERENCES classes(id) ON DELETE SET NULL,
  master_question_id UUID REFERENCES question_modele_activite_teacher(id) ON DELETE SET NULL,
  quiz_id UUID REFERENCES activities(id) ON DELETE CASCADE,
  content JSONB NOT NULL, -- Contient la question, options, réponse correcte et explication
  order_index INTEGER NOT NULL DEFAULT 0, -- Pour ordonner les questions dans un quiz
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Création de la table pour les notifications des élèves
CREATE TABLE IF NOT EXISTS student_notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  class_id UUID REFERENCES classes(id) ON DELETE CASCADE,
  activity_id UUID REFERENCES activities(id) ON DELETE CASCADE,
  type TEXT NOT NULL, -- Type de notification (ex: 'new_quiz', 'reminder', etc.)
  message TEXT NOT NULL,
  is_read BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Ajout de RLS (Row Level Security) pour les tables
ALTER TABLE question_modele_activite_teacher ENABLE ROW LEVEL SECURITY;
ALTER TABLE question_activite_teacher ENABLE ROW LEVEL SECURITY;
ALTER TABLE student_notifications ENABLE ROW LEVEL SECURITY;

-- Politiques pour question_modele_activite_teacher
CREATE POLICY "Les enseignants peuvent voir leurs propres questions modèles"
  ON question_modele_activite_teacher
  FOR SELECT
  USING (auth.uid() = teacher_id);

CREATE POLICY "Les enseignants peuvent créer leurs propres questions modèles"
  ON question_modele_activite_teacher
  FOR INSERT
  WITH CHECK (auth.uid() = teacher_id);

CREATE POLICY "Les enseignants peuvent mettre à jour leurs propres questions modèles"
  ON question_modele_activite_teacher
  FOR UPDATE
  USING (auth.uid() = teacher_id);

CREATE POLICY "Les enseignants peuvent supprimer leurs propres questions modèles"
  ON question_modele_activite_teacher
  FOR DELETE
  USING (auth.uid() = teacher_id);

-- Politiques pour question_activite_teacher
CREATE POLICY "Les enseignants peuvent voir leurs propres questions d'activité"
  ON question_activite_teacher
  FOR SELECT
  USING (auth.uid() = teacher_id);

CREATE POLICY "Les élèves peuvent voir les questions des activités de leur classe"
  ON question_activite_teacher
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM student_classes sc
      JOIN classes c ON sc.class_id = c.id
      WHERE sc.student_id = auth.uid() AND c.id = question_activite_teacher.class_id
    )
  );

CREATE POLICY "Les enseignants peuvent créer leurs propres questions d'activité"
  ON question_activite_teacher
  FOR INSERT
  WITH CHECK (auth.uid() = teacher_id);

CREATE POLICY "Les enseignants peuvent mettre à jour leurs propres questions d'activité"
  ON question_activite_teacher
  FOR UPDATE
  USING (auth.uid() = teacher_id);

CREATE POLICY "Les enseignants peuvent supprimer leurs propres questions d'activité"
  ON question_activite_teacher
  FOR DELETE
  USING (auth.uid() = teacher_id);

-- Politiques pour student_notifications
CREATE POLICY "Les élèves peuvent voir leurs propres notifications"
  ON student_notifications
  FOR SELECT
  USING (auth.uid() = student_id);

CREATE POLICY "Les enseignants peuvent créer des notifications pour leurs élèves"
  ON student_notifications
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM classes
      WHERE id = student_notifications.class_id AND teacher_id = auth.uid()
    )
  );

CREATE POLICY "Les élèves peuvent marquer leurs notifications comme lues"
  ON student_notifications
  FOR UPDATE
  USING (auth.uid() = student_id)
  WITH CHECK (
    -- Seul le champ is_read peut être modifié
    (OLD.student_id = NEW.student_id) AND
    (OLD.class_id = NEW.class_id) AND
    (OLD.activity_id = NEW.activity_id) AND
    (OLD.type = NEW.type) AND
    (OLD.message = NEW.message) AND
    (OLD.created_at = NEW.created_at)
  );
