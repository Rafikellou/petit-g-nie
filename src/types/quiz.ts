export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation?: string;
}

export interface Quiz {
  id: string;
  title: string;
  description: string;
  questions: QuizQuestion[];
  difficulty: 'facile' | 'moyen' | 'avancé';
  timeLimit?: number; // en minutes
  passingScore: number;
  characterId: string;
  storyId: string;
}

export interface QuizProgress {
  quizId: string;
  startedAt: string;
  completedAt?: string;
  score?: number;
  answers: {
    questionId: string;
    selectedAnswer: number;
    isCorrect: boolean;
    timeSpent: number;
  }[];
}

export interface QuizStats {
  totalAttempts: number;
  averageScore: number;
  bestScore: number;
  averageTimePerQuestion: number;
  mostMissedQuestions: string[];
}
