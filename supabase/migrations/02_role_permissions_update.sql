-- Mise à jour du schéma pour la nouvelle architecture de rôles
-- Créé le: 2025-03-18

-- 1. Mettre à jour la table users pour supporter tous les rôles
ALTER TABLE public.users 
DROP CONSTRAINT IF EXISTS users_role_check;

ALTER TABLE public.users 
ADD CONSTRAINT users_role_check 
CHECK (role IN ('super_admin', 'admin', 'teacher', 'parent'));

-- 2. Créer une table pour les écoles
CREATE TABLE IF NOT EXISTS public.schools (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    name text NOT NULL,
    address text,
    postal_code text,
    city text,
    phone text,
    email text,
    invitation_code text UNIQUE,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Créer une table pour les classes
CREATE TABLE IF NOT EXISTS public.classes (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    school_id uuid REFERENCES public.schools(id) ON DELETE CASCADE NOT NULL,
    name text NOT NULL,
    academic_year text NOT NULL,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. Ajouter une table pour les relations école-utilisateur
CREATE TABLE IF NOT EXISTS public.school_users (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    school_id uuid REFERENCES public.schools(id) ON DELETE CASCADE NOT NULL,
    user_id uuid REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    role text NOT NULL CHECK (role IN ('admin', 'teacher')),
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(school_id, user_id)
);

-- 5. Ajouter une table pour les relations classe-enseignant
CREATE TABLE IF NOT EXISTS public.class_teachers (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    class_id uuid REFERENCES public.classes(id) ON DELETE CASCADE NOT NULL,
    user_id uuid REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(class_id, user_id)
);

-- 6. Ajouter une table pour les enfants (élèves)
CREATE TABLE IF NOT EXISTS public.children (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    full_name text NOT NULL,
    class_id uuid REFERENCES public.classes(id) ON DELETE SET NULL,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 7. Ajouter une table pour les relations parent-enfant
CREATE TABLE IF NOT EXISTS public.parent_children (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    parent_id uuid REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    child_id uuid REFERENCES public.children(id) ON DELETE CASCADE NOT NULL,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(parent_id, child_id)
);

-- 8. Ajouter des triggers pour mettre à jour les timestamps
CREATE TRIGGER handle_updated_at
    BEFORE UPDATE ON public.schools
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER handle_updated_at
    BEFORE UPDATE ON public.classes
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER handle_updated_at
    BEFORE UPDATE ON public.children
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

-- 9. Configurer les politiques RLS (Row Level Security)
ALTER TABLE public.schools ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.classes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.school_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.class_teachers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.children ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.parent_children ENABLE ROW LEVEL SECURITY;

-- 10. Politiques pour les écoles
-- Super Admin peut tout voir
CREATE POLICY "Super Admin peut voir toutes les écoles"
    ON public.schools FOR SELECT
    USING (auth.jwt() -> 'user_metadata' ->> 'role' = 'super_admin');

-- Admin peut voir son école
CREATE POLICY "Admin peut voir son école"
    ON public.schools FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.school_users
            WHERE school_users.school_id = schools.id
            AND school_users.user_id = auth.uid()
            AND school_users.role = 'admin'
        )
    );

-- Super Admin peut modifier toutes les écoles
CREATE POLICY "Super Admin peut modifier toutes les écoles"
    ON public.schools FOR UPDATE
    USING (auth.jwt() -> 'user_metadata' ->> 'role' = 'super_admin');

-- Admin peut modifier son école
CREATE POLICY "Admin peut modifier son école"
    ON public.schools FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM public.school_users
            WHERE school_users.school_id = schools.id
            AND school_users.user_id = auth.uid()
            AND school_users.role = 'admin'
        )
    );

-- Super Admin peut créer des écoles
CREATE POLICY "Super Admin peut créer des écoles"
    ON public.schools FOR INSERT
    WITH CHECK (auth.jwt() -> 'user_metadata' ->> 'role' = 'super_admin');

-- Super Admin peut supprimer des écoles
CREATE POLICY "Super Admin peut supprimer des écoles"
    ON public.schools FOR DELETE
    USING (auth.jwt() -> 'user_metadata' ->> 'role' = 'super_admin');

-- 11. Politiques pour les classes
-- Super Admin peut voir toutes les classes
CREATE POLICY "Super Admin peut voir toutes les classes"
    ON public.classes FOR SELECT
    USING (auth.jwt() -> 'user_metadata' ->> 'role' = 'super_admin');

-- Admin peut voir les classes de son école
CREATE POLICY "Admin peut voir les classes de son école"
    ON public.classes FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.school_users
            WHERE school_users.school_id = classes.school_id
            AND school_users.user_id = auth.uid()
            AND school_users.role = 'admin'
        )
    );

