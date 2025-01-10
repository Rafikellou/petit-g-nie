export type UserRole = 'super_admin' | 'admin' | 'teacher' | 'parent';

export interface Profile {
  id: string;
  family_name: string;
  surname: string;
  role: UserRole;
  school_id?: string;
  pin_code?: string;
  created_at: string;
  updated_at: string;
}

export interface School {
  id: string;
  nom_ecole: string;
  code_postal: string;
  ville: string;
  invitation_code: string;
  created_at: string;
  updated_at: string;
  status?: 'active' | 'inactive';
}

export interface Child {
  id: string;
  family_name: string;
  surname: string;
  parent_id: string;
  school_id: string;
  class_id?: string;
  created_at: string;
  updated_at: string;
}

export interface UserWithProfiles {
  id: string;
  email: string;
  profiles: Profile[];
  active_profile?: Profile;
}
