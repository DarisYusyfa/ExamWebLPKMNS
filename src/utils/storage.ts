import { Student, ExamSession, ExamResult, Question } from '../types';

interface TokenData {
  token: string;
  examType: 'hiragana' | 'katakana';
  createdAt: number;
  used: boolean;
}

const STORAGE_KEYS = {
  STUDENTS: 'exam_students',
  CURRENT_SESSION: 'current_exam_session',
  RESULTS: 'exam_results',
  ADMIN_TOKEN: 'admin_token',
  QUESTIONS: 'exam_questions',
  TOKENS: 'exam_tokens'
};

export const storageUtils = {
  // Students
  getStudents(): Student[] {
    const data = localStorage.getItem(STORAGE_KEYS.STUDENTS);
    return data ? JSON.parse(data) : [];
  },

  saveStudent(student: Student): void {
    const students = this.getStudents();
    const existingIndex = students.findIndex(s => s.id === student.id);
    
    if (existingIndex >= 0) {
      students[existingIndex] = student;
    } else {
      students.push(student);
    }
    
    localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(students));
  },

  updateStudentStatus(studentId: string, status: Student['status']): void {
    const students = this.getStudents();
    const student = students.find(s => s.id === studentId);
    if (student) {
      student.status = status;
      localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(students));
    }
  },

  // Current session
  getCurrentSession(): ExamSession | null {
    const data = localStorage.getItem(STORAGE_KEYS.CURRENT_SESSION);
    return data ? JSON.parse(data) : null;
  },

  saveCurrentSession(session: ExamSession): void {
    localStorage.setItem(STORAGE_KEYS.CURRENT_SESSION, JSON.stringify(session));
  },

  clearCurrentSession(): void {
    localStorage.removeItem(STORAGE_KEYS.CURRENT_SESSION);
  },

  // Results
  getResults(): ExamResult[] {
    const data = localStorage.getItem(STORAGE_KEYS.RESULTS);
    return data ? JSON.parse(data) : [];
  },

  saveResult(result: ExamResult): void {
    const results = this.getResults();
    results.push(result);
    localStorage.setItem(STORAGE_KEYS.RESULTS, JSON.stringify(results));
  },

  // Admin
  setAdminToken(token: string): void {
    localStorage.setItem(STORAGE_KEYS.ADMIN_TOKEN, token);
  },

  getAdminToken(): string | null {
    return localStorage.getItem(STORAGE_KEYS.ADMIN_TOKEN);
  },

  clearAdminToken(): void {
    localStorage.removeItem(STORAGE_KEYS.ADMIN_TOKEN);
  },

  // Questions
  getCustomQuestions(): Question[] {
    const data = localStorage.getItem(STORAGE_KEYS.QUESTIONS);
    return data ? JSON.parse(data) : [];
  },

  saveCustomQuestions(questions: Question[]): void {
    localStorage.setItem(STORAGE_KEYS.QUESTIONS, JSON.stringify(questions));
  },

  // Tokens
  getTokens(): TokenData[] {
    const data = localStorage.getItem(STORAGE_KEYS.TOKENS);
    return data ? JSON.parse(data) : [];
  },

  saveTokens(tokens: TokenData[]): void {
    localStorage.setItem(STORAGE_KEYS.TOKENS, JSON.stringify(tokens));
  },

  validateToken(token: string): { valid: boolean; examType?: 'hiragana' | 'katakana' } {
    const tokens = this.getTokens();
    const tokenData = tokens.find(t => t.token === token && !t.used);
    
    if (tokenData) {
      // Mark token as used
      tokenData.used = true;
      this.saveTokens(tokens);
      return { valid: true, examType: tokenData.examType };
    }
    
    return { valid: false };
  }
};

export type { TokenData };