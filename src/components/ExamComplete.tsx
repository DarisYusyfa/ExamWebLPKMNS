import React from 'react';
import { CheckCircle, Clock, Target, Trophy } from 'lucide-react';
import { ExamType } from '../types';
import { examCategories, getTypeText } from '../data/examCategories';

interface ExamCompleteProps {
  score: number;
  totalQuestions: number;
  timeSpent: number;
  examType: ExamType;
  examCategory: string;
}

const ExamComplete: React.FC<ExamCompleteProps> = ({ 
  score, 
  totalQuestions, 
  timeSpent, 
  examType,
  examCategory
}) => {
  const percentage = Math.round((score / totalQuestions) * 100);
  const passed = percentage >= 70;
  const timeSpentMinutes = Math.round(timeSpent / 60000);
  
  const categoryInfo = examCategories.find(cat => cat.id === examCategory);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-xl p-8 w-full max-w-md text-center">
        <div className={`h-16 w-16 mx-auto mb-6 rounded-full flex items-center justify-center ${
          passed ? 'bg-green-100' : 'bg-red-100'
        }`}>
          {passed ? (
            <Trophy className="h-8 w-8 text-green-600" />
          ) : (
            <Target className="h-8 w-8 text-red-600" />
          )}
        </div>

        <h1 className="text-3xl font-bold mb-2">
          {passed ? 'Selamat!' : 'Ujian Selesai'}
        </h1>
        
        <p className="text-gray-600 mb-2">
          Anda telah menyelesaikan ujian {getTypeText(examType)}
        </p>
        
        {categoryInfo && (
          <p className="text-sm text-gray-500 mb-8">
            {categoryInfo.name}
          </p>
        )}

        <div className="space-y-4 mb-8">
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center">
              <Target className="h-5 w-5 text-blue-600 mr-3" />
              <span className="font-medium">Nilai</span>
            </div>
            <span className="text-xl font-bold">
              {score}/{totalQuestions}
            </span>
          </div>

          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center">
              <CheckCircle className="h-5 w-5 text-green-600 mr-3" />
              <span className="font-medium">Persentase</span>
            </div>
            <span className={`text-xl font-bold ${
              passed ? 'text-green-600' : 'text-red-600'
            }`}>
              {percentage}%
            </span>
          </div>

          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center">
              <Clock className="h-5 w-5 text-purple-600 mr-3" />
              <span className="font-medium">Waktu Digunakan</span>
            </div>
            <span className="text-xl font-bold">
              {timeSpentMinutes} menit
            </span>
          </div>
        </div>

        <div className={`p-4 rounded-lg ${
          passed ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
        }`}>
          <p className={`font-medium ${passed ? 'text-green-800' : 'text-red-800'}`}>
            {passed ? 'LULUS' : 'TIDAK LULUS'}
          </p>
          <p className={`text-sm ${passed ? 'text-green-600' : 'text-red-600'}`}>
            {passed 
              ? 'Selamat! Anda telah berhasil lulus ujian.' 
              : 'Anda memerlukan minimal 70% untuk lulus. Terus belajar dan coba lagi!'
            }
          </p>
        </div>

        <button
          onClick={() => window.location.reload()}
          className="w-full mt-6 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
        >
          Ambil Ujian Lain
        </button>
      </div>
    </div>
  );
};

export default ExamComplete;