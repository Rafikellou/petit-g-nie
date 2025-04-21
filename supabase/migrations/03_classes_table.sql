-- Migration pour la création de la table des classes
-- Créé le: 2025-03-18

-- Créer la table des classes si elle n'existe pas déjà
CREATE TABLE IF NOT EXISTS public.classes (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    name text NOT NULL,
    class_level text NOT NULL,
    school_id uuid NOT NULL REFERENCES public.schools(id) ON DELETE CASCADE,
    invitation_code text UNIQUE NOT NULL,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Ajouter un index sur school_id pour améliorer les performances des requêtes
CREATE INDEX IF NOT EXISTS classes_school_id_idx ON public.classes(school_id);

-- Ajouter un index sur invitation_code pour les recherches rapides
CREATE INDEX IF NOT EXISTS classes_invitation_code_idx ON public.classes(invitation_code);

-- Activer RLS (Row Level Security)
ALTER TABLE public.classes ENABLE ROW LEVEL SECURITY;

-- Politique pour les administrateurs (peuvent voir et modifier toutes les classes de leur école)
CREATE POLICY admin_classes_policy ON public.classes
    FOR ALL
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.school_users su
            WHERE su.school_id = classes.school_id
            AND su.user_id = auth.uid()
            AND su.role = 'admin'
        )
    );

-- Politique pour les enseignants (peuvent voir les classes auxquelles ils sont assignés)
CREATE POLICY teacher_classes_policy ON public.classes
    FOR SELECT
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.school_users su
            WHERE su.school_id = classes.school_id
            AND su.user_id = auth.uid()
            AND su.role = 'teacher'
        )
    );

-- Créer une table pour associer les enseignants aux classes
CREATE TABLE IF NOT EXISTS public.class_teachers (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    class_id uuid NOT NULL REFERENCES public.classes(id) ON DELETE CASCADE,
    user_id uuid NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(class_id, user_id)
);

-- Ajouter des index pour améliorer les performances
CREATE INDEX IF NOT EXISTS class_teachers_class_id_idx ON public.class_teachers(class_id);
CREATE INDEX IF NOT EXISTS class_teachers_user_id_idx ON public.class_teachers(user_id);

-- Activer RLS
ALTER TABLE public.class_teachers ENABLE ROW LEVEL SECURITY;

-- Politique pour les administrateurs
CREATE POLICY admin_class_teachers_policy ON public.class_teachers
    FOR ALL
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.classes c
            JOIN public.school_users su ON c.school_id = su.school_id
            WHERE c.id = class_teachers.class_id
            AND su.user_id = auth.uid()
            AND su.role = 'admin'
        )
    );

-- Politique pour les enseignants (peuvent voir leurs propres associations)
CREATE POLICY teacher_class_teachers_policy ON public.class_teachers
    FOR SELECT
    TO authenticated
    USING (
        user_id = auth.uid()
    );

-- Créer une table pour les élèves dans les classes
CREATE TABLE IF NOT EXISTS public.class_students (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    class_id uuid NOT NULL REFERENCES public.classes(id) ON DELETE CASCADE,
    user_id uuid NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(class_id, user_id)
);

-- Ajouter des index pour améliorer les performances
CREATE INDEX IF NOT EXISTS class_students_class_id_idx ON public.class_students(class_id);
CREATE INDEX IF NOT EXISTS class_students_user_id_idx ON public.class_students(user_id);

-- Activer RLS
ALTER TABLE public.class_students ENABLE ROW LEVEL SECURITY;

-- Politique pour les administrateurs
CREATE POLICY admin_class_students_policy ON public.class_students
    FOR ALL
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.classes c
            JOIN public.school_users su ON c.school_id = su.school_id
            WHERE c.id = class_students.class_id
            AND su.user_id = auth.uid()
            AND su.role = 'admin'
        )
    );

-- Politique pour les enseignants (peuvent voir les élèves de leurs classes)
CREATE POLICY teacher_class_students_policy ON public.class_students
    FOR ALL
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.class_teachers ct
            WHERE ct.class_id = class_students.class_id
            AND ct.user_id = auth.uid()
        )
    );

-- Politique pour les parents (peuvent voir uniquement leurs enfants)
CREATE POLICY parent_class_students_policy ON public.class_students
    FOR SELECT
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.parent_children pc
            WHERE pc.child_id = class_students.user_id
            AND pc.parent_id = auth.uid()
        )
    );

-- Créer une fonction pour mettre à jour le timestamp 'updated_at'
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Appliquer le trigger aux tables
CREATE TRIGGER update_classes_updated_at
BEFORE UPDATE ON public.classes
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_class_teachers_updated_at
BEFORE UPDATE ON public.class_teachers
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_class_students_updated_at
BEFORE UPDATE ON public.class_students
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();
