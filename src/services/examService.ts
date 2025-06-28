import { supabase } from '../lib/supabase';
import { Student, Question, ExamSession, ExamResult, ExamType, TokenData } from '../types';
import { questionsByCategory } from '../data/questions';

export class ExamService {
  // Token management - Enhanced for new exam system
  static async generateToken(examType: ExamType, examCategory: string, difficulty: 'beginner' | 'intermediate' | 'advanced'): Promise<string> {
    try {
      const token = Math.random().toString(36).substring(2, 10).toUpperCase();
      
      const { data, error } = await supabase
        .from('exam_tokens')
        .insert({
          token,
          exam_type: examType,
          exam_category: examCategory,
          difficulty,
          used: false
        })
        .select()
        .single();

      if (error) {
        console.error('Supabase error:', error);
        throw new Error('Failed to generate token: ' + error.message);
      }

      return token;
    } catch (error) {
      console.error('Token generation error:', error);
      throw error;
    }
  }

  static async validateToken(token: string): Promise<{ 
    valid: boolean; 
    examType?: ExamType; 
    examCategory?: string;
    difficulty?: 'beginner' | 'intermediate' | 'advanced';
  }> {
    try {
      const { data, error } = await supabase
        .from('exam_tokens')
        .select('*')
        .eq('token', token)
        .eq('used', false)
        .single();

      if (error || !data) {
        console.error('Token validation error:', error);
        return { valid: false };
      }

      // Mark token as used
      const { error: updateError } = await supabase
        .from('exam_tokens')
        .update({ used: true, used_at: new Date().toISOString() })
        .eq('id', data.id);

      if (updateError) {
        console.error('Token update error:', updateError);
      }

      return { 
        valid: true, 
        examType: data.exam_type,
        examCategory: data.exam_category,
        difficulty: data.difficulty
      };
    } catch (error) {
      console.error('Token validation error:', error);
      return { valid: false };
    }
  }

