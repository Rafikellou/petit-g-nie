-- Migration pour renommer la colonne level en class_level
-- Créé le: 2025-04-21

-- Renommer la colonne level en class_level
ALTER TABLE public.classes RENAME COLUMN level TO class_level;

-- Mettre à jour les index si nécessaire
DROP INDEX IF EXISTS classes_level_idx;
CREATE INDEX IF NOT EXISTS classes_class_level_idx ON public.classes(class_level);