-- Enseignant peut voir ses classes
CREATE POLICY "Enseignant peut voir ses classes"
    ON public.classes FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.class_teachers
            WHERE class_teachers.class_id = classes.id
            AND class_teachers.user_id = auth.uid()
        )
    );

-- Parent peut voir la classe de son enfant
CREATE POLICY "Parent peut voir la classe de son enfant"
    ON public.classes FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.parent_children
            JOIN public.children ON parent_children.child_id = children.id
            WHERE parent_children.parent_id = auth.uid()
            AND children.class_id = classes.id
        )
    );

-- Admin peut créer/modifier/supprimer des classes dans son école
CREATE POLICY "Admin peut créer des classes dans son école"
    ON public.classes FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.school_users
            WHERE school_users.school_id = classes.school_id
            AND school_users.user_id = auth.uid()
            AND school_users.role = 'admin'
        )
    );

CREATE POLICY "Admin peut modifier des classes dans son école"
    ON public.classes FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM public.school_users
            WHERE school_users.school_id = classes.school_id
            AND school_users.user_id = auth.uid()
            AND school_users.role = 'admin'
        )
    );

CREATE POLICY "Admin peut supprimer des classes dans son école"
    ON public.classes FOR DELETE
    USING (
        EXISTS (
            SELECT 1 FROM public.school_users
            WHERE school_users.school_id = classes.school_id
            AND school_users.user_id = auth.uid()
            AND school_users.role = 'admin'
        )
    );

-- 12. Politiques pour les relations école-utilisateur
-- Super Admin peut voir toutes les relations
CREATE POLICY "Super Admin peut voir toutes les relations école-utilisateur"
    ON public.school_users FOR SELECT
    USING (auth.jwt() -> 'user_metadata' ->> 'role' = 'super_admin');

-- Admin peut voir les utilisateurs de son école
CREATE POLICY "Admin peut voir les utilisateurs de son école"
    ON public.school_users FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.school_users AS su
            WHERE su.school_id = school_users.school_id
            AND su.user_id = auth.uid()
            AND su.role = 'admin'
        )
    );

-- Super Admin peut gérer toutes les relations
CREATE POLICY "Super Admin peut gérer toutes les relations école-utilisateur"
    ON public.school_users FOR ALL
    USING (auth.jwt() -> 'user_metadata' ->> 'role' = 'super_admin');

-- Admin peut ajouter des enseignants à son école
CREATE POLICY "Admin peut ajouter des enseignants à son école"
    ON public.school_users FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.school_users AS su
            WHERE su.school_id = school_users.school_id
            AND su.user_id = auth.uid()
            AND su.role = 'admin'
        )
        AND school_users.role = 'teacher'
    );

-- 13. Politiques pour les relations classe-enseignant
-- Super Admin peut voir toutes les relations
CREATE POLICY "Super Admin peut voir toutes les relations classe-enseignant"
    ON public.class_teachers FOR SELECT
    USING (auth.jwt() -> 'user_metadata' ->> 'role' = 'super_admin');

-- Admin peut voir les enseignants des classes de son école
CREATE POLICY "Admin peut voir les enseignants des classes de son école"
    ON public.class_teachers FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.classes
            JOIN public.school_users ON classes.school_id = school_users.school_id
            WHERE classes.id = class_teachers.class_id
            AND school_users.user_id = auth.uid()
            AND school_users.role = 'admin'
        )
    );

-- Enseignant peut voir ses propres affectations
CREATE POLICY "Enseignant peut voir ses propres affectations"
    ON public.class_teachers FOR SELECT
    USING (class_teachers.user_id = auth.uid());

-- Admin peut gérer les affectations des enseignants
CREATE POLICY "Admin peut gérer les affectations des enseignants"
    ON public.class_teachers FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM public.classes
            JOIN public.school_users ON classes.school_id = school_users.school_id
            WHERE classes.id = class_teachers.class_id
            AND school_users.user_id = auth.uid()
            AND school_users.role = 'admin'
        )
    );

-- 14. Politiques pour les enfants
-- Super Admin peut voir tous les enfants
CREATE POLICY "Super Admin peut voir tous les enfants"
    ON public.children FOR SELECT
    USING (auth.jwt() -> 'user_metadata' ->> 'role' = 'super_admin');

-- Admin peut voir les enfants des classes de son école
CREATE POLICY "Admin peut voir les enfants des classes de son école"
    ON public.children FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.classes
            JOIN public.school_users ON classes.school_id = school_users.school_id
            WHERE children.class_id = classes.id
            AND school_users.user_id = auth.uid()
            AND school_users.role = 'admin'
        )
    );

-- Enseignant peut voir les enfants de ses classes
CREATE POLICY "Enseignant peut voir les enfants de ses classes"
    ON public.children FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.class_teachers
            WHERE class_teachers.class_id = children.class_id
            AND class_teachers.user_id = auth.uid()
        )
    );

-- Parent peut voir ses propres enfants
CREATE POLICY "Parent peut voir ses propres enfants"
    ON public.children FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.parent_children
            WHERE parent_children.child_id = children.id
            AND parent_children.parent_id = auth.uid()
        )
    );

-- Parent peut créer un enfant
CREATE POLICY "Parent peut créer un enfant"
    ON public.children FOR INSERT
    WITH CHECK (auth.jwt() -> 'user_metadata' ->> 'role' = 'parent');

-- Parent peut mettre à jour ses propres enfants
CREATE POLICY "Parent peut mettre à jour ses propres enfants"
    ON public.children FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM public.parent_children
            WHERE parent_children.child_id = children.id
            AND parent_children.parent_id = auth.uid()
        )
    );

-- 15. Politiques pour les relations parent-enfant
-- Super Admin peut voir toutes les relations
CREATE POLICY "Super Admin peut voir toutes les relations parent-enfant"
    ON public.parent_children FOR SELECT
    USING (auth.jwt() -> 'user_metadata' ->> 'role' = 'super_admin');

-- Admin peut voir les relations parent-enfant de son école
CREATE POLICY "Admin peut voir les relations parent-enfant de son école"
    ON public.parent_children FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.children
            JOIN public.classes ON children.class_id = classes.id
            JOIN public.school_users ON classes.school_id = school_users.school_id
            WHERE parent_children.child_id = children.id
            AND school_users.user_id = auth.uid()
            AND school_users.role = 'admin'
        )
    );

-- Enseignant peut voir les relations parent-enfant de ses classes
CREATE POLICY "Enseignant peut voir les relations parent-enfant de ses classes"
    ON public.parent_children FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.children
            JOIN public.class_teachers ON children.class_id = class_teachers.class_id
            WHERE parent_children.child_id = children.id
            AND class_teachers.user_id = auth.uid()
        )
    );

-- Parent peut voir ses propres relations
CREATE POLICY "Parent peut voir ses propres relations parent-enfant"
    ON public.parent_children FOR SELECT
    USING (parent_children.parent_id = auth.uid());

-- Parent peut créer une relation avec un enfant
CREATE POLICY "Parent peut créer une relation avec un enfant"
    ON public.parent_children FOR INSERT
    WITH CHECK (
        parent_children.parent_id = auth.uid()
        AND auth.jwt() -> 'user_metadata' ->> 'role' = 'parent'
    );

-- 16. Fonction pour migrer les données existantes (à exécuter après la création des tables)
CREATE OR REPLACE FUNCTION migrate_existing_data()
RETURNS void AS $$
DECLARE
    default_school_id uuid;
    default_class_id uuid;
BEGIN
    -- Créer une école par défaut pour la migration
    INSERT INTO public.schools (name, invitation_code)
    VALUES ('École par défaut', 'MIGRATION2025')
    RETURNING id INTO default_school_id;
    
    -- Créer une classe par défaut
    INSERT INTO public.classes (school_id, name, academic_year)
    VALUES (default_school_id, 'Classe par défaut', '2024-2025')
    RETURNING id INTO default_class_id;
    
    -- Migrer les utilisateurs existants
    -- Pour les parents
    INSERT INTO public.children (full_name, class_id)
    SELECT u.full_name, default_class_id
    FROM public.users u
    WHERE u.role = 'parent';
    
    -- Créer les relations parent-enfant
    INSERT INTO public.parent_children (parent_id, child_id)
    SELECT u.id, c.id
    FROM public.users u
    JOIN public.children c ON u.full_name = c.full_name
    WHERE u.role = 'parent';
    
    -- Pour les enseignants (si existants)
    INSERT INTO public.school_users (school_id, user_id, role)
    SELECT default_school_id, u.id, 'teacher'
    FROM public.users u
    WHERE u.role = 'teacher';
    
    -- Assigner les enseignants à la classe par défaut
    INSERT INTO public.class_teachers (class_id, user_id)
    SELECT default_class_id, u.id
    FROM public.users u
    WHERE u.role = 'teacher';
    
    -- Pour les admins (si existants)
    INSERT INTO public.school_users (school_id, user_id, role)
    SELECT default_school_id, u.id, 'admin'
    FROM public.users u
    WHERE u.role = 'admin';
END;
$$ LANGUAGE plpgsql;

-- Ne pas exécuter automatiquement la migration, cela sera fait manuellement
-- SELECT migrate_existing_data();
