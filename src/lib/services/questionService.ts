import { createClient } from '@supabase/supabase-js'
import { Question, Subject, ClassLevel, Period } from '@/types/questions'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export const questionService = {
  async getQuestions({
    classLevel,
    subject,
    topic,
    period,
    limit = 10
  }: {
    classLevel?: ClassLevel
    subject?: Subject
    topic?: string
    period?: Period
    limit?: number
  }) {
    let query = supabase
      .from('questions')
      .select('*')

    if (classLevel) {
      query = query.eq('class_level', classLevel)
    }
    if (subject) {
      query = query.eq('subject', subject)
    }
    if (topic) {
      query = query.eq('topic', topic)
    }
    if (period) {
      query = query.eq('period', period)
    }

    const { data, error } = await query.limit(limit)

    if (error) {
      console.error('Error fetching questions:', error)
      throw error
    }

    return data as Question[]
  },

  async getRandomQuestions({
    classLevel,
    subject,
    topic,
    period,
    limit = 10
  }: {
    classLevel?: ClassLevel
    subject?: Subject
    topic?: string
    period?: Period
    limit?: number
  }) {
    let query = supabase
      .from('questions')
      .select('*')

    if (classLevel) {
      query = query.eq('class_level', classLevel)
    }
    if (subject) {
      query = query.eq('subject', subject)
    }
    if (topic) {
      query = query.eq('topic', topic)
    }
    if (period) {
      query = query.eq('period', period)
    }

    // Toujours limiter à exactement 10 questions
    const { data, error } = await query
      .limit(10)
      .order('RANDOM()')

    if (error) {
      console.error('Error fetching random questions:', error)
      throw error
    }

    return data as Question[]
  },

  async saveQuestionResponse({
    userId,
    questionId,
    selectedAnswer,
    isCorrect
  }: {
    userId: string
    questionId: string
    selectedAnswer: string
    isCorrect: boolean
  }) {
    const { error } = await supabase
      .from('question_responses')
      .insert({
        user_id: userId,
        question_id: questionId,
        selected_answer: selectedAnswer,
        is_correct: isCorrect,
        timestamp: new Date().toISOString()
      })

    if (error) {
      console.error('Error saving question response:', error)
      throw error
    }
  },

  async getUserProgress(userId: string) {
    const { data, error } = await supabase
      .from('quiz_progress')
      .select('*')
      .eq('user_id', userId)
      .single()

    if (error && error.code !== 'PGRST116') { // PGRST116 is "not found"
      console.error('Error fetching user progress:', error)
      throw error
    }

    return data
  }
}
