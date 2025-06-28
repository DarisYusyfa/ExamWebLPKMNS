import React, { useState, useEffect } from 'react';
import { Clock, AlertTriangle, CheckCircle } from 'lucide-react';
import { Question, ExamSession } from '../types';
import { ExamService } from '../services/examService';
import { AntiCheatManager } from '../utils/antiCheat';
import { useNotifications } from '../hooks/useNotifications';
import { getErrorMessage } from '../utils/errorMessages';
import NotificationManager from './NotificationManager';

interface ExamInterfaceProps {
  session: ExamSession;
  questions: Question[];
  onComplete: (answers: Record<string, number>, timeSpent: number) => void;
}

const ExamInterface: React.FC<ExamInterfaceProps> = ({ session, questions, onComplete }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(session.currentQuestion);
  const [answers, setAnswers] = useState<Record<string, number>>(session.answers);
  const [timeRemaining, setTimeRemaining] = useState(session.timeRemaining);
  const [showWarning, setShowWarning] = useState(false);
  const [warningMessage, setWarningMessage] = useState('');

  const { notifications, removeNotification, showError, showInfo } = useNotifications();

  const currentQuestion = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

  useEffect(() => {
    // Start anti-cheat monitoring
    const antiCheat = AntiCheatManager.getInstance();
    antiCheat.startMonitoring(() => {
      setWarningMessage('Pelanggaran anti-cheat terdeteksi! Silakan kembali ke ujian.');
      setShowWarning(true);
      showInfo('Peringatan Keamanan', 'Aktivitas mencurigakan terdeteksi. Tetap fokus pada ujian.', 3000);
      setTimeout(() => setShowWarning(false), 3000);
    });

    // Timer
    const timer = setInterval(() => {
      setTimeRemaining(prev => {
        const newTime = prev - 1000;
        
        // Auto-save every 10 seconds
        if (newTime % 10000 === 0) {
          const updatedSession: ExamSession = {
            ...session,
            answers,
            currentQuestion: currentQuestionIndex,
            timeRemaining: newTime
          };
          ExamService.saveExamSession(updatedSession).catch((error) => {
            console.error('Auto-save failed:', error);
            showError('Gagal Menyimpan', 'Koneksi bermasalah. Jawaban mungkin tidak tersimpan.');
          });
        }

        // Auto-submit when time is up
        if (newTime <= 0) {
          const timeSpent = 30 * 60 * 1000 - newTime;
          onComplete(answers, timeSpent);
          return 0;
        }

        return newTime;
      });
    }, 1000);

    return () => {
      clearInterval(timer);
      antiCheat.stopMonitoring();
    };
  }, [answers, currentQuestionIndex, session, onComplete, showError, showInfo]);

  const handleAnswerSelect = async (answerIndex: number) => {
    const newAnswers = {
      ...answers,
      [currentQuestion.id]: answerIndex
    };
    setAnswers(newAnswers);

    // Auto-save to Supabase
    try {
      const updatedSession: ExamSession = {
        ...session,
        answers: newAnswers,
        currentQuestion: currentQuestionIndex,
        timeRemaining
      };
      await ExamService.saveExamSession(updatedSession);
    } catch (error) {
      console.error('Failed to save session:', error);
      showError('Gagal Menyimpan', getErrorMessage(error));
    }
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const handleSubmit = () => {
    const timeSpent = 30 * 60 * 1000 - timeRemaining;
    onComplete(answers, timeSpent);
  };

  const formatTime = (ms: number) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const answeredCount = Object.keys(answers).length;
  const isLastQuestion = currentQuestionIndex === questions.length - 1;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Notification Manager */}
      <NotificationManager 
        notifications={notifications} 
        onRemove={removeNotification} 
      />

      {/* Warning Banner */}
      {showWarning && (
        <div className="bg-red-600 text-white p-4 text-center">
          <AlertTriangle className="inline h-5 w-5 mr-2" />
          {warningMessage}
        </div>
      )}

      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold text-gray-900">
                Ujian {session.examType === 'hiragana' ? 'ひらがな' : 'カタカナ'}
              </h1>
              <p className="text-sm text-gray-600">
                Soal {currentQuestionIndex + 1} dari {questions.length}
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center text-sm text-gray-600">
                <CheckCircle className="h-4 w-4 mr-1" />
                {answeredCount}/{questions.length} terjawab
              </div>
              <div className={`flex items-center text-lg font-mono ${
                timeRemaining < 5 * 60 * 1000 ? 'text-red-600' : 'text-blue-600'
              }`}>
                <Clock className="h-5 w-5 mr-2" />
                {formatTime(timeRemaining)}
              </div>
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="mt-4">
            <div className="bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Question */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-xl shadow-sm p-8">
          <div className="text-center mb-8">
            <div className="text-6xl font-bold mb-4 text-gray-900">
              {currentQuestion.character}
            </div>
            <p className="text-lg text-gray-600">
              Apa bacaan romaji dari karakter ini?
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
            {currentQuestion.options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleAnswerSelect(index)}
                className={`p-4 text-lg font-medium rounded-lg border-2 transition-all ${
                  answers[currentQuestion.id] === index
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'
                }`}
              >
                {option}
              </button>
            ))}
          </div>

          {/* Navigation */}
          <div className="flex justify-between items-center mt-8 pt-6 border-t">
            <button
              onClick={handlePrevious}
              disabled={currentQuestionIndex === 0}
              className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Sebelumnya
            </button>

            <div className="flex space-x-3">
              {!isLastQuestion ? (
                <button
                  onClick={handleNext}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Selanjutnya
                </button>
              ) : (
                <button
                  onClick={handleSubmit}
                  className="px-8 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
                >
                  Selesai Ujian
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Question Navigation */}
        <div className="mt-6 bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-medium mb-4">Navigasi Soal</h3>
          <div className="grid grid-cols-10 gap-2">
            {questions.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentQuestionIndex(index)}
                className={`w-10 h-10 rounded-lg text-sm font-medium transition-all ${
                  index === currentQuestionIndex
                    ? 'bg-blue-600 text-white'
                    : answers[questions[index].id] !== undefined
                    ? 'bg-green-100 text-green-700 border border-green-300'
                    : 'bg-gray-100 text-gray-600 border border-gray-300'
                }`}
              >
                {index + 1}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExamInterface;