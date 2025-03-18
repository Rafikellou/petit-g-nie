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
}

export interface Child {
  id: string;
  name: string;
  class_id?: string;
  class_name?: string;
  school_id?: string;
}

export interface User {
  id: string;
  email: string;
  role: UserRole;
  surname_child?: string;
  class_level?: string;
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
