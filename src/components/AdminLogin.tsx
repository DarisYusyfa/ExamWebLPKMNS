import React, { useState } from 'react';
import { Shield, Eye, EyeOff, Lock, User, AlertCircle, CheckCircle } from 'lucide-react';
import { AdminService } from '../services/adminService';

interface AdminLoginProps {
  onLogin: (username: string) => void;
}

const AdminLogin: React.FC<AdminLoginProps> = ({ onLogin }) => {
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);
    
    try {
      const result = await AdminService.login(username, password);
      
      if (result.success && result.admin) {
        setSuccess('Login berhasil! Mengalihkan ke dashboard...');
        setTimeout(() => {
          onLogin(result.admin!.username);
        }, 1000);
      } else {
        setError(result.error || 'Login gagal');
      }
    } catch (error) {
      console.error('Login error:', error);
      setError('Terjadi kesalahan sistem. Silakan coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <Shield className="h-12 w-12 text-slate-600 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-gray-900">Admin Login</h1>
          <p className="text-gray-600 mt-2">Sistem Manajemen Ujian</p>
          <p className="text-sm text-slate-500 mt-1">LPK Matahari Nusantara Sentosa</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <User className="inline h-4 w-4 mr-2" />
              Username
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => {
                setUsername(e.target.value);
                setError('');
                setSuccess('');
              }}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-slate-500 transition-colors"
              placeholder="Masukkan username"
              required
              disabled={loading}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Lock className="inline h-4 w-4 mr-2" />
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError('');
                  setSuccess('');
                }}
                className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-slate-500 transition-colors"
                placeholder="Masukkan password"
                required
                disabled={loading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                disabled={loading}
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
          </div>

          {error && (
            <div className="flex items-center p-3 bg-red-50 border border-red-200 rounded-lg">
              <AlertCircle className="h-5 w-5 text-red-600 mr-2" />
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}

          {success && (
            <div className="flex items-center p-3 bg-green-50 border border-green-200 rounded-lg">
              <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
              <p className="text-green-700 text-sm">{success}</p>
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-slate-600 text-white py-3 rounded-lg hover:bg-slate-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={loading}
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Memverifikasi...
              </div>
            ) : (
              'Login'
            )}
          </button>
        </form>

        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <p className="text-sm text-blue-800">
            <strong>Informasi Login:</strong>
          </p>
          <ul className="text-sm text-blue-700 mt-2 space-y-1">
            <li>• Username default: <code className="bg-blue-100 px-1 rounded">admin</code></li>
            <li>• Password telah diperbarui untuk keamanan</li>
            <li>• Sesi login berlaku selama 8 jam</li>
            <li>• Hubungi administrator untuk reset password</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;