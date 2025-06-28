import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database types
export interface Database {
  public: {
    Tables: {
      exam_tokens: {
        Row: {
          id: string;
          token: string;
          exam_type: 'hiragana' | 'katakana' | 'vocabulary' | 'grammar' | 'kanji';
          difficulty: string;
          exam_category: string;
          created_at: string;
          used: boolean;
          used_at: string | null;
        };
        Insert: {
          id?: string;
          token: string;
          exam_type: 'hiragana' | 'katakana' | 'vocabulary' | 'grammar' | 'kanji';
          difficulty?: string;
          exam_category?: string;
          created_at?: string;
          used?: boolean;
          used_at?: string | null;
        };
        Update: {
          id?: string;
          token?: string;
          exam_type?: 'hiragana' | 'katakana' | 'vocabulary' | 'grammar' | 'kanji';
          difficulty?: string;
          exam_category?: string;
          created_at?: string;
          used?: boolean;
          used_at?: string | null;
        };
      };
      students: {
        Row: {
          id: string;
          name: string;
          token: string;
          exam_type: 'hiragana' | 'katakana' | 'vocabulary' | 'grammar' | 'kanji';
          exam_category: string;
          difficulty: string;
          start_time: string;
          end_time: string | null;
          status: 'active' | 'completed' | 'disconnected';
          time_remaining: number;
          current_question: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          token: string;
          exam_type: 'hiragana' | 'katakana' | 'vocabulary' | 'grammar' | 'kanji';
          exam_category?: string;
          difficulty?: string;
          start_time?: string;
          end_time?: string | null;
          status?: 'active' | 'completed' | 'disconnected';
          time_remaining?: number;
          current_question?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          token?: string;
          exam_type?: 'hiragana' | 'katakana' | 'vocabulary' | 'grammar' | 'kanji';
          exam_category?: string;
          difficulty?: string;
          start_time?: string;
          end_time?: string | null;
          status?: 'active' | 'completed' | 'disconnected';
          time_remaining?: number;
          current_question?: number;
          created_at?: string;
        };
      };
      questions: {
        Row: {
          id: string;
          question_id: string;
          type: 'hiragana' | 'katakana' | 'vocabulary' | 'grammar' | 'kanji';
          category: string;
          character: string;
          question: string;
          options: string[];
          correct_answer: number;
          difficulty: string;
          chapter: string;
          is_custom: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          question_id: string;
          type: 'hiragana' | 'katakana' | 'vocabulary' | 'grammar' | 'kanji';
          category: string;
          character: string;
          question: string;
          options: string[];
          correct_answer: number;
          difficulty?: string;
          chapter?: string;
          is_custom?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          question_id?: string;
          type?: 'hiragana' | 'katakana' | 'vocabulary' | 'grammar' | 'kanji';
          category?: string;
          character?: string;
          question?: string;
          options?: string[];
          correct_answer?: number;
          difficulty?: string;
          chapter?: string;
          is_custom?: boolean;
          created_at?: string;
        };
      };
      exam_sessions: {
        Row: {
          id: string;
          student_id: string;
          exam_type: 'hiragana' | 'katakana' | 'vocabulary' | 'grammar' | 'kanji';
          exam_category: string;
          difficulty: string;
          answers: Record<string, number>;
          start_time: string;
          time_remaining: number;
          current_question: number;
          is_fullscreen: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          student_id: string;
          exam_type: 'hiragana' | 'katakana' | 'vocabulary' | 'grammar' | 'kanji';
          exam_category?: string;
          difficulty?: string;
          answers?: Record<string, number>;
          start_time?: string;
          time_remaining?: number;
          current_question?: number;
          is_fullscreen?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          student_id?: string;
          exam_type?: 'hiragana' | 'katakana' | 'vocabulary' | 'grammar' | 'kanji';
          exam_category?: string;
          difficulty?: string;
          answers?: Record<string, number>;
          start_time?: string;
          time_remaining?: number;
          current_question?: number;
          is_fullscreen?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      exam_results: {
        Row: {
          id: string;
          student_id: string;
          student_name: string;
          exam_type: 'hiragana' | 'katakana' | 'vocabulary' | 'grammar' | 'kanji';
          exam_category: string;
          difficulty: string;
          score: number;
          total_questions: number;
          time_spent: number;
          completed_at: string;
          answers: any[];
          created_at: string;
        };
        Insert: {
          id?: string;
          student_id: string;
          student_name: string;
          exam_type: 'hiragana' | 'katakana' | 'vocabulary' | 'grammar' | 'kanji';
          exam_category?: string;
          difficulty?: string;
          score: number;
          total_questions: number;
          time_spent: number;
          completed_at?: string;
          answers: any[];
          created_at?: string;
        };
        Update: {
          id?: string;
          student_id?: string;
          student_name?: string;
          exam_type?: 'hiragana' | 'katakana' | 'vocabulary' | 'grammar' | 'kanji';
          exam_category?: string;
          difficulty?: string;
          score?: number;
          total_questions?: number;
          time_spent?: number;
          completed_at?: string;
          answers?: any[];
          created_at?: string;
        };
      };
    };
  };
}