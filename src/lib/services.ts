import { supabase } from './supabase'
import { PostgrestFilterBuilder, PostgrestBuilder, PostgrestResponse, PostgrestSingleResponse } from '@supabase/postgrest-js';

export interface Question {
  id: string
  category_id: string
  question_text: string
  answers: string[]
  correct_answer: string
  class_level: string
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

export interface ServiceError extends Error {
  code: string;
  details?: any;
}

const TIMEOUT_MS = 10000; // 10 seconds timeout

const withTimeout = async <T>(
  promise: PostgrestFilterBuilder<any, any, T[]> | PostgrestBuilder<T>,
  timeoutMs: number = TIMEOUT_MS
): Promise<PostgrestResponse<T> | PostgrestSingleResponse<T>> => {
  const timeoutPromise = new Promise<never>((_, reject) =>
    setTimeout(() => reject(new Error('Request timed out')), timeoutMs)
  );

  try {
    const result = await Promise.race([promise, timeoutPromise]);
    return result;
  } catch (error) {
    if (error.message === 'Request timed out') {
      throw new Error('La requête a pris trop de temps à répondre');
    }
    throw error;
  }
};

const handleError = (error: any): never => {
  const serviceError: ServiceError = {
    name: 'ServiceError',
    message: error.message || 'Une erreur inattendue est survenue',
    code: error.code || 'UNKNOWN_ERROR',
    details: error.details || error
  };
  throw serviceError;
};

export const quizService = {
  async getQuizQuestions(classLevel: string, categoryId?: string, limit = 10): Promise<Question[]> {
    try {
      let query = supabase
        .from('questions')
        .select('*')
        .eq('class_level', classLevel)
        .limit(limit);
      
      if (categoryId) {
        query = query.eq('category_id', categoryId);
      }

      const response = await withTimeout<Question>(query);
      
      if (response.error) throw response.error;
      if (!response.data) throw new Error('Aucune donnée retournée par la base de données');
      
      return Array.isArray(response.data) ? response.data : [response.data];
    } catch (error) {
      handleError(error);
    }
  },

  async saveQuizResult(userId: string, score: number, questions: Question[], categoryId: string) {
    try {
      const response = await withTimeout<any>(
        supabase
          .from('quiz_results')
          .insert({
            user_id: userId,
            score,
            questions,
            category_id: categoryId,
            created_at: new Date().toISOString()
          })
      );

      if (response.error) throw response.error;
    } catch (error) {
      handleError(error);
    }
  }
};

export const audiobookService = {
  async getAudiobooks(ageRange?: string[]): Promise<Audiobook[]> {
    try {
      let query = supabase.from('audiobooks').select('*');
      
      if (ageRange && ageRange.length > 0) {
        query = query.contains('age_range', ageRange);
      }

      const response = await withTimeout<Audiobook>(query);
      
      if (response.error) throw response.error;
      if (!response.data) throw new Error('Aucun livre audio trouvé');
      
      return Array.isArray(response.data) ? response.data : [response.data];
    } catch (error) {
      handleError(error);
    }
  },

  async saveProgress(userId: string, audiobookId: string, progress: number, lastPosition: number) {
    try {
      const response = await withTimeout<any>(
        supabase
          .from('audiobook_progress')
          .upsert({
            user_id: userId,
            audiobook_id: audiobookId,
            progress,
            last_position: lastPosition,
            updated_at: new Date().toISOString()
          })
      );

      if (response.error) throw response.error;
    } catch (error) {
      handleError(error);
    }
  }
};

export const parentService = {
  async verifyPin(userId: string, pin: string): Promise<boolean> {
    try {
      type UserDetails = { pin: string };
      const response = await withTimeout<UserDetails>(
        supabase
          .from('user_details')
          .select('pin')
          .eq('user_id', userId)
          .single()
          .throwOnError()
      ) as PostgrestSingleResponse<UserDetails>;

      if (!response.data) return false;
      return response.data.pin === pin;
    } catch (error) {
      if (error.code === 'PGRST116') return false; // No rows returned
      handleError(error);
    }
  },

  async getChildProgress(childId: string) {
    try {
      type ProgressRecord = {
        quiz_results: any[];
        audiobook_progress: any[];
        achievements: any[];
      };

      const response = await withTimeout<ProgressRecord>(
        supabase
          .from('user_progress')
          .select(`
            *,
            quiz_results (*),
            audiobook_progress (*),
            achievements (*)
          `)
          .eq('user_id', childId)
          .single()
          .throwOnError()
      ) as PostgrestSingleResponse<ProgressRecord>;

      if (!response.data) {
        throw new Error('Aucune donnée de progression trouvée pour l\'enfant');
      }

      return response.data;
    } catch (error) {
      if (error.code === 'PGRST116') {
        return {
          quiz_results: [],
          audiobook_progress: [],
          achievements: []
        };
      }
      handleError(error);
    }
  }
};
