import { StudentProgress } from '@/data/users';

export interface Teacher {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  class: {
    id: string;
    name: string;
    grade: string;
    students: {
      id: string;
      name: string;
      avatar?: string;
      progress: StudentProgress;
    }[];
  };
  subjects: string[];
  badges: {
    id: string;
    name: string;
    description: string;
    icon: string;
    unlockedAt: string;
  }[];
  stats: {
    totalLessonsCreated: number;
    averageClassProgress: number;
    activeStudents: number;
    quizCompletionRate: number;
  };
}
