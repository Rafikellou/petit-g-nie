import { supabase } from './supabase'

export interface Question {
  id: string
  category_id: string
  question_text: string
  answers: string[]
  correct_answer: string
  academic_level: string
  difficulty: number
}

export interface Audiobook {
  id: string;
  title: string;
  description: string;
  audio_url: string;
  duration: string;
  age_range: string[];
  coverImage: string;
  chapters: number;
  progress?: number;
}

export const quizService = {
  async getQuizQuestions(academicLevel: string, categoryId?: string, limit = 10): Promise<Question[]> {
    let query = supabase
      .from('questions')
      .select('*')
      .eq('academic_level', academicLevel)
      .limit(limit)
    
    if (categoryId) {
      query = query.eq('category_id', categoryId)
    }

    const { data, error } = await query
    if (error) throw error
    
    return data as Question[]
  },

  async saveQuizResult(userId: string, score: number, questions: Question[], categoryId: string) {
    const { error } = await supabase
      .from('quiz_results')
      .insert({
        user_id: userId,
        score,
        questions,
        category_id: categoryId
      })
    
    if (error) throw error
  }
}

export const audiobookService = {
  async getAudiobooks(ageRange?: string[]): Promise<Audiobook[]> {
    let query = supabase
      .from('audiobooks')
      .select('*')
    
    if (ageRange && ageRange.length > 0) {
      query = query.contains('age_range', ageRange)
    }

    const { data, error } = await query
    if (error) throw error
    
    return data as Audiobook[]
  },

  async saveProgress(userId: string, audiobookId: string, progress: number, lastPosition: number) {
    const { error } = await supabase
      .from('audiobook_progress')
      .upsert({
        user_id: userId,
        audiobook_id: audiobookId,
        progress,
        last_position: lastPosition,
        completed: progress >= 100
      })
    
    if (error) throw error
  }
}

export const parentService = {
  async verifyPin(userId: string, pin: string): Promise<boolean> {
    const { data, error } = await supabase
      .from('parent_settings')
      .select('pin')
      .eq('user_id', userId)
      .single()
    
    if (error) throw error
    return data.pin === pin
  },

  async getChildProgress(childId: string) {
    const { data: quizResults, error: quizError } = await supabase
      .from('quiz_results')
      .select('*')
      .eq('user_id', childId)
      .order('created_at', { ascending: false })
    
    if (quizError) throw quizError

    const { data: audiobookProgress, error: progressError } = await supabase
      .from('audiobook_progress')
      .select('*, audiobooks(*)')
      .eq('user_id', childId)
    
    if (progressError) throw progressError

    return {
      quizResults,
      audiobookProgress
    }
  }
}
