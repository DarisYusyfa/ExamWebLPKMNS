import React, { useState } from 'react';
import { UserCircle, Key, BookOpen, AlertCircle, CheckCircle, Clock, FileText } from 'lucide-react';
import { ExamService } from '../services/examService';
import { useNotifications } from '../hooks/useNotifications';
import { getErrorMessage } from '../utils/errorMessages';
import NotificationManager from './NotificationManager';
import { examCategories, getDifficultyColor, getDifficultyText, getTypeColor, getTypeText } from '../data/examCategories';
import { ExamType, ExamCategory } from '../types';

interface StudentAuthProps {
  onAuth: (token: string, name: string, examType: ExamType, examCategory: string) => void;
}

const StudentAuth: React.FC<StudentAuthProps> = ({ onAuth }) => {
  const [step, setStep] = useState<'token' | 'name'>('token');
  const [token, setToken] = useState('');
  const [name, setName] = useState('');
  const [validatedExam, setValidatedExam] = useState<{
    type: ExamType;
    category: string;
    categoryInfo?: ExamCategory;
  } | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { notifications, removeNotification, showError } = useNotifications();

  const handleTokenSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    if (!token.trim()) {
      setError('Harap masukkan token yang valid');
      setLoading(false);
      return;
    }

    try {
      // Validate token with Supabase
      const validation = await ExamService.validateToken(token.trim().toUpperCase());
      
      if (!validation.valid) {
        setError('Token tidak valid atau sudah digunakan');
        setLoading(false);
        return;
      }

      if (validation.examType && validation.examCategory) {
        const categoryInfo = examCategories.find(cat => cat.id === validation.examCategory);
        setValidatedExam({
          type: validation.examType,
          category: validation.examCategory,
          categoryInfo
        });
      }
      
      setStep('name');
    } catch (error) {
      console.error('Token validation error:', error);
      showError('Validasi Token Gagal', getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  const handleNameSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim() && validatedExam) {
      onAuth(token, name, validatedExam.type, validatedExam.category);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      {/* Notification Manager */}
      <NotificationManager 
        notifications={notifications} 
        onRemove={removeNotification} 
      />

      <div className="bg-white rounded-xl shadow-xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <BookOpen className="h-12 w-12 text-blue-600 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-gray-900">LPK MATAHARI NUSANTARA SENTOSA</h1>
          <p className="text-gray-600 mt-2">SISTEM UJIAN BAHASA JEPANG</p>
          <p className="text-lg font-semibold text-blue-600 mt-2">みんなの日本語 N5</p>
        </div>

        {step === 'token' && (
          <form onSubmit={handleTokenSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Key className="inline h-4 w-4 mr-2" />
                Masukan Token Ujian
              </label>
              <input
                type="text"
                value={token}
                onChange={(e) => {
                  setToken(e.target.value.toUpperCase());
                  setError('');
                }}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors uppercase text-center text-lg font-mono"
                placeholder="Masukkan token ujian"
                maxLength={10}
                required
                disabled={loading}
              />
              {error && (
                <div className="mt-2 flex items-center text-red-600 text-sm">
                  <AlertCircle className="h-4 w-4 mr-1" />
                  {error}
                </div>
              )}
            </div>
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={loading}
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Memvalidasi...
                </div>
              ) : (
                'Validasi Token'
              )}
            </button>
          </form>
        )}

        {step === 'name' && validatedExam && (
          <div className="space-y-6">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <CheckCircle className="h-5 w-5 text-green-400" />
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-green-800">
                    Token berhasil divalidasi!
                  </p>
                  {validatedExam.categoryInfo && (
                    <div className="mt-2 space-y-1">
                      <p className="text-sm text-green-700">
                        <strong>Jenis Ujian:</strong> {validatedExam.categoryInfo.name}
                      </p>
                      <p className="text-sm text-green-700">
                        <strong>Deskripsi:</strong> {validatedExam.categoryInfo.description}
                      </p>
                      <div className="flex items-center space-x-4 mt-2">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getTypeColor(validatedExam.type)}`}>
                          {getTypeText(validatedExam.type)}
                        </span>
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getDifficultyColor(validatedExam.categoryInfo.difficulty)}`}>
                          {getDifficultyText(validatedExam.categoryInfo.difficulty)}
                        </span>
                        <span className="text-xs text-green-700 flex items-center">
                          <Clock className="h-3 w-3 mr-1" />
                          {validatedExam.categoryInfo.timeLimit} menit
                        </span>
                        <span className="text-xs text-green-700 flex items-center">
                          <FileText className="h-3 w-3 mr-1" />
                          {validatedExam.categoryInfo.questionCount} soal
                        </span>
                      </div>
                      {validatedExam.categoryInfo.chapters && (
                        <p className="text-sm text-green-700">
                          <strong>Bab:</strong> {validatedExam.categoryInfo.chapters.join(', ')}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>

            <form onSubmit={handleNameSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <UserCircle className="inline h-4 w-4 mr-2" />
                  Masukan Nama Lengkap Kamu
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  placeholder="Masukkan nama lengkap Anda"
                  required
                />
              </div>
              <div className="flex space-x-3">
                <button
                  type="button"
                  onClick={() => {
                    setStep('token');
                    setToken('');
                    setError('');
                    setValidatedExam(null);
                  }}
                  className="flex-1 bg-gray-500 text-white py-3 rounded-lg hover:bg-gray-600 transition-colors font-medium"
                >
                  Kembali
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition-colors font-medium"
                >
                  Mulai Ujian
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="mt-8 p-4 bg-blue-50 rounded-lg">
          <p className="text-sm text-blue-800">
            <strong>Perhatian:</strong>
          </p>
          <ul className="text-sm text-blue-700 mt-2 space-y-1">
            <li>• Masukan Token Yang Telah Diberikan Admin</li>
            <li>• Pastikan Jaringan Internet Kamu Stabil</li>
            <li>• Dilarang Menutup Tab/Minimize Website Atau Waktu Ujian Kamu Berhenti Otomatis</li>
            <li>• Waktu ujian bervariasi tergantung jenis ujian yang dipilih</li>
            <li>• Setiap kategori ujian memiliki tingkat kesulitan yang berbeda</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default StudentAuth;