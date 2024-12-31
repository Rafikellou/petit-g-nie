export type UserRole = 'parent' | 'teacher' | 'admin' | 'super_admin';

export interface Permission {
  id: string;
  name: string;
  description: string;
}

export interface Role {
  id: UserRole;
  name: string;
  description: string;
  permissions: string[];
}

export const DEFAULT_PERMISSIONS: Permission[] = [
  {
    id: 'view_own_child',
    name: 'Voir son enfant',
    description: 'Permet de voir les performances de son propre enfant'
  },
  {
    id: 'view_class_performance',
    name: 'Voir la classe',
    description: 'Permet de voir les performances de toute la classe'
  },
  {
    id: 'manage_class',
    name: 'Gérer la classe',
    description: 'Permet de gérer les élèves et les paramètres de la classe'
  },
  {
    id: 'share_performance',
    name: 'Partager les performances',
    description: 'Permet de partager les performances des élèves avec leurs parents'
  },
  {
    id: 'manage_teachers',
    name: 'Gérer les enseignants',
    description: 'Permet d\'ajouter, modifier ou supprimer des enseignants'
  },
  {
    id: 'view_school_data',
    name: 'Voir les données de l\'école',
    description: 'Permet de voir les données de toute l\'école'
  },
  {
    id: 'manage_school',
    name: 'Gérer l\'école',
    description: 'Permet de gérer tous les aspects de l\'école'
  }
];

export const DEFAULT_ROLES: Role[] = [
  {
    id: 'parent',
    name: 'Parent',
    description: 'Accès aux quiz et audio books. Accès conditionnel aux performances de l\'enfant.',
    permissions: ['view_own_child']
  },
  {
    id: 'teacher',
    name: 'Enseignant',
    description: 'Accès aux performances de sa classe avec possibilité de partage aux parents.',
    permissions: ['view_class_performance', 'manage_class', 'share_performance']
  },
  {
    id: 'admin',
    name: 'Administrateur',
    description: 'Accès complet aux données de l\'école et gestion des enseignants.',
    permissions: ['view_school_data', 'manage_school', 'manage_teachers']
  },
  {
    id: 'super_admin',
    name: 'Super Administrateur',
    description: 'Accès complet à toutes les fonctionnalités de la plateforme.',
    permissions: ['view_school_data', 'manage_school', 'manage_teachers', 'view_class_performance', 'manage_class', 'share_performance']
  }
];