  static async getTokens(): Promise<TokenData[]> {
    try {
      const { data, error } = await supabase
        .from('exam_tokens')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Get tokens error:', error);
        throw new Error('Failed to fetch tokens: ' + error.message);
      }

      return data.map(token => ({
        token: token.token,
        examType: token.exam_type,
        examCategory: token.exam_category,
        difficulty: token.difficulty,
        createdAt: new Date(token.created_at).getTime(),
        used: token.used,
        usedAt: token.used_at ? new Date(token.used_at).getTime() : undefined
      }));
    } catch (error) {
      console.error('Get tokens error:', error);
      return [];
    }
  }

  static async deleteToken(token: string): Promise<void> {
    try {
      console.log('🔄 Starting token deletion process for:', token);
      
      // First, let's check if the token exists and get its details
      const { data: existingTokens, error: selectError } = await supabase
        .from('exam_tokens')
        .select('*')
        .eq('token', token);

      console.log('🔍 Token search result:', { existingTokens, selectError });

      if (selectError) {
        console.error('❌ Error searching for token:', selectError);
        throw new Error('Error searching for token: ' + selectError.message);
      }

      if (!existingTokens || existingTokens.length === 0) {
        console.error('❌ Token not found in database:', token);
        throw new Error('Token not found in database');
      }

      const tokenToDelete = existingTokens[0];
      console.log('📋 Token found, details:', tokenToDelete);

      // Now attempt to delete the token
      console.log('🗑️ Attempting to delete token...');
      const { data: deletedData, error: deleteError } = await supabase
        .from('exam_tokens')
        .delete()
        .eq('token', token)
        .select('*');

      console.log('🔄 Delete operation result:', { deletedData, deleteError });

      if (deleteError) {
        console.error('❌ Delete operation failed:', deleteError);
        throw new Error('Failed to delete token: ' + deleteError.message);
      }

      if (!deletedData || deletedData.length === 0) {
        console.error('❌ No rows were deleted');
        throw new Error('Token deletion failed - no rows affected');
      }

      console.log('✅ Token deleted successfully:', deletedData[0]);
      
      // Double-check that the token is really gone
      const { data: verifyData, error: verifyError } = await supabase
        .from('exam_tokens')
        .select('*')
        .eq('token', token);

      console.log('🔍 Verification check:', { verifyData, verifyError });

      if (verifyData && verifyData.length > 0) {
        console.warn('⚠️ Warning: Token still exists after deletion attempt');
        throw new Error('Token deletion verification failed - token still exists');
      }

      console.log('✅ Token deletion verified - token no longer exists in database');

    } catch (error) {
      console.error('💥 Token deletion failed:', error);
      throw error;
    }
  }

  // Alternative method to disable token instead of deleting
  static async disableToken(token: string): Promise<void> {
    try {
      console.log('🔄 Disabling token:', token);
      
      const { data, error } = await supabase
        .from('exam_tokens')
        .update({ 
          used: true, 
          used_at: new Date().toISOString() 
        })
        .eq('token', token)
        .select('*');

      if (error) {
        console.error('❌ Error disabling token:', error);
        throw new Error('Failed to disable token: ' + error.message);
      }

      if (!data || data.length === 0) {
        throw new Error('Token not found or already disabled');
      }

      console.log('✅ Token disabled successfully:', data[0]);
    } catch (error) {
      console.error('💥 Token disable failed:', error);
      throw error;
    }
  }

  // Student management - Enhanced for new exam system
  static async createStudent(student: Omit<Student, 'id'>): Promise<Student> {
    try {
      const { data, error } = await supabase
        .from('students')
        .insert({
          name: student.name,
          token: student.token,
          exam_type: student.examType,
          exam_category: student.examCategory,
          difficulty: student.difficulty || 'medium',
          start_time: new Date(student.startTime).toISOString(),
          status: student.status,
          time_remaining: student.timeRemaining,
          current_question: student.currentQuestion
        })
        .select()
        .single();

      if (error) {
        throw new Error('Failed to create student: ' + error.message);
      }

      return {
        id: data.id,
        name: data.name,
        token: data.token,
        examType: data.exam_type,
        examCategory: data.exam_category,
        difficulty: data.difficulty,
        startTime: new Date(data.start_time).getTime(),
        endTime: data.end_time ? new Date(data.end_time).getTime() : undefined,
        answers: {},
        status: data.status,
        timeRemaining: data.time_remaining,
        currentQuestion: data.current_question
      };
    } catch (error) {
      console.error('Create student error:', error);
      throw error;
    }
  }

  static async updateStudent(student: Student): Promise<void> {
    try {
      const { error } = await supabase
        .from('students')
        .update({
          name: student.name,
          status: student.status,
          time_remaining: student.timeRemaining,
          current_question: student.currentQuestion,
          end_time: student.endTime ? new Date(student.endTime).toISOString() : null
        })
        .eq('id', student.id);

      if (error) {
        throw new Error('Failed to update student: ' + error.message);
      }
    } catch (error) {
      console.error('Update student error:', error);
      throw error;
    }
  }

  static async deleteStudent(studentId: string): Promise<void> {
    try {
      console.log('🔄 Starting enhanced student deletion process for:', studentId);
      
      // First, let's check if the student exists
      const { data: existingStudents, error: selectError } = await supabase
        .from('students')
        .select('*')
        .eq('id', studentId);

      console.log('🔍 Student search result:', { existingStudents, selectError });

      if (selectError) {
        console.error('❌ Error searching for student:', selectError);
        throw new Error('Error searching for student: ' + selectError.message);
      }

      if (!existingStudents || existingStudents.length === 0) {
        console.error('❌ Student not found in database:', studentId);
        throw new Error('Student not found in database');
      }

      const studentToDelete = existingStudents[0];
      console.log('📋 Student found, details:', studentToDelete);

      // Try using the safe deletion function first
      console.log('🔄 Attempting safe deletion using database function...');
      const { data: functionResult, error: functionError } = await supabase
        .rpc('delete_student_safely', { student_uuid: studentId });

      if (functionError) {
        console.warn('⚠️ Database function failed, trying manual deletion:', functionError);
        
        // Fallback to manual deletion
        console.log('🔄 Attempting manual deletion...');
        
        // Step 1: Delete exam sessions
        console.log('🗑️ Deleting exam sessions...');
        const { error: sessionDeleteError } = await supabase
          .from('exam_sessions')
          .delete()
          .eq('student_id', studentId);

        if (sessionDeleteError) {
          console.warn('⚠️ Warning: Failed to delete exam sessions:', sessionDeleteError);
        } else {
          console.log('✅ Exam sessions deleted successfully');
        }

        // Step 2: Delete exam results
        console.log('🗑️ Deleting exam results...');
        const { error: resultDeleteError } = await supabase
          .from('exam_results')
          .delete()
          .eq('student_id', studentId);

        if (resultDeleteError) {
          console.warn('⚠️ Warning: Failed to delete exam results:', resultDeleteError);
        } else {
          console.log('✅ Exam results deleted successfully');
        }

        // Step 3: Delete the student
        console.log('🗑️ Deleting student...');
        const { data: deletedData, error: deleteError } = await supabase
          .from('students')
          .delete()
          .eq('id', studentId)
          .select('*');

        console.log('🔄 Student delete operation result:', { deletedData, deleteError });

        if (deleteError) {
          console.error('❌ Student delete operation failed:', deleteError);
          throw new Error('Failed to delete student: ' + deleteError.message);
        }

        if (!deletedData || deletedData.length === 0) {
          console.error('❌ No student rows were deleted');
          throw new Error('Student deletion failed - no rows affected');
        }

        console.log('✅ Student deleted successfully via manual deletion:', deletedData[0]);
      } else {
        console.log('✅ Student deleted successfully via database function:', functionResult);
      }
      
      // Final verification that the student is really gone
      const { data: verifyData, error: verifyError } = await supabase
        .from('students')
        .select('*')
        .eq('id', studentId);

      console.log('🔍 Final verification check:', { verifyData, verifyError });

      if (verifyData && verifyData.length > 0) {
        console.warn('⚠️ Warning: Student still exists after deletion attempt');
        throw new Error('Student deletion verification failed - student still exists');
      }

      console.log('✅ Student deletion verified - student no longer exists in database');

    } catch (error) {
      console.error('💥 Student deletion failed:', error);
      throw error;
    }
  }

  static async getStudents(): Promise<Student[]> {
    try {
      const { data, error } = await supabase
        .from('students')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Get students error:', error);
        return [];
      }

      return data.map(student => ({
        id: student.id,
        name: student.name,
        token: student.token,
        examType: student.exam_type,
        examCategory: student.exam_category,
        difficulty: student.difficulty,
        startTime: new Date(student.start_time).getTime(),
        endTime: student.end_time ? new Date(student.end_time).getTime() : undefined,
        answers: {},
        status: student.status,
        timeRemaining: student.time_remaining,
        currentQuestion: student.current_question
      }));
    } catch (error) {
      console.error('Get students error:', error);
      return [];
    }
  }

  // Questions management - Enhanced for new exam system
  static async getQuestions(): Promise<Question[]> {
    try {
      const { data, error } = await supabase
        .from('questions')
        .select('*')
        .order('created_at', { ascending: true });

      if (error) {
        console.error('Get questions error:', error);
        // Fallback to local questions if database fails
        return Object.values(questionsByCategory).flat();
      }

      const dbQuestions = data.map(q => ({
        id: q.question_id,
        type: q.type,
        category: q.category,
        character: q.character,
        question: q.question,
        options: q.options,
        correctAnswer: q.correct_answer,
        chapter: q.chapter,
        difficulty: q.difficulty
      }));

      // If no questions in database, return local questions
      if (dbQuestions.length === 0) {
        return Object.values(questionsByCategory).flat();
      }

      return dbQuestions;
    } catch (error) {
      console.error('Get questions error:', error);
      // Fallback to local questions
      return Object.values(questionsByCategory).flat();
    }
  }

  static async getQuestionsByCategory(category: string): Promise<Question[]> {
    try {
      const { data, error } = await supabase
        .from('questions')
        .select('*')
        .eq('category', category)
        .order('created_at', { ascending: true });

      if (error) {
        console.error('Get questions by category error:', error);
        // Fallback to local questions
        return questionsByCategory[category] || [];
      }

      const questions = data.map(q => ({
        id: q.question_id,
        type: q.type,
        category: q.category,
        character: q.character,
        question: q.question,
        options: q.options,
        correctAnswer: q.correct_answer,
        chapter: q.chapter,
        difficulty: q.difficulty
      }));

      // If no questions in database, return local questions
      if (questions.length === 0) {
        return questionsByCategory[category] || [];
      }

      return questions;
    } catch (error) {
      console.error('Get questions by category error:', error);
      // Fallback to local questions
      return questionsByCategory[category] || [];
    }
  }

  static async addQuestion(question: Omit<Question, 'id'>): Promise<Question> {
    try {
      const questionId = `custom_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      const { data, error } = await supabase
        .from('questions')
        .insert({
          question_id: questionId,
          type: question.type,
          category: question.category,
          character: question.character,
          question: question.question,
          options: question.options,
          correct_answer: question.correctAnswer,
          chapter: question.chapter,
          difficulty: question.difficulty,
          is_custom: true
        })
        .select()
        .single();

      if (error) {
        console.error('Add question error:', error);
        throw new Error('Failed to add question: ' + error.message);
      }

      return {
        id: data.question_id,
        type: data.type,
        category: data.category,
        character: data.character,
        question: data.question,
        options: data.options,
        correctAnswer: data.correct_answer,
        chapter: data.chapter,
        difficulty: data.difficulty
      };
    } catch (error) {
      console.error('Add question error:', error);
      throw error;
    }
  }

  static async updateQuestion(question: Question): Promise<void> {
    try {
      console.log('🔄 Updating question:', question.id);
      
      const { data, error } = await supabase
        .from('questions')
        .update({
          type: question.type,
          category: question.category,
          character: question.character,
          question: question.question,
          options: question.options,
          correct_answer: question.correctAnswer,
          chapter: question.chapter,
          difficulty: question.difficulty
        })
        .eq('question_id', question.id)
        .select('*');

      if (error) {
        console.error('❌ Update question error:', error);
        throw new Error('Failed to update question: ' + error.message);
      }

      if (!data || data.length === 0) {
        console.error('❌ No rows were updated');
        throw new Error('Question update failed - question not found');
      }

      console.log('✅ Question updated successfully:', data[0]);
    } catch (error) {
      console.error('💥 Update question error:', error);
      throw error;
    }
  }

  static async deleteQuestion(questionId: string): Promise<void> {
    try {
      // Check if it's a built-in question (should not be deleted)
      if (!this.isCustomQuestion(questionId)) {
        throw new Error('Cannot delete built-in questions');
      }

      console.log('🔄 Starting question deletion process for:', questionId);

      const { data: deletedData, error: deleteError } = await supabase
        .from('questions')
        .delete()
        .eq('question_id', questionId)
        .select('*');

      if (deleteError) {
        console.error('❌ Delete operation failed:', deleteError);
        throw new Error('Failed to delete question: ' + deleteError.message);
      }

      if (!deletedData || deletedData.length === 0) {
        console.error('❌ No rows were deleted');
        throw new Error('Question deletion failed - question not found');
      }

      console.log('✅ Question deleted successfully:', deletedData[0]);
    } catch (error) {
      console.error('💥 Delete question error:', error);
      throw error;
    }
  }

  // Exam session management - Enhanced for new exam system
  static async saveExamSession(session: ExamSession): Promise<void> {
    try {
      const { error } = await supabase
        .from('exam_sessions')
        .upsert({
          student_id: session.studentId,
          exam_type: session.examType,
          exam_category: session.examCategory,
          difficulty: session.difficulty || 'medium',
          answers: session.answers,
          start_time: new Date(session.startTime).toISOString(),
          time_remaining: session.timeRemaining,
          current_question: session.currentQuestion,
          is_fullscreen: session.isFullscreen
        }, {
          onConflict: 'student_id'
        });

      if (error) {
        console.error('Save session error:', error);
        throw new Error('Failed to save exam session: ' + error.message);
      }
    } catch (error) {
      console.error('Save session error:', error);
      throw error;
    }
  }

  static async getExamSession(studentId: string): Promise<ExamSession | null> {
    try {
      const { data, error } = await supabase
        .from('exam_sessions')
        .select('*')
        .eq('student_id', studentId)
        .single();

      if (error || !data) {
        return null;
      }

      // Get questions for this exam category
      const questions = await this.getQuestionsByCategory(data.exam_category);

      return {
        studentId: data.student_id,
        examType: data.exam_type,
        examCategory: data.exam_category,
        difficulty: data.difficulty,
        questions,
        answers: data.answers,
        startTime: new Date(data.start_time).getTime(),
        timeRemaining: data.time_remaining,
        currentQuestion: data.current_question,
        isFullscreen: data.is_fullscreen
      };
    } catch (error) {
      console.error('Get session error:', error);
      return null;
    }
  }

  static async clearExamSession(studentId: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('exam_sessions')
        .delete()
        .eq('student_id', studentId);

      if (error) {
        console.error('Clear session error:', error);
        throw new Error('Failed to clear exam session: ' + error.message);
      }
    } catch (error) {
      console.error('Clear session error:', error);
      throw error;
    }
  }

  // Results management - Enhanced for new exam system
  static async saveExamResult(result: ExamResult): Promise<void> {
    try {
      const { error } = await supabase
        .from('exam_results')
        .insert({
          student_id: result.studentId,
          student_name: result.studentName,
          exam_type: result.examType,
          exam_category: result.examCategory,
          difficulty: result.difficulty || 'medium',
          score: result.score,
          total_questions: result.totalQuestions,
          time_spent: result.timeSpent,
          completed_at: new Date(result.completedAt).toISOString(),
          answers: result.answers
        });

      if (error) {
        console.error('Save result error:', error);
        throw new Error('Failed to save exam result: ' + error.message);
      }
    } catch (error) {
      console.error('Save result error:', error);
      throw error;
    }
  }

  static async deleteExamResult(resultId: string): Promise<void> {
    try {
      console.log('🔄 Starting exam result deletion process for:', resultId);
      
      // First, let's check if the result exists and get its details
      const { data: existingResults, error: selectError } = await supabase
        .from('exam_results')
        .select('*')
        .eq('id', resultId);

      console.log('🔍 Exam result search result:', { existingResults, selectError });

      if (selectError) {
        console.error('❌ Error searching for exam result:', selectError);
        throw new Error('Error searching for exam result: ' + selectError.message);
      }

      if (!existingResults || existingResults.length === 0) {
        console.error('❌ Exam result not found in database:', resultId);
        throw new Error('Exam result not found in database');
      }

      const resultToDelete = existingResults[0];
      console.log('📋 Exam result found, details:', resultToDelete);

      // Now attempt to delete the exam result
      console.log('🗑️ Attempting to delete exam result...');
      const { data: deletedData, error: deleteError } = await supabase
        .from('exam_results')
        .delete()
        .eq('id', resultId)
        .select('*');

      console.log('🔄 Delete operation result:', { deletedData, deleteError });

      if (deleteError) {
        console.error('❌ Delete operation failed:', deleteError);
        throw new Error('Failed to delete exam result: ' + deleteError.message);
      }

      if (!deletedData || deletedData.length === 0) {
        console.error('❌ No rows were deleted');
        throw new Error('Exam result deletion failed - no rows affected');
      }

      console.log('✅ Exam result deleted successfully:', deletedData[0]);
      
      // Double-check that the result is really gone
      const { data: verifyData, error: verifyError } = await supabase
        .from('exam_results')
        .select('*')
        .eq('id', resultId);

      console.log('🔍 Verification check:', { verifyData, verifyError });

      if (verifyData && verifyData.length > 0) {
        console.warn('⚠️ Warning: Exam result still exists after deletion attempt');
        throw new Error('Exam result deletion verification failed - result still exists');
      }

      console.log('✅ Exam result deletion verified - result no longer exists in database');

    } catch (error) {
      console.error('💥 Exam result deletion failed:', error);
      throw error;
    }
  }

  static async getExamResults(): Promise<ExamResult[]> {
    try {
      const { data, error } = await supabase
        .from('exam_results')
        .select('*')
        .order('completed_at', { ascending: false });

      if (error) {
        console.error('Get results error:', error);
        return [];
      }

      return data.map(result => ({
        id: result.id,
        studentId: result.student_id,
        studentName: result.student_name,
        examType: result.exam_type,
        examCategory: result.exam_category,
        difficulty: result.difficulty,
        score: result.score,
        totalQuestions: result.total_questions,
        timeSpent: result.time_spent,
        completedAt: new Date(result.completed_at).getTime(),
        answers: result.answers
      }));
    } catch (error) {
      console.error('Get results error:', error);
      return [];
    }
  }

  // Helper methods
  static async getQuestionsByType(type: ExamType): Promise<Question[]> {
    try {
      const { data, error } = await supabase
        .from('questions')
        .select('*')
        .eq('type', type)
        .order('created_at', { ascending: true });

      if (error) {
        console.error('Get questions by type error:', error);
        // Fallback to local questions
        return Object.values(questionsByCategory).flat().filter(q => q.type === type);
      }

      const questions = data.map(q => ({
        id: q.question_id,
        type: q.type,
        category: q.category,
        character: q.character,
        question: q.question,
        options: q.options,
        correctAnswer: q.correct_answer,
        chapter: q.chapter,
        difficulty: q.difficulty
      }));

      // If no questions in database, return local questions
      if (questions.length === 0) {
        return Object.values(questionsByCategory).flat().filter(q => q.type === type);
      }

      return questions;
    } catch (error) {
      console.error('Get questions by type error:', error);
      // Fallback to local questions
      return Object.values(questionsByCategory).flat().filter(q => q.type === type);
    }
  }

  static isCustomQuestion(questionId: string): boolean {
    return questionId.startsWith('custom_');
  }

  // Test connection
  static async testConnection(): Promise<boolean> {
    try {
      const { data, error } = await supabase
        .from('exam_tokens')
        .select('count')
        .limit(1);

      return !error;
    } catch (error) {
      console.error('Connection test failed:', error);
      return false;
    }
  }

  // Enhanced statistics for new exam system
  static async getQuestionStats(): Promise<{ 
    total: number; 
    byType: Record<ExamType, number>;
    byDifficulty: Record<string, number>;
    custom: number;
  }> {
    try {
      const { data, error } = await supabase
        .from('questions')
        .select('type, difficulty, is_custom');

      if (error) {
        console.error('Get question stats error:', error);
        return { total: 0, byType: {} as Record<ExamType, number>, byDifficulty: {}, custom: 0 };
      }

      const stats = {
        total: data.length,
        byType: {} as Record<ExamType, number>,
        byDifficulty: {} as Record<string, number>,
        custom: data.filter(q => q.is_custom).length
      };

      // Count by type
      data.forEach(q => {
        stats.byType[q.type] = (stats.byType[q.type] || 0) + 1;
        stats.byDifficulty[q.difficulty] = (stats.byDifficulty[q.difficulty] || 0) + 1;
      });

      return stats;
    } catch (error) {
      console.error('Get question stats error:', error);
      return { total: 0, byType: {} as Record<ExamType, number>, byDifficulty: {}, custom: 0 };
    }
  }

  static async getTokenStats(): Promise<{ 
    total: number; 
    used: number; 
    available: number;
    byType: Record<ExamType, number>;
    byDifficulty: Record<string, number>;
  }> {
    try {
      const { data, error } = await supabase
        .from('exam_tokens')
        .select('used, exam_type, difficulty');

      if (error) {
        console.error('Get token stats error:', error);
        return { total: 0, used: 0, available: 0, byType: {} as Record<ExamType, number>, byDifficulty: {} };
      }

      const stats = {
        total: data.length,
        used: data.filter(t => t.used).length,
        available: data.filter(t => !t.used).length,
        byType: {} as Record<ExamType, number>,
        byDifficulty: {} as Record<string, number>
      };

      // Count by type and difficulty
      data.forEach(t => {
        stats.byType[t.exam_type] = (stats.byType[t.exam_type] || 0) + 1;
        stats.byDifficulty[t.difficulty] = (stats.byDifficulty[t.difficulty] || 0) + 1;
      });

      return stats;
    } catch (error) {
      console.error('Get token stats error:', error);
      return { total: 0, used: 0, available: 0, byType: {} as Record<ExamType, number>, byDifficulty: {} };
    }
  }
}