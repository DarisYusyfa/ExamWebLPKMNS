export interface Question {
  id: string;
  type: 'hiragana' | 'katakana' | 'vocabulary' | 'grammar' | 'kanji';
  category: string; // e.g., 'basic', 'chapter-1-2', 'chapter-3-5', etc.
  character?: string;
  question?: string;
  options: string[];
  correctAnswer: number;
  chapter?: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
}

export interface Student {
  id: string;
  name: string;
  token: string;
  examType: ExamType;
  examCategory: string;
  startTime: number;
  endTime?: number;
  answers: Record<string, number>;
  status: 'active' | 'completed' | 'disconnected';
  timeRemaining: number;
  currentQuestion: number;
}

export interface ExamSession {
  studentId: string;
  examType: ExamType;
  examCategory: string;
  questions: Question[];
  answers: Record<string, number>;
  startTime: number;
  timeRemaining: number;
  currentQuestion: number;
  isFullscreen: boolean;
}

export interface ExamResult {
  id: string;
  studentId: string;
  studentName: string;
  examType: ExamType;
  examCategory: string;
  score: number;
  totalQuestions: number;
  timeSpent: number;
  completedAt: number;
  answers: Array<{
    questionId: string;
    character?: string;
    question?: string;
    selectedAnswer: number;
    correctAnswer: number;
    isCorrect: boolean;
  }>;
}

export type ExamType = 'hiragana' | 'katakana' | 'vocabulary' | 'grammar' | 'kanji';

export interface ExamCategory {
  id: string;
  name: string;
  description: string;
  type: ExamType;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  chapters?: string[];
  timeLimit: number; // in minutes
  questionCount: number;
}

export interface TokenData {
  token: string;
  examType: ExamType;
  examCategory: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  createdAt: number;
  used: boolean;
  usedAt?: number;
}