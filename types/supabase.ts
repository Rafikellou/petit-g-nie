export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          created_at: string
          email: string
          role: 'parent' | 'child'
          full_name: string
        }
        Insert: {
          id?: string
          created_at?: string
          email: string
          role: 'parent' | 'child'
          full_name: string
        }
        Update: {
          id?: string
          created_at?: string
          email?: string
          role?: 'parent' | 'child'
          full_name?: string
        }
      }
      profiles: {
        Row: {
          id: string
          user_id: string
          academic_level: string
          created_at: string
          updated_at: string
          difficulty_settings: Json
        }
        Insert: {
          id?: string
          user_id: string
          academic_level: string
          created_at?: string
          updated_at?: string
          difficulty_settings?: Json
        }
        Update: {
          id?: string
          user_id?: string
          academic_level?: string
          created_at?: string
          updated_at?: string
          difficulty_settings?: Json
        }
      }
      questions: {
        Row: {
          id: string
          category_id: string
          question_text: string
          answers: Json
          correct_answer: string
          academic_level: string
          difficulty: number
          created_at: string
        }
        Insert: {
          id?: string
          category_id: string
          question_text: string
          answers: Json
          correct_answer: string
          academic_level: string
          difficulty: number
          created_at?: string
        }
        Update: {
          id?: string
          category_id?: string
          question_text?: string
          answers?: Json
          correct_answer?: string
          academic_level?: string
          difficulty?: number
          created_at?: string
        }
      }
      categories: {
        Row: {
          id: string
          name: string
          parent_id: string | null
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          parent_id?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          parent_id?: string | null
          created_at?: string
        }
      }
      audiobooks: {
        Row: {
          id: string
          title: string
          description: string
          audio_url: string
          duration: number
          age_range: string[]
          created_at: string
        }
        Insert: {
          id?: string
          title: string
          description: string
          audio_url: string
          duration: number
          age_range: string[]
          created_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string
          audio_url?: string
          duration?: number
          age_range?: string[]
          created_at?: string
        }
      }
      quiz_results: {
        Row: {
          id: string
          user_id: string
          quiz_date: string
          score: number
          questions: Json
          category_id: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          quiz_date: string
          score: number
          questions: Json
          category_id: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          quiz_date?: string
          score?: number
          questions?: Json
          category_id?: string
          created_at?: string
        }
      }
      audiobook_progress: {
        Row: {
          id: string
          user_id: string
          audiobook_id: string
          progress: number
          last_position: number
          completed: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          audiobook_id: string
          progress: number
          last_position: number
          completed: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          audiobook_id?: string
          progress?: number
          last_position?: number
          completed?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      parent_settings: {
        Row: {
          id: string
          user_id: string
          pin: string
          subscription_status: 'free' | 'premium'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          pin: string
          subscription_status?: 'free' | 'premium'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          pin?: string
          subscription_status?: 'free' | 'premium'
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}
