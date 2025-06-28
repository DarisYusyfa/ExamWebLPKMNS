import React, { useState, useEffect } from 'react';
import { 
  Users, 
  FileText, 
  BarChart3, 
  Key, 
  LogOut, 
  Plus, 
  Download, 
  Trash2, 
  Edit3, 
  Eye, 
  EyeOff, 
  Save, 
  X, 
  AlertCircle, 
  CheckCircle, 
  Clock, 
  Target, 
  Trophy, 
  BookOpen,
  Settings,
  Menu,
  ChevronDown,
  ChevronUp,
  Search,
  Filter,
  MoreVertical
} from 'lucide-react';
import { ExamService } from '../services/examService';
import { AdminService } from '../services/adminService';
import { Student, Question, ExamResult, ExamType, TokenData } from '../types';
import { examCategories, getDifficultyColor, getDifficultyText, getTypeColor, getTypeText } from '../data/examCategories';
import { exportToCSV, exportDetailedToCSV } from '../utils/exportUtils';
import { useNotifications } from '../hooks/useNotifications';
import { getErrorMessage, getSuccessMessage } from '../utils/errorMessages';
import NotificationManager from './NotificationManager';
import AdminPasswordChange from './AdminPasswordChange';

interface AdminDashboardProps {
  onLogout: () => void;
}

type TabType = 'overview' | 'students' | 'questions' | 'results' | 'tokens';

