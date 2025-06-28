import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import StudentAuth from './components/StudentAuth';
import ExamInterface from './components/ExamInterface';
import ExamComplete from './components/ExamComplete';
import AdminLogin from './components/AdminLogin';
import AdminDashboard from './components/AdminDashboard';
import { Student, ExamSession, Question, ExamResult, ExamType } from './types';
import { ExamService } from './services/examService';
import { AdminService } from './services/adminService';
import { useNotifications } from './hooks/useNotifications';
import { getErrorMessage, getSuccessMessage } from './utils/errorMessages';
import NotificationManager from './components/NotificationManager';
import { examCategories } from './data/examCategories';

function App() {
  const [currentStudent, setCurrentStudent] = useState<Student | null>(null);
  const [currentSession, setCurrentSession] = useState<ExamSession | null>(null);
  const [examComplete, setExamComplete] = useState<ExamResult | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  const { notifications, removeNotification, showSuccess, showError } = useNotifications();

  useEffect(() => {
    // Check for existing session on load
    const checkExistingSession = async () => {
      try {
        const studentId = localStorage.getItem('current_student_id');
        if (studentId) {
          const session = await ExamService.getExamSession(studentId);
          if (session) {
            setCurrentSession(session);
            const students = await ExamService.getStudents();
            const student = students.find(s => s.id === studentId);
            if (student) {
              setCurrentStudent(student);
            }
          }
        }

        // Check admin session using new AdminService
        if (AdminService.isLoggedIn()) {
          setIsAdmin(true);
        }
      } catch (error) {
        console.error('Error checking existing session:', error);
        showError('Gagal Memuat Sesi', getErrorMessage(error));
      } finally {
        setLoading(false);
      }
    };

    checkExistingSession();
  }, [showError]);

  const handleStudentAuth = async (token: string, name: string, examType: ExamType, examCategory: string) => {
    try {
      // Get category info for time limit
      const categoryInfo = examCategories.find(cat => cat.id === examCategory);
      const timeLimit = categoryInfo ? categoryInfo.timeLimit * 60 * 1000 : 30 * 60 * 1000;

      const student = await ExamService.createStudent({
        name,
        token,
        examType,
        examCategory,
        startTime: Date.now(),
        answers: {},
        status: 'active',
        timeRemaining: timeLimit,
        currentQuestion: 0
      });

      const questions = await ExamService.getQuestionsByCategory(examCategory);
      
      const session: ExamSession = {
        studentId: student.id,
        examType,
        examCategory,
        questions,
        answers: {},
        startTime: Date.now(),
        timeRemaining: timeLimit,
        currentQuestion: 0,
        isFullscreen: false
      };

      setCurrentStudent(student);
      setCurrentSession(session);
      
      localStorage.setItem('current_student_id', student.id);
      await ExamService.saveExamSession(session);
      
      const categoryName = categoryInfo?.name || examCategory;
      showSuccess('Ujian Dimulai', `Selamat datang ${name}! Ujian ${categoryName} telah dimulai.`);
    } catch (error) {
      console.error('Error during student authentication:', error);
      showError('Gagal Memulai Ujian', getErrorMessage(error));
    }
  };

  const handleExamComplete = async (answers: Record<string, number>, timeSpent: number) => {
    if (!currentStudent || !currentSession) return;

    try {
      let score = 0;
      const resultAnswers: ExamResult['answers'] = [];

      currentSession.questions.forEach(question => {
        const selectedAnswer = answers[question.id];
        const isCorrect = selectedAnswer === question.correctAnswer;
        
        if (isCorrect) score++;
        
        resultAnswers.push({
          questionId: question.id,
          character: question.character,
          question: question.question,
          selectedAnswer: selectedAnswer ?? -1,
          correctAnswer: question.correctAnswer,
          isCorrect
        });
      });

      const result: ExamResult = {
        studentId: currentStudent.id,
        studentName: currentStudent.name,
        examType: currentStudent.examType,
        examCategory: currentStudent.examCategory,
        score,
        totalQuestions: currentSession.questions.length,
        timeSpent,
        completedAt: Date.now(),
        answers: resultAnswers
      };

      // Update student status
      const updatedStudent = { 
        ...currentStudent, 
        status: 'completed' as const, 
        endTime: Date.now() 
      };
      
      setExamComplete(result);
      setCurrentStudent(updatedStudent);
      
      await ExamService.saveExamResult(result);
      await ExamService.updateStudent(updatedStudent);
      await ExamService.clearExamSession(currentStudent.id);
      localStorage.removeItem('current_student_id');
      
      const percentage = Math.round((score / currentSession.questions.length) * 100);
      const passed = percentage >= 70;
      
      showSuccess(
        'Ujian Selesai', 
        `Ujian telah selesai! Nilai Anda: ${score}/${currentSession.questions.length} (${percentage}%) - ${passed ? 'LULUS' : 'TIDAK LULUS'}`
      );
    } catch (error) {
      console.error('Error completing exam:', error);
      showError('Gagal Menyelesaikan Ujian', getErrorMessage(error));
    }
  };

  const handleAdminLogin = (username: string) => {
    setIsAdmin(true);
    showSuccess('Login Berhasil', `Selamat datang di dashboard admin, ${username}.`);
  };

  const handleAdminLogout = () => {
    setIsAdmin(false);
    showSuccess('Logout Berhasil', 'Anda telah keluar dari dashboard admin.');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Memuat...</p>
        </div>
      </div>
    );
  }

  return (
    <Router>
      {/* Global Notification Manager */}
      <NotificationManager 
        notifications={notifications} 
        onRemove={removeNotification} 
      />
      
      <Routes>
        <Route 
          path="/" 
          element={
            examComplete ? (
              <ExamComplete
                score={examComplete.score}
                totalQuestions={examComplete.totalQuestions}
                timeSpent={examComplete.timeSpent}
                examType={examComplete.examType}
                examCategory={examComplete.examCategory}
              />
            ) : currentSession && currentStudent ? (
              <ExamInterface
                session={currentSession}
                questions={currentSession.questions}
                onComplete={handleExamComplete}
              />
            ) : (
              <StudentAuth onAuth={handleStudentAuth} />
            )
          } 
        />
        <Route 
          path="/admin" 
          element={
            isAdmin ? (
              <AdminDashboard onLogout={handleAdminLogout} />
            ) : (
              <AdminLogin onLogin={handleAdminLogin} />
            )
          } 
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;