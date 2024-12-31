export interface Student {
  id: string;
  name: string;
  age: number;
  class: string;
  avatarUrl?: string;
  parentId: string;
  teacherId: string;
}

export interface Parent {
  id: string;
  name: string;
  email: string;
  studentIds: string[];
}

export interface Teacher {
  id: string;
  name: string;
  email: string;
  school: string;
  class: string;
  studentIds: string[];
}

export interface StudentProgress {
  studentId: string;
  storiesProgress: {
    [characterId: string]: {
      [storyId: string]: {
        completed: boolean;
        timeSpent: number;
        lastAccessed: string;
      };
    };
  };
  quizResults: {
    [quizId: string]: {
      score: number;
      completedAt: string;
      attempts: number;
    };
  };
  totalTimeSpent: number;
  lastActive: string;
  level: number;
  xp: number;
  badges: string[];
}

// Données de test
export const mockStudents: Record<string, Student> = {
  'student1': {
    id: 'student1',
    name: 'Lucas Martin',
    age: 8,
    class: 'CE2',
    parentId: 'parent1',
    teacherId: 'teacher1'
  },
  'student2': {
    id: 'student2',
    name: 'Emma Bernard',
    age: 9,
    class: 'CM1',
    parentId: 'parent2',
    teacherId: 'teacher1'
  },
  'student3': {
    id: 'student3',
    name: 'Noah Dubois',
    age: 8,
    class: 'CE2',
    parentId: 'parent3',
    teacherId: 'teacher1'
  },
  'student4': {
    id: 'student4',
    name: 'Chloé Petit',
    age: 9,
    class: 'CM1',
    parentId: 'parent4',
    teacherId: 'teacher1'
  },
  'student5': {
    id: 'student5',
    name: 'Louis Moreau',
    age: 8,
    class: 'CE2',
    parentId: 'parent5',
    teacherId: 'teacher1'
  },
  'student6': {
    id: 'student6',
    name: 'Léa Robert',
    age: 9,
    class: 'CM1',
    parentId: 'parent6',
    teacherId: 'teacher1'
  },
  'student7': {
    id: 'student7',
    name: 'Gabriel Simon',
    age: 8,
    class: 'CE2',
    parentId: 'parent7',
    teacherId: 'teacher1'
  },
  'student8': {
    id: 'student8',
    name: 'Alice Laurent',
    age: 9,
    class: 'CM1',
    parentId: 'parent8',
    teacherId: 'teacher1'
  },
  'student9': {
    id: 'student9',
    name: 'Arthur Michel',
    age: 8,
    class: 'CE2',
    parentId: 'parent9',
    teacherId: 'teacher1'
  },
  'student10': {
    id: 'student10',
    name: 'Inès Lefebvre',
    age: 9,
    class: 'CM1',
    parentId: 'parent10',
    teacherId: 'teacher1'
  },
  'student11': {
    id: 'student11',
    name: 'Jules Leroy',
    age: 8,
    class: 'CE2',
    parentId: 'parent11',
    teacherId: 'teacher1'
  },
  'student12': {
    id: 'student12',
    name: 'Manon Roux',
    age: 9,
    class: 'CM1',
    parentId: 'parent12',
    teacherId: 'teacher1'
  },
  'student13': {
    id: 'student13',
    name: 'Adam David',
    age: 8,
    class: 'CE2',
    parentId: 'parent13',
    teacherId: 'teacher1'
  },
  'student14': {
    id: 'student14',
    name: 'Sarah Bertrand',
    age: 9,
    class: 'CM1',
    parentId: 'parent14',
    teacherId: 'teacher1'
  },
  'student15': {
    id: 'student15',
    name: 'Thomas Morel',
    age: 8,
    class: 'CE2',
    parentId: 'parent15',
    teacherId: 'teacher1'
  },
  'student16': {
    id: 'student16',
    name: 'Camille Fournier',
    age: 9,
    class: 'CM1',
    parentId: 'parent16',
    teacherId: 'teacher1'
  },
  'student17': {
    id: 'student17',
    name: 'Hugo Girard',
    age: 8,
    class: 'CE2',
    parentId: 'parent17',
    teacherId: 'teacher1'
  },
  'student18': {
    id: 'student18',
    name: 'Zoé Bonnet',
    age: 9,
    class: 'CM1',
    parentId: 'parent18',
    teacherId: 'teacher1'
  },
  'student19': {
    id: 'student19',
    name: 'Raphaël Dupont',
    age: 8,
    class: 'CE2',
    parentId: 'parent19',
    teacherId: 'teacher1'
  },
  'student20': {
    id: 'student20',
    name: 'Louise Lambert',
    age: 9,
    class: 'CM1',
    parentId: 'parent20',
    teacherId: 'teacher1'
  },
  'student21': {
    id: 'student21',
    name: 'Paul Fontaine',
    age: 8,
    class: 'CE2',
    parentId: 'parent21',
    teacherId: 'teacher1'
  },
  'student22': {
    id: 'student22',
    name: 'Eva Rousseau',
    age: 9,
    class: 'CM1',
    parentId: 'parent22',
    teacherId: 'teacher1'
  },
  'student23': {
    id: 'student23',
    name: 'Maxime Vincent',
    age: 8,
    class: 'CE2',
    parentId: 'parent23',
    teacherId: 'teacher1'
  },
  'student24': {
    id: 'student24',
    name: 'Jade Muller',
    age: 9,
    class: 'CM1',
    parentId: 'parent24',
    teacherId: 'teacher1'
  },
  'student25': {
    id: 'student25',
    name: 'Nathan Faure',
    age: 8,
    class: 'CE2',
    parentId: 'parent25',
    teacherId: 'teacher1'
  }
};

export const mockParents: Record<string, Parent> = {
  'parent1': {
    id: 'parent1',
    name: 'Marie Martin',
    email: 'marie.martin@example.com',
    studentIds: ['student1']
  },
  'parent2': {
    id: 'parent2',
    name: 'Pierre Bernard',
    email: 'pierre.bernard@example.com',
    studentIds: ['student2']
  },
  'parent3': {
    id: 'parent3',
    name: 'Sophie Dubois',
    email: 'sophie.dubois@example.com',
    studentIds: ['student3']
  },
  'parent4': {
    id: 'parent4',
    name: 'François Petit',
    email: 'francois.petit@example.com',
    studentIds: ['student4']
  },
  'parent5': {
    id: 'parent5',
    name: 'Isabelle Moreau',
    email: 'isabelle.moreau@example.com',
    studentIds: ['student5']
  },
  'parent6': {
    id: 'parent6',
    name: 'Laurent Robert',
    email: 'laurent.robert@example.com',
    studentIds: ['student6']
  },
  'parent7': {
    id: 'parent7',
    name: 'Catherine Simon',
    email: 'catherine.simon@example.com',
    studentIds: ['student7']
  },
  'parent8': {
    id: 'parent8',
    name: 'Philippe Laurent',
    email: 'philippe.laurent@example.com',
    studentIds: ['student8']
  },
  'parent9': {
    id: 'parent9',
    name: 'Aurélie Michel',
    email: 'aurelie.michel@example.com',
    studentIds: ['student9']
  },
  'parent10': {
    id: 'parent10',
    name: 'Christophe Lefebvre',
    email: 'christophe.lefebvre@example.com',
    studentIds: ['student10']
  },
  'parent11': {
    id: 'parent11',
    name: 'Valérie Leroy',
    email: 'valerie.leroy@example.com',
    studentIds: ['student11']
  },
  'parent12': {
    id: 'parent12',
    name: 'Sébastien Roux',
    email: 'sebastien.roux@example.com',
    studentIds: ['student12']
  },
  'parent13': {
    id: 'parent13',
    name: 'Caroline David',
    email: 'caroline.david@example.com',
    studentIds: ['student13']
  },
  'parent14': {
    id: 'parent14',
    name: 'Xavier Bertrand',
    email: 'xavier.bertrand@example.com',
    studentIds: ['student14']
  },
  'parent15': {
    id: 'parent15',
    name: 'Nathalie Morel',
    email: 'nathalie.morel@example.com',
    studentIds: ['student15']
  },
  'parent16': {
    id: 'parent16',
    name: 'Olivier Fournier',
    email: 'olivier.fournier@example.com',
    studentIds: ['student16']
  },
  'parent17': {
    id: 'parent17',
    name: 'Mélanie Girard',
    email: 'melanie.girard@example.com',
    studentIds: ['student17']
  },
  'parent18': {
    id: 'parent18',
    name: 'Romain Bonnet',
    email: 'romain.bonnet@example.com',
    studentIds: ['student18']
  },
  'parent19': {
    id: 'parent19',
    name: 'Julie Dupont',
    email: 'julie.dupont@example.com',
    studentIds: ['student19']
  },
  'parent20': {
    id: 'parent20',
    name: 'Éric Lambert',
    email: 'eric.lambert@example.com',
    studentIds: ['student20']
  },
  'parent21': {
    id: 'parent21',
    name: 'Sandrine Fontaine',
    email: 'sandrine.fontaine@example.com',
    studentIds: ['student21']
  },
  'parent22': {
    id: 'parent22',
    name: 'Thierry Rousseau',
    email: 'thierry.rousseau@example.com',
    studentIds: ['student22']
  },
  'parent23': {
    id: 'parent23',
    name: 'Laurence Vincent',
    email: 'laurence.vincent@example.com',
    studentIds: ['student23']
  },
  'parent24': {
    id: 'parent24',
    name: 'Gilles Muller',
    email: 'gilles.muller@example.com',
    studentIds: ['student24']
  },
  'parent25': {
    id: 'parent25',
    name: 'Cécile Faure',
    email: 'cecile.faure@example.com',
    studentIds: ['student25']
  }
};

export const mockTeachers: Record<string, Teacher> = {
  'teacher1': {
    id: 'teacher1',
    name: 'Mme Dubois',
    email: 'dubois@ecole.fr',
    school: 'École La Salle',
    class: 'CE2-CM1',
    studentIds: ['student1', 'student2', 'student3', 'student4', 'student5', 'student6', 'student7', 'student8', 'student9', 'student10', 'student11', 'student12', 'student13', 'student14', 'student15', 'student16', 'student17', 'student18', 'student19', 'student20', 'student21', 'student22', 'student23', 'student24', 'student25']
  }
};

export const mockProgress: Record<string, StudentProgress> = {
  'student1': {
    studentId: 'student1',
    storiesProgress: {
      'anna': {
        'tresor-foret': {
          completed: true,
          timeSpent: 450,
          lastAccessed: '2024-12-07T14:30:00Z'
        }
      }
    },
    quizResults: {
      'anna-tresor-foret': {
        score: 85,
        completedAt: '2024-12-07T14:45:00Z',
        attempts: 1
      }
    },
    totalTimeSpent: 450,
    lastActive: '2024-12-07T14:45:00Z',
    level: 2,
    xp: 150,
    badges: ['first_story', 'quiz_genius']
  }
};
