export type UserRole = 'super_admin' | 'admin' | 'teacher' | 'parent';

export interface School {
  id: string;
  nom_ecole: string;
  invitation_code?: string;
  code_postal?: string;
  ville?: string;
  adresse?: string;
  telephone?: string;
  email?: string;
}

export interface Class {
  id: string;
  name: string;
  school_id: string;
  class_level: string; // Niveau de classe (CP, CE1, CE2, CM1, CM2)
}

export interface Child {
  id: string;
  name: string;
  class_id?: string; // Référence à la classe
  class_name?: string;
  school_id?: string;
  // Note: class_level est accessible via la relation avec la classe
}

export interface User {
  id: string;
  email: string;
  role: UserRole;
  surname_child?: string;
  class_level?: string; // Deprecated: utilisez class_id et la relation avec classes
  class_id?: string; // Nouvelle propriété pour lier à une classe
  ecole_id?: string;
  ecole?: School;
  pin?: string;
  created_at?: string;
  updated_at?: string;
  // Nouvelles propriétés pour la structure hiérarchique
  schools?: School[];
  classes?: Class[];
  children?: Child[];
}