const AdminDashboard: React.FC<AdminDashboardProps> = ({ onLogout }) => {
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [students, setStudents] = useState<Student[]>([]);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [results, setResults] = useState<ExamResult[]>([]);
  const [tokens, setTokens] = useState<TokenData[]>([]);
  const [loading, setLoading] = useState(true);
  const [showPasswordChange, setShowPasswordChange] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Mobile-specific states
  const [expandedCards, setExpandedCards] = useState<Record<string, boolean>>({});
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('all');

  // Question management states
  const [showAddQuestion, setShowAddQuestion] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);
  const [newQuestion, setNewQuestion] = useState<Partial<Question>>({
    type: 'hiragana',
    category: 'hiragana-basic',
    character: '',
    question: '',
    options: ['', '', '', ''],
    correctAnswer: 0,
    difficulty: 'beginner'
  });

  // Token generation states
  const [showTokenForm, setShowTokenForm] = useState(false);
  const [tokenForm, setTokenForm] = useState({
    examType: 'hiragana' as ExamType,
    examCategory: 'hiragana-basic',
    difficulty: 'beginner' as 'beginner' | 'intermediate' | 'advanced'
  });

  const { notifications, removeNotification, showSuccess, showError } = useNotifications();

  const currentAdmin = AdminService.getCurrentAdmin();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [studentsData, questionsData, resultsData, tokensData] = await Promise.all([
        ExamService.getStudents(),
        ExamService.getQuestions(),
        ExamService.getExamResults(),
        ExamService.getTokens()
      ]);

      setStudents(studentsData);
      setQuestions(questionsData);
      setResults(resultsData);
      setTokens(tokensData);
    } catch (error) {
      console.error('Error loading data:', error);
      showError('Gagal Memuat Data', getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    AdminService.logout();
    onLogout();
  };

  const toggleCard = (id: string) => {
    setExpandedCards(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  // Filter functions for mobile
  const filteredStudents = students.filter(student => 
    student.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (filterType === 'all' || student.status === filterType)
  );

  const filteredQuestions = questions.filter(question => 
    (question.character?.toLowerCase().includes(searchTerm.toLowerCase()) ||
     question.question?.toLowerCase().includes(searchTerm.toLowerCase())) &&
    (filterType === 'all' || question.type === filterType)
  );

  const filteredResults = results.filter(result => 
    result.studentName.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (filterType === 'all' || result.examType === filterType)
  );

  const filteredTokens = tokens.filter(token => 
    token.token.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (filterType === 'all' || token.examType === filterType)
  );

  // Mobile Navigation Component
  const MobileNavigation = () => (
    <div className="lg:hidden">
      <div className="flex items-center justify-between p-4 bg-white border-b">
        <h1 className="text-lg font-bold text-gray-900">Admin Dashboard</h1>
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
        >
          <Menu className="h-5 w-5" />
        </button>
      </div>

      {isMobileMenuOpen && (
        <div className="bg-white border-b shadow-lg">
          <div className="p-4 space-y-2">
            {[
              { id: 'overview', label: 'Overview', icon: BarChart3 },
              { id: 'students', label: 'Siswa', icon: Users },
              { id: 'questions', label: 'Bank Soal', icon: FileText },
              { id: 'results', label: 'Hasil Ujian', icon: Trophy },
              { id: 'tokens', label: 'Token', icon: Key }
            ].map(tab => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id as TabType);
                    setIsMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center px-3 py-2 rounded-lg text-left transition-colors ${
                    activeTab === tab.id
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <Icon className="h-5 w-5 mr-3" />
                  {tab.label}
                </button>
              );
            })}
            <hr className="my-2" />
            <button
              onClick={() => {
                setShowPasswordChange(true);
                setIsMobileMenuOpen(false);
              }}
              className="w-full flex items-center px-3 py-2 rounded-lg text-left text-gray-600 hover:bg-gray-100 transition-colors"
            >
              <Settings className="h-5 w-5 mr-3" />
              Ubah Password
            </button>
            <button
              onClick={handleLogout}
              className="w-full flex items-center px-3 py-2 rounded-lg text-left text-red-600 hover:bg-red-50 transition-colors"
            >
              <LogOut className="h-5 w-5 mr-3" />
              Logout
            </button>
          </div>
        </div>
      )}
    </div>
  );

  // Mobile Search and Filter Component
  const MobileSearchFilter = () => (
    <div className="lg:hidden p-4 bg-white border-b space-y-3">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        <input
          type="text"
          placeholder="Cari..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>
      
      {activeTab !== 'overview' && (
        <div className="relative">
          <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none bg-white"
          >
            <option value="all">Semua</option>
            {activeTab === 'students' && (
              <>
                <option value="active">Aktif</option>
                <option value="completed">Selesai</option>
                <option value="disconnected">Terputus</option>
              </>
            )}
            {(activeTab === 'questions' || activeTab === 'results' || activeTab === 'tokens') && (
              <>
                <option value="hiragana">Hiragana</option>
                <option value="katakana">Katakana</option>
                <option value="vocabulary">Vocabulary</option>
                <option value="grammar">Grammar</option>
                <option value="kanji">Kanji</option>
              </>
            )}
          </select>
        </div>
      )}
    </div>
  );

  // Mobile Card Components
  const MobileStudentCard = ({ student }: { student: Student }) => {
    const isExpanded = expandedCards[student.id];
    const timeSpent = student.endTime ? student.endTime - student.startTime : Date.now() - student.startTime;
    const timeSpentMinutes = Math.round(timeSpent / 60000);

    return (
      <div className="bg-white rounded-lg border border-gray-200 mb-3">
        <div 
          className="p-4 cursor-pointer"
          onClick={() => toggleCard(student.id)}
        >
          <div className="flex items-center justify-between">
            <div className="flex-1 min-w-0">
              <h3 className="font-medium text-gray-900 truncate">{student.name}</h3>
              <p className="text-sm text-gray-500">{getTypeText(student.examType)}</p>
            </div>
            <div className="flex items-center space-x-2">
              <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                student.status === 'active' ? 'bg-green-100 text-green-800' :
                student.status === 'completed' ? 'bg-blue-100 text-blue-800' :
                'bg-red-100 text-red-800'
              }`}>
                {student.status === 'active' ? 'Aktif' :
                 student.status === 'completed' ? 'Selesai' : 'Terputus'}
              </span>
              {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </div>
          </div>
        </div>

        {isExpanded && (
          <div className="px-4 pb-4 border-t border-gray-100">
            <div className="grid grid-cols-2 gap-3 mt-3 text-sm">
              <div>
                <span className="text-gray-500">Token:</span>
                <p className="font-mono">{student.token}</p>
              </div>
              <div>
                <span className="text-gray-500">Waktu:</span>
                <p>{timeSpentMinutes} menit</p>
              </div>
              <div>
                <span className="text-gray-500">Soal:</span>
                <p>{student.currentQuestion + 1}</p>
              </div>
              <div>
                <span className="text-gray-500">Kategori:</span>
                <p className="text-xs">{examCategories.find(c => c.id === student.examCategory)?.name || student.examCategory}</p>
              </div>
            </div>
            <div className="mt-3 flex space-x-2">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteStudent(student.id);
                }}
                className="flex-1 px-3 py-2 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700 transition-colors"
              >
                <Trash2 className="h-4 w-4 mx-auto" />
              </button>
            </div>
          </div>
        )}
      </div>
    );
  };

  const MobileQuestionCard = ({ question }: { question: Question }) => {
    const isExpanded = expandedCards[question.id];

    return (
      <div className="bg-white rounded-lg border border-gray-200 mb-3">
        <div 
          className="p-4 cursor-pointer"
          onClick={() => toggleCard(question.id)}
        >
          <div className="flex items-center justify-between">
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-2 mb-1">
                <span className="text-lg font-bold">{question.character}</span>
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${getTypeColor(question.type)}`}>
                  {getTypeText(question.type)}
                </span>
              </div>
              <p className="text-sm text-gray-500 truncate">{question.question || 'Pilih romaji yang benar'}</p>
            </div>
            <div className="flex items-center space-x-2">
              {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </div>
          </div>
        </div>

        {isExpanded && (
          <div className="px-4 pb-4 border-t border-gray-100">
            <div className="mt-3 space-y-2">
              <div>
                <span className="text-sm text-gray-500">Pilihan Jawaban:</span>
                <div className="grid grid-cols-2 gap-2 mt-1">
                  {question.options.map((option, index) => (
                    <div 
                      key={index}
                      className={`p-2 text-sm rounded border ${
                        index === question.correctAnswer 
                          ? 'bg-green-50 border-green-200 text-green-800' 
                          : 'bg-gray-50 border-gray-200'
                      }`}
                    >
                      {option} {index === question.correctAnswer && '✓'}
                    </div>
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <span className="text-gray-500">Kategori:</span>
                  <p className="text-xs">{question.category}</p>
                </div>
                <div>
                  <span className="text-gray-500">Tingkat:</span>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getDifficultyColor(question.difficulty)}`}>
                    {getDifficultyText(question.difficulty)}
                  </span>
                </div>
              </div>
            </div>
            <div className="mt-3 flex space-x-2">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setEditingQuestion(question);
                }}
                className="flex-1 px-3 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Edit3 className="h-4 w-4 mx-auto" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteQuestion(question.id);
                }}
                className="flex-1 px-3 py-2 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700 transition-colors"
                disabled={!ExamService.isCustomQuestion(question.id)}
              >
                <Trash2 className="h-4 w-4 mx-auto" />
              </button>
            </div>
          </div>
        )}
      </div>
    );
  };

  const MobileResultCard = ({ result }: { result: ExamResult }) => {
    const isExpanded = expandedCards[result.id];
    const percentage = Math.round((result.score / result.totalQuestions) * 100);
    const passed = percentage >= 70;

    return (
      <div className="bg-white rounded-lg border border-gray-200 mb-3">
        <div 
          className="p-4 cursor-pointer"
          onClick={() => toggleCard(result.id)}
        >
          <div className="flex items-center justify-between">
            <div className="flex-1 min-w-0">
              <h3 className="font-medium text-gray-900 truncate">{result.studentName}</h3>
              <div className="flex items-center space-x-2 mt-1">
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${getTypeColor(result.examType)}`}>
                  {getTypeText(result.examType)}
                </span>
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                  passed ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {percentage}%
                </span>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-lg font-bold">{result.score}/{result.totalQuestions}</span>
              {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </div>
          </div>
        </div>

        {isExpanded && (
          <div className="px-4 pb-4 border-t border-gray-100">
            <div className="grid grid-cols-2 gap-3 mt-3 text-sm">
              <div>
                <span className="text-gray-500">Waktu:</span>
                <p>{Math.round(result.timeSpent / 60000)} menit</p>
              </div>
              <div>
                <span className="text-gray-500">Status:</span>
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                  passed ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {passed ? 'LULUS' : 'TIDAK LULUS'}
                </span>
              </div>
              <div>
                <span className="text-gray-500">Kategori:</span>
                <p className="text-xs">{examCategories.find(c => c.id === result.examCategory)?.name || result.examCategory}</p>
              </div>
              <div>
                <span className="text-gray-500">Selesai:</span>
                <p className="text-xs">{new Date(result.completedAt).toLocaleDateString()}</p>
              </div>
            </div>
            <div className="mt-3 flex space-x-2">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteResult(result.id);
                }}
                className="flex-1 px-3 py-2 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700 transition-colors"
              >
                <Trash2 className="h-4 w-4 mx-auto" />
              </button>
            </div>
          </div>
        )}
      </div>
    );
  };

  const MobileTokenCard = ({ token }: { token: TokenData }) => {
    const isExpanded = expandedCards[token.token];

    return (
      <div className="bg-white rounded-lg border border-gray-200 mb-3">
        <div 
          className="p-4 cursor-pointer"
          onClick={() => toggleCard(token.token)}
        >
          <div className="flex items-center justify-between">
            <div className="flex-1 min-w-0">
              <h3 className="font-mono font-bold text-lg text-gray-900">{token.token}</h3>
              <div className="flex items-center space-x-2 mt-1">
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${getTypeColor(token.examType)}`}>
                  {getTypeText(token.examType)}
                </span>
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                  token.used ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                }`}>
                  {token.used ? 'Digunakan' : 'Tersedia'}
                </span>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </div>
          </div>
        </div>

        {isExpanded && (
          <div className="px-4 pb-4 border-t border-gray-100">
            <div className="grid grid-cols-2 gap-3 mt-3 text-sm">
              <div>
                <span className="text-gray-500">Kategori:</span>
                <p className="text-xs">{examCategories.find(c => c.id === token.examCategory)?.name || token.examCategory}</p>
              </div>
              <div>
                <span className="text-gray-500">Tingkat:</span>
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${getDifficultyColor(token.difficulty)}`}>
                  {getDifficultyText(token.difficulty)}
                </span>
              </div>
              <div>
                <span className="text-gray-500">Dibuat:</span>
                <p className="text-xs">{new Date(token.createdAt).toLocaleDateString()}</p>
              </div>
              {token.usedAt && (
                <div>
                  <span className="text-gray-500">Digunakan:</span>
                  <p className="text-xs">{new Date(token.usedAt).toLocaleDateString()}</p>
                </div>
              )}
            </div>
            <div className="mt-3 flex space-x-2">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteToken(token.token);
                }}
                className="flex-1 px-3 py-2 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700 transition-colors"
              >
                <Trash2 className="h-4 w-4 mx-auto" />
              </button>
            </div>
          </div>
        )}
      </div>
    );
  };

  // CRUD Operations
  const handleDeleteStudent = async (studentId: string) => {
    if (!confirm('Apakah Anda yakin ingin menghapus siswa ini?')) return;

    try {
      await ExamService.deleteStudent(studentId);
      await loadData();
      showSuccess('Berhasil', 'Siswa berhasil dihapus');
    } catch (error) {
      console.error('Delete student error:', error);
      showError('Gagal Menghapus', getErrorMessage(error));
    }
  };

  const handleDeleteQuestion = async (questionId: string) => {
    if (!ExamService.isCustomQuestion(questionId)) {
      showError('Tidak Diizinkan', 'Soal bawaan sistem tidak dapat dihapus');
      return;
    }

    if (!confirm('Apakah Anda yakin ingin menghapus soal ini?')) return;

    try {
      await ExamService.deleteQuestion(questionId);
      await loadData();
      showSuccess('Berhasil', 'Soal berhasil dihapus');
    } catch (error) {
      console.error('Delete question error:', error);
      showError('Gagal Menghapus', getErrorMessage(error));
    }
  };

  const handleDeleteResult = async (resultId: string) => {
    if (!confirm('Apakah Anda yakin ingin menghapus hasil ujian ini?')) return;

    try {
      await ExamService.deleteExamResult(resultId);
      await loadData();
      showSuccess('Berhasil', 'Hasil ujian berhasil dihapus');
    } catch (error) {
      console.error('Delete result error:', error);
      showError('Gagal Menghapus', getErrorMessage(error));
    }
  };

  const handleDeleteToken = async (token: string) => {
    if (!confirm('Apakah Anda yakin ingin menghapus token ini?')) return;

    try {
      await ExamService.deleteToken(token);
      await loadData();
      showSuccess('Berhasil', 'Token berhasil dihapus');
    } catch (error) {
      console.error('Delete token error:', error);
      showError('Gagal Menghapus', getErrorMessage(error));
    }
  };

  const handleAddQuestion = async () => {
    try {
      if (!newQuestion.character || !newQuestion.options?.every(opt => opt.trim())) {
        showError('Data Tidak Lengkap', 'Harap isi semua field yang diperlukan');
        return;
      }

      await ExamService.addQuestion(newQuestion as Omit<Question, 'id'>);
      await loadData();
      setShowAddQuestion(false);
      setNewQuestion({
        type: 'hiragana',
        category: 'hiragana-basic',
        character: '',
        question: '',
        options: ['', '', '', ''],
        correctAnswer: 0,
        difficulty: 'beginner'
      });
      showSuccess('Berhasil', 'Soal berhasil ditambahkan');
    } catch (error) {
      console.error('Add question error:', error);
      showError('Gagal Menambah', getErrorMessage(error));
    }
  };

  const handleUpdateQuestion = async () => {
    if (!editingQuestion) return;

    try {
      await ExamService.updateQuestion(editingQuestion);
      await loadData();
      setEditingQuestion(null);
      showSuccess('Berhasil', 'Soal berhasil diperbarui');
    } catch (error) {
      console.error('Update question error:', error);
      showError('Gagal Memperbarui', getErrorMessage(error));
    }
  };

  const handleGenerateToken = async () => {
    try {
      await ExamService.generateToken(
        tokenForm.examType,
        tokenForm.examCategory,
        tokenForm.difficulty
      );
      await loadData();
      setShowTokenForm(false);
      showSuccess('Berhasil', 'Token berhasil dibuat');
    } catch (error) {
      console.error('Generate token error:', error);
      showError('Gagal Membuat Token', getErrorMessage(error));
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Memuat data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <NotificationManager notifications={notifications} onRemove={removeNotification} />

      {/* Desktop Sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
        <div className="flex min-h-0 flex-1 flex-col bg-white border-r border-gray-200">
          <div className="flex flex-1 flex-col pt-5 pb-4 overflow-y-auto">
            <div className="flex items-center flex-shrink-0 px-4">
              <BookOpen className="h-8 w-8 text-blue-600" />
              <span className="ml-2 text-xl font-bold text-gray-900">Admin Panel</span>
            </div>
            
            <div className="mt-8 px-4">
              <p className="text-sm text-gray-600">Selamat datang,</p>
              <p className="font-medium text-gray-900">{currentAdmin?.username}</p>
            </div>

            <nav className="mt-8 flex-1 px-2 space-y-1">
              {[
                { id: 'overview', label: 'Overview', icon: BarChart3 },
                { id: 'students', label: 'Siswa', icon: Users },
                { id: 'questions', label: 'Bank Soal', icon: FileText },
                { id: 'results', label: 'Hasil Ujian', icon: Trophy },
                { id: 'tokens', label: 'Token', icon: Key }
              ].map(tab => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as TabType)}
                    className={`w-full group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors ${
                      activeTab === tab.id
                        ? 'bg-blue-100 text-blue-700'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                  >
                    <Icon className="mr-3 h-5 w-5" />
                    {tab.label}
                  </button>
                );
              })}
            </nav>

            <div className="px-2 space-y-1">
              <button
                onClick={() => setShowPasswordChange(true)}
                className="w-full group flex items-center px-2 py-2 text-sm font-medium text-gray-600 rounded-md hover:bg-gray-50 hover:text-gray-900 transition-colors"
              >
                <Settings className="mr-3 h-5 w-5" />
                Ubah Password
              </button>
              <button
                onClick={handleLogout}
                className="w-full group flex items-center px-2 py-2 text-sm font-medium text-red-600 rounded-md hover:bg-red-50 transition-colors"
              >
                <LogOut className="mr-3 h-5 w-5" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <MobileNavigation />

      {/* Mobile Search and Filter */}
      <MobileSearchFilter />

      {/* Main Content */}
      <div className="lg:pl-64">
        <div className="p-4 lg:p-8">
          {/* Desktop Header */}
          <div className="hidden lg:block mb-8">
            <h1 className="text-3xl font-bold text-gray-900">
              {activeTab === 'overview' && 'Dashboard Overview'}
              {activeTab === 'students' && 'Manajemen Siswa'}
              {activeTab === 'questions' && 'Bank Soal'}
              {activeTab === 'results' && 'Hasil Ujian'}
              {activeTab === 'tokens' && 'Manajemen Token'}
            </h1>
          </div>

          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Stats Grid */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white p-4 lg:p-6 rounded-lg shadow-sm border">
                  <div className="flex items-center">
                    <Users className="h-8 w-8 text-blue-600" />
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Total Siswa</p>
                      <p className="text-2xl font-bold text-gray-900">{students.length}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white p-4 lg:p-6 rounded-lg shadow-sm border">
                  <div className="flex items-center">
                    <FileText className="h-8 w-8 text-green-600" />
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Bank Soal</p>
                      <p className="text-2xl font-bold text-gray-900">{questions.length}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white p-4 lg:p-6 rounded-lg shadow-sm border">
                  <div className="flex items-center">
                    <Trophy className="h-8 w-8 text-yellow-600" />
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Hasil Ujian</p>
                      <p className="text-2xl font-bold text-gray-900">{results.length}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white p-4 lg:p-6 rounded-lg shadow-sm border">
                  <div className="flex items-center">
                    <Key className="h-8 w-8 text-purple-600" />
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Token Aktif</p>
                      <p className="text-2xl font-bold text-gray-900">{tokens.filter(t => !t.used).length}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Recent Activity */}
              <div className="bg-white rounded-lg shadow-sm border">
                <div className="p-4 lg:p-6 border-b border-gray-200">
                  <h3 className="text-lg font-medium text-gray-900">Aktivitas Terbaru</h3>
                </div>
                <div className="p-4 lg:p-6">
                  <div className="space-y-4">
                    {results.slice(0, 5).map(result => (
                      <div key={result.id} className="flex items-center justify-between py-2">
                        <div className="flex items-center">
                          <div className="flex-shrink-0">
                            <div className="h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center">
                              <Trophy className="h-4 w-4 text-blue-600" />
                            </div>
                          </div>
                          <div className="ml-3">
                            <p className="text-sm font-medium text-gray-900">{result.studentName}</p>
                            <p className="text-sm text-gray-500">
                              Menyelesaikan ujian {getTypeText(result.examType)} - 
                              Nilai: {result.score}/{result.totalQuestions}
                            </p>
                          </div>
                        </div>
                        <div className="text-sm text-gray-500">
                          {new Date(result.completedAt).toLocaleDateString()}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Students Tab */}
          {activeTab === 'students' && (
            <div className="space-y-4">
              {/* Desktop Table */}
              <div className="hidden lg:block bg-white rounded-lg shadow-sm border overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-medium text-gray-900">Daftar Siswa</h3>
                    <div className="flex items-center space-x-3">
                      <input
                        type="text"
                        placeholder="Cari siswa..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                      <select
                        value={filterType}
                        onChange={(e) => setFilterType(e.target.value)}
                        className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="all">Semua Status</option>
                        <option value="active">Aktif</option>
                        <option value="completed">Selesai</option>
                        <option value="disconnected">Terputus</option>
                      </select>
                    </div>
                  </div>
                </div>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nama</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Token</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ujian</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Progress</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredStudents.map(student => {
                        const timeSpent = student.endTime ? student.endTime - student.startTime : Date.now() - student.startTime;
                        const timeSpentMinutes = Math.round(timeSpent / 60000);
                        
                        return (
                          <tr key={student.id}>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm font-medium text-gray-900">{student.name}</div>
                              <div className="text-sm text-gray-500">{timeSpentMinutes} menit</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className="font-mono text-sm">{student.token}</span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`px-2 py-1 text-xs font-medium rounded-full ${getTypeColor(student.examType)}`}>
                                {getTypeText(student.examType)}
                              </span>
                              <div className="text-xs text-gray-500 mt-1">
                                {examCategories.find(c => c.id === student.examCategory)?.name || student.examCategory}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                                student.status === 'active' ? 'bg-green-100 text-green-800' :
                                student.status === 'completed' ? 'bg-blue-100 text-blue-800' :
                                'bg-red-100 text-red-800'
                              }`}>
                                {student.status === 'active' ? 'Aktif' :
                                 student.status === 'completed' ? 'Selesai' : 'Terputus'}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              Soal {student.currentQuestion + 1}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                              <button
                                onClick={() => handleDeleteStudent(student.id)}
                                className="text-red-600 hover:text-red-900 transition-colors"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Mobile Cards */}
              <div className="lg:hidden space-y-3">
                {filteredStudents.map(student => (
                  <MobileStudentCard key={student.id} student={student} />
                ))}
              </div>

              {filteredStudents.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  Tidak ada siswa yang ditemukan
                </div>
              )}
            </div>
          )}

          {/* Questions Tab */}
          {activeTab === 'questions' && (
            <div className="space-y-4">
              {/* Add Question Button */}
              <div className="flex justify-between items-center">
                <div className="hidden lg:block">
                  <h3 className="text-lg font-medium text-gray-900">Bank Soal</h3>
                </div>
                <button
                  onClick={() => setShowAddQuestion(true)}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Tambah Soal
                </button>
              </div>

              {/* Desktop Table */}
              <div className="hidden lg:block bg-white rounded-lg shadow-sm border overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-gray-600">
                      Menampilkan {Math.min(50, filteredQuestions.length)} dari {questions.length} soal
                    </p>
                    <div className="flex items-center space-x-3">
                      <input
                        type="text"
                        placeholder="Cari soal..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                      <select
                        value={filterType}
                        onChange={(e) => setFilterType(e.target.value)}
                        className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="all">Semua Jenis</option>
                        <option value="hiragana">Hiragana</option>
                        <option value="katakana">Katakana</option>
                        <option value="vocabulary">Vocabulary</option>
                        <option value="grammar">Grammar</option>
                        <option value="kanji">Kanji</option>
                      </select>
                    </div>
                  </div>
                </div>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Karakter/Soal</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Jenis</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Kategori</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tingkat</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Jawaban Benar</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredQuestions.slice(0, 50).map(question => (
                        <tr key={question.id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <span className="text-2xl font-bold mr-3">{question.character}</span>
                              <div>
                                <div className="text-sm font-medium text-gray-900">
                                  {question.question || 'Pilih romaji yang benar'}
                                </div>
                                <div className="text-sm text-gray-500">
                                  {question.options.join(', ')}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${getTypeColor(question.type)}`}>
                              {getTypeText(question.type)}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {question.category}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${getDifficultyColor(question.difficulty)}`}>
                              {getDifficultyText(question.difficulty)}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {question.options[question.correctAnswer]}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <div className="flex space-x-2">
                              <button
                                onClick={() => setEditingQuestion(question)}
                                className="text-blue-600 hover:text-blue-900 transition-colors"
                                title="Edit soal"
                              >
                                <Edit3 className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => handleDeleteQuestion(question.id)}
                                className="text-red-600 hover:text-red-900 transition-colors disabled:opacity-50"
                                disabled={!ExamService.isCustomQuestion(question.id)}
                                title={ExamService.isCustomQuestion(question.id) ? "Hapus soal" : "Soal bawaan tidak dapat dihapus"}
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Mobile Cards */}
              <div className="lg:hidden space-y-3">
                {filteredQuestions.slice(0, 50).map(question => (
                  <MobileQuestionCard key={question.id} question={question} />
                ))}
              </div>

              {filteredQuestions.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  Tidak ada soal yang ditemukan
                </div>
              )}
            </div>
          )}

          {/* Results Tab */}
          {activeTab === 'results' && (
            <div className="space-y-4">
              {/* Export Buttons */}
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
                <button
                  onClick={() => exportToCSV(results)}
                  className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Export CSV
                </button>
                <button
                  onClick={() => exportDetailedToCSV(results)}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Export Detail
                </button>
              </div>

              {/* Desktop Table */}
              <div className="hidden lg:block bg-white rounded-lg shadow-sm border overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-medium text-gray-900">Hasil Ujian</h3>
                    <div className="flex items-center space-x-3">
                      <input
                        type="text"
                        placeholder="Cari hasil..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                      <select
                        value={filterType}
                        onChange={(e) => setFilterType(e.target.value)}
                        className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="all">Semua Jenis</option>
                        <option value="hiragana">Hiragana</option>
                        <option value="katakana">Katakana</option>
                        <option value="vocabulary">Vocabulary</option>
                        <option value="grammar">Grammar</option>
                        <option value="kanji">Kanji</option>
                      </select>
                    </div>
                  </div>
                </div>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Siswa</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ujian</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nilai</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Persentase</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Waktu</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredResults.map(result => {
                        const percentage = Math.round((result.score / result.totalQuestions) * 100);
                        const passed = percentage >= 70;
                        
                        return (
                          <tr key={result.id}>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm font-medium text-gray-900">{result.studentName}</div>
                              <div className="text-sm text-gray-500">{new Date(result.completedAt).toLocaleDateString()}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`px-2 py-1 text-xs font-medium rounded-full ${getTypeColor(result.examType)}`}>
                                {getTypeText(result.examType)}
                              </span>
                              <div className="text-xs text-gray-500 mt-1">
                                {examCategories.find(c => c.id === result.examCategory)?.name || result.examCategory}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {result.score}/{result.totalQuestions}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                                passed ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                              }`}>
                                {percentage}%
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {Math.round(result.timeSpent / 60000)} menit
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                                passed ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                              }`}>
                                {passed ? 'LULUS' : 'TIDAK LULUS'}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                              <button
                                onClick={() => handleDeleteResult(result.id)}
                                className="text-red-600 hover:text-red-900 transition-colors"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Mobile Cards */}
              <div className="lg:hidden space-y-3">
                {filteredResults.map(result => (
                  <MobileResultCard key={result.id} result={result} />
                ))}
              </div>

              {filteredResults.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  Tidak ada hasil ujian yang ditemukan
                </div>
              )}
            </div>
          )}

          {/* Tokens Tab */}
          {activeTab === 'tokens' && (
            <div className="space-y-4">
              {/* Generate Token Button */}
              <div className="flex justify-between items-center">
                <div className="hidden lg:block">
                  <h3 className="text-lg font-medium text-gray-900">Manajemen Token</h3>
                </div>
                <button
                  onClick={() => setShowTokenForm(true)}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Buat Token
                </button>
              </div>

              {/* Desktop Table */}
              <div className="hidden lg:block bg-white rounded-lg shadow-sm border overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-gray-600">
                      Total: {tokens.length} token | Tersedia: {tokens.filter(t => !t.used).length} | Digunakan: {tokens.filter(t => t.used).length}
                    </p>
                    <div className="flex items-center space-x-3">
                      <input
                        type="text"
                        placeholder="Cari token..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                      <select
                        value={filterType}
                        onChange={(e) => setFilterType(e.target.value)}
                        className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="all">Semua Jenis</option>
                        <option value="hiragana">Hiragana</option>
                        <option value="katakana">Katakana</option>
                        <option value="vocabulary">Vocabulary</option>
                        <option value="grammar">Grammar</option>
                        <option value="kanji">Kanji</option>
                      </select>
                    </div>
                  </div>
                </div>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Token</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Jenis Ujian</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Kategori</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tingkat</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Dibuat</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredTokens.map(token => (
                        <tr key={token.token}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="font-mono text-lg font-bold">{token.token}</span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${getTypeColor(token.examType)}`}>
                              {getTypeText(token.examType)}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {examCategories.find(c => c.id === token.examCategory)?.name || token.examCategory}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${getDifficultyColor(token.difficulty)}`}>
                              {getDifficultyText(token.difficulty)}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                              token.used ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                            }`}>
                              {token.used ? 'Digunakan' : 'Tersedia'}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {new Date(token.createdAt).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <button
                              onClick={() => handleDeleteToken(token.token)}
                              className="text-red-600 hover:text-red-900 transition-colors"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Mobile Cards */}
              <div className="lg:hidden space-y-3">
                {filteredTokens.map(token => (
                  <MobileTokenCard key={token.token} token={token} />
                ))}
              </div>

              {filteredTokens.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  Tidak ada token yang ditemukan
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      {showPasswordChange && currentAdmin && (
        <AdminPasswordChange
          username={currentAdmin.username}
          onClose={() => setShowPasswordChange(false)}
          onSuccess={() => {
            setShowPasswordChange(false);
            handleLogout();
          }}
        />
      )}

      {/* Add Question Modal */}
      {showAddQuestion && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-gray-900">Tambah Soal Baru</h3>
              <button
                onClick={() => setShowAddQuestion(false)}
                className="text-gray-500 hover:text-gray-700 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Jenis Ujian</label>
                  <select
                    value={newQuestion.type}
                    onChange={(e) => setNewQuestion({...newQuestion, type: e.target.value as ExamType})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="hiragana">Hiragana</option>
                    <option value="katakana">Katakana</option>
                    <option value="vocabulary">Vocabulary</option>
                    <option value="grammar">Grammar</option>
                    <option value="kanji">Kanji</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Kategori</label>
                  <select
                    value={newQuestion.category}
                    onChange={(e) => setNewQuestion({...newQuestion, category: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    {examCategories
                      .filter(cat => cat.type === newQuestion.type)
                      .map(cat => (
                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                      ))
                    }
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Karakter</label>
                  <input
                    type="text"
                    value={newQuestion.character}
                    onChange={(e) => setNewQuestion({...newQuestion, character: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="あ, ア, 人, dll"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Tingkat Kesulitan</label>
                  <select
                    value={newQuestion.difficulty}
                    onChange={(e) => setNewQuestion({...newQuestion, difficulty: e.target.value as 'beginner' | 'intermediate' | 'advanced'})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="beginner">Siswa Baru</option>
                    <option value="intermediate">Siswa Menengah</option>
                    <option value="advanced">Siswa Akhir</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Pertanyaan (opsional)</label>
                <input
                  type="text"
                  value={newQuestion.question}
                  onChange={(e) => setNewQuestion({...newQuestion, question: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Apa bacaan romaji dari karakter ini?"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Pilihan Jawaban</label>
                <div className="grid grid-cols-2 gap-3">
                  {newQuestion.options?.map((option, index) => (
                    <div key={index}>
                      <input
                        type="text"
                        value={option}
                        onChange={(e) => {
                          const newOptions = [...(newQuestion.options || ['', '', '', ''])];
                          newOptions[index] = e.target.value;
                          setNewQuestion({...newQuestion, options: newOptions});
                        }}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder={`Pilihan ${index + 1}`}
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Jawaban Benar</label>
                <select
                  value={newQuestion.correctAnswer}
                  onChange={(e) => setNewQuestion({...newQuestion, correctAnswer: parseInt(e.target.value)})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  {newQuestion.options?.map((option, index) => (
                    <option key={index} value={index}>
                      Pilihan {index + 1}: {option}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex space-x-3 mt-6">
              <button
                onClick={() => setShowAddQuestion(false)}
                className="flex-1 px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Batal
              </button>
              <button
                onClick={handleAddQuestion}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Tambah Soal
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Question Modal */}
      {editingQuestion && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-gray-900">Edit Soal</h3>
              <button
                onClick={() => setEditingQuestion(null)}
                className="text-gray-500 hover:text-gray-700 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Jenis Ujian</label>
                  <select
                    value={editingQuestion.type}
                    onChange={(e) => setEditingQuestion({...editingQuestion, type: e.target.value as ExamType})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="hiragana">Hiragana</option>
                    <option value="katakana">Katakana</option>
                    <option value="vocabulary">Vocabulary</option>
                    <option value="grammar">Grammar</option>
                    <option value="kanji">Kanji</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Kategori</label>
                  <select
                    value={editingQuestion.category}
                    onChange={(e) => setEditingQuestion({...editingQuestion, category: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    {examCategories
                      .filter(cat => cat.type === editingQuestion.type)
                      .map(cat => (
                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                      ))
                    }
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Karakter</label>
                  <input
                    type="text"
                    value={editingQuestion.character}
                    onChange={(e) => setEditingQuestion({...editingQuestion, character: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Tingkat Kesulitan</label>
                  <select
                    value={editingQuestion.difficulty}
                    onChange={(e) => setEditingQuestion({...editingQuestion, difficulty: e.target.value as 'beginner' | 'intermediate' | 'advanced'})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="beginner">Siswa Baru</option>
                    <option value="intermediate">Siswa Menengah</option>
                    <option value="advanced">Siswa Akhir</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Pertanyaan</label>
                <input
                  type="text"
                  value={editingQuestion.question || ''}
                  onChange={(e) => setEditingQuestion({...editingQuestion, question: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Pilihan Jawaban</label>
                <div className="grid grid-cols-2 gap-3">
                  {editingQuestion.options.map((option, index) => (
                    <div key={index}>
                      <input
                        type="text"
                        value={option}
                        onChange={(e) => {
                          const newOptions = [...editingQuestion.options];
                          newOptions[index] = e.target.value;
                          setEditingQuestion({...editingQuestion, options: newOptions});
                        }}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder={`Pilihan ${index + 1}`}
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Jawaban Benar</label>
                <select
                  value={editingQuestion.correctAnswer}
                  onChange={(e) => setEditingQuestion({...editingQuestion, correctAnswer: parseInt(e.target.value)})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  {editingQuestion.options.map((option, index) => (
                    <option key={index} value={index}>
                      Pilihan {index + 1}: {option}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex space-x-3 mt-6">
              <button
                onClick={() => setEditingQuestion(null)}
                className="flex-1 px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Batal
              </button>
              <button
                onClick={handleUpdateQuestion}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Simpan Perubahan
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Generate Token Modal */}
      {showTokenForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-gray-900">Buat Token Baru</h3>
              <button
                onClick={() => setShowTokenForm(false)}
                className="text-gray-500 hover:text-gray-700 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Jenis Ujian</label>
                <select
                  value={tokenForm.examType}
                  onChange={(e) => {
                    const newType = e.target.value as ExamType;
                    const firstCategory = examCategories.find(cat => cat.type === newType);
                    setTokenForm({
                      ...tokenForm,
                      examType: newType,
                      examCategory: firstCategory?.id || 'hiragana-basic'
                    });
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="hiragana">Hiragana</option>
                  <option value="katakana">Katakana</option>
                  <option value="vocabulary">Vocabulary</option>
                  <option value="grammar">Grammar</option>
                  <option value="kanji">Kanji</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Kategori Ujian</label>
                <select
                  value={tokenForm.examCategory}
                  onChange={(e) => setTokenForm({...tokenForm, examCategory: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  {examCategories
                    .filter(cat => cat.type === tokenForm.examType)
                    .map(cat => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))
                  }
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Tingkat Kesulitan</label>
                <select
                  value={tokenForm.difficulty}
                  onChange={(e) => setTokenForm({...tokenForm, difficulty: e.target.value as 'beginner' | 'intermediate' | 'advanced'})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="beginner">Siswa Baru</option>
                  <option value="intermediate">Siswa Menengah</option>
                  <option value="advanced">Siswa Akhir</option>
                </select>
              </div>

              {/* Category Info */}
              {(() => {
                const categoryInfo = examCategories.find(cat => cat.id === tokenForm.examCategory);
                if (categoryInfo) {
                  return (
                    <div className="p-3 bg-blue-50 rounded-lg">
                      <p className="text-sm text-blue-800">
                        <strong>Info Ujian:</strong>
                      </p>
                      <ul className="text-sm text-blue-700 mt-1 space-y-1">
                        <li>• {categoryInfo.description}</li>
                        <li>• Waktu: {categoryInfo.timeLimit} menit</li>
                        <li>• Jumlah soal: {categoryInfo.questionCount}</li>
                        {categoryInfo.chapters && (
                          <li>• Bab: {categoryInfo.chapters.join(', ')}</li>
                        )}
                      </ul>
                    </div>
                  );
                }
                return null;
              })()}
            </div>

            <div className="flex space-x-3 mt-6">
              <button
                onClick={() => setShowTokenForm(false)}
                className="flex-1 px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Batal
              </button>
              <button
                onClick={handleGenerateToken}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Buat Token
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;