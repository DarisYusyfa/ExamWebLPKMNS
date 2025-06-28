import React, { useState } from 'react';
import { Lock, Eye, EyeOff, Save, X, AlertCircle, CheckCircle, Shield } from 'lucide-react';
import { AdminService } from '../services/adminService';

interface AdminPasswordChangeProps {
  username: string;
  onClose: () => void;
  onSuccess: () => void;
}

const AdminPasswordChange: React.FC<AdminPasswordChangeProps> = ({ 
  username, 
  onClose, 
  onSuccess 
}) => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const validatePassword = (password: string): string[] => {
    const errors: string[] = [];
    
    if (password.length < 8) {
      errors.push('Minimal 8 karakter');
    }
    
    if (!/(?=.*[a-z])/.test(password)) {
      errors.push('Harus mengandung huruf kecil');
    }
    
    if (!/(?=.*[A-Z])/.test(password)) {
      errors.push('Harus mengandung huruf besar');
    }
    
    if (!/(?=.*\d)/.test(password)) {
      errors.push('Harus mengandung angka');
    }
    
    if (!/(?=.*[!@#$%^&*(),.?":{}|<>])/.test(password)) {
      errors.push('Disarankan mengandung karakter khusus');
    }
    
    return errors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Validate inputs
    if (!currentPassword || !newPassword || !confirmPassword) {
      setError('Semua field harus diisi');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Password baru dan konfirmasi password tidak cocok');
      return;
    }

    if (currentPassword === newPassword) {
      setError('Password baru harus berbeda dari password saat ini');
      return;
    }

    const passwordErrors = validatePassword(newPassword);
    if (passwordErrors.length > 0) {
      setError('Password tidak memenuhi kriteria: ' + passwordErrors.join(', '));
      return;
    }

    setLoading(true);

    try {
      const result = await AdminService.changePassword(username, currentPassword, newPassword);
      
      if (result.success) {
        setSuccess('Password berhasil diubah! Anda akan logout otomatis dalam 3 detik...');
        setTimeout(() => {
          AdminService.logout();
          onSuccess();
        }, 3000);
      } else {
        setError(result.error || 'Gagal mengubah password');
      }
    } catch (error) {
      console.error('Password change error:', error);
      setError('Terjadi kesalahan sistem. Silakan coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  const passwordStrength = (password: string): { score: number; text: string; color: string } => {
    const errors = validatePassword(password);
    const score = Math.max(0, 5 - errors.length);
    
    if (score <= 1) return { score, text: 'Sangat Lemah', color: 'text-red-600' };
    if (score <= 2) return { score, text: 'Lemah', color: 'text-orange-600' };
    if (score <= 3) return { score, text: 'Sedang', color: 'text-yellow-600' };
    if (score <= 4) return { score, text: 'Kuat', color: 'text-blue-600' };
    return { score, text: 'Sangat Kuat', color: 'text-green-600' };
  };

  const strength = passwordStrength(newPassword);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <Shield className="h-6 w-6 text-slate-600 mr-2" />
            <h3 className="text-xl font-semibold text-gray-900">Ubah Password</h3>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
            disabled={loading}
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-800">
            <strong>Username:</strong> {username}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Current Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Lock className="inline h-4 w-4 mr-2" />
              Password Saat Ini
            </label>
            <div className="relative">
              <input
                type={showCurrentPassword ? 'text' : 'password'}
                value={currentPassword}
                onChange={(e) => {
                  setCurrentPassword(e.target.value);
                  setError('');
                  setSuccess('');
                }}
                className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-slate-500 transition-colors"
                placeholder="Masukkan password saat ini"
                required
                disabled={loading}
              />
              <button
                type="button"
                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                disabled={loading}
              >
                {showCurrentPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
          </div>

          {/* New Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Lock className="inline h-4 w-4 mr-2" />
              Password Baru
            </label>
            <div className="relative">
              <input
                type={showNewPassword ? 'text' : 'password'}
                value={newPassword}
                onChange={(e) => {
                  setNewPassword(e.target.value);
                  setError('');
                  setSuccess('');
                }}
                className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-slate-500 transition-colors"
                placeholder="Masukkan password baru"
                required
                disabled={loading}
              />
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                disabled={loading}
              >
                {showNewPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
            
            {/* Password Strength Indicator */}
            {newPassword && (
              <div className="mt-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Kekuatan Password:</span>
                  <span className={`font-medium ${strength.color}`}>{strength.text}</span>
                </div>
                <div className="mt-1 bg-gray-200 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full transition-all duration-300 ${
                      strength.score <= 1 ? 'bg-red-500' :
                      strength.score <= 2 ? 'bg-orange-500' :
                      strength.score <= 3 ? 'bg-yellow-500' :
                      strength.score <= 4 ? 'bg-blue-500' : 'bg-green-500'
                    }`}
                    style={{ width: `${(strength.score / 5) * 100}%` }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Lock className="inline h-4 w-4 mr-2" />
              Konfirmasi Password Baru
            </label>
            <div className="relative">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  setError('');
                  setSuccess('');
                }}
                className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-slate-500 transition-colors"
                placeholder="Konfirmasi password baru"
                required
                disabled={loading}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                disabled={loading}
              >
                {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
            
            {/* Password Match Indicator */}
            {confirmPassword && (
              <div className="mt-1 text-sm">
                {newPassword === confirmPassword ? (
                  <span className="text-green-600">✓ Password cocok</span>
                ) : (
                  <span className="text-red-600">✗ Password tidak cocok</span>
                )}
              </div>
            )}
          </div>

          {/* Error/Success Messages */}
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

          {/* Password Requirements */}
          <div className="p-3 bg-gray-50 rounded-lg">
            <p className="text-sm font-medium text-gray-700 mb-2">Syarat Password:</p>
            <ul className="text-xs text-gray-600 space-y-1">
              <li>• Minimal 8 karakter</li>
              <li>• Mengandung huruf besar (A-Z)</li>
              <li>• Mengandung huruf kecil (a-z)</li>
              <li>• Mengandung angka (0-9)</li>
              <li>• Disarankan mengandung karakter khusus (!@#$%^&*)</li>
            </ul>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors font-medium"
              disabled={loading}
            >
              Batal
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-3 bg-slate-600 text-white rounded-lg hover:bg-slate-700 disabled:opacity-50 transition-colors font-medium"
              disabled={loading || !currentPassword || !newPassword || !confirmPassword || newPassword !== confirmPassword}
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Mengubah...
                </div>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2 inline" />
                  Ubah Password
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminPasswordChange;