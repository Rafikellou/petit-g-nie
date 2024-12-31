export type ClassLevel = 'CE1' | 'CE2' | 'CM1' | 'CM2'
export type Subject = 'Français' | 'Mathématiques'
export type Period = 'Début d\'année' | 'Milieu d\'année' | 'Fin d\'année'
export type QuestionType = 'short' | 'long'

export interface QuestionOptions {
  A: string
  B: string
  C: string
  D: string
}

export interface Question {
  id?: string
  class: ClassLevel
  subject: Subject
  topic: string
  period: Period
  specificity: string
  type: QuestionType
  question: string
  options: QuestionOptions
  correctAnswer: 'A' | 'B' | 'C' | 'D'
}

export type QuestionResponse = {
  questionId: string
  selectedAnswer: string
  isCorrect: boolean
  timestamp: Date
}

export type QuizProgress = {
  userId: string
  totalQuestions: number
  correctAnswers: number
  lastQuestionTimestamp: Date
  subject: Subject
  topic: string
}
