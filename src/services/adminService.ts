import { supabase } from '../lib/supabase';

export interface AdminUser {
  id: string;
  username: string;
  lastLogin?: Date;
}

export interface LoginResult {
  success: boolean;
  admin?: AdminUser;
  error?: string;
}

export interface PasswordChangeResult {
  success: boolean;
  message?: string;
  error?: string;
}

export class AdminService {
  // Admin login with database verification
  static async login(username: string, password: string): Promise<LoginResult> {
    try {
      const { data, error } = await supabase
        .rpc('verify_admin_login', {
          input_username: username,
          input_password: password
        });

      if (error) {
        console.error('Admin login error:', error);
        return { success: false, error: 'Login failed. Please try again.' };
      }

      if (data.success) {
        const admin: AdminUser = {
          id: data.admin_id,
          username: data.username,
          lastLogin: data.last_login ? new Date(data.last_login) : undefined
        };

        // Store admin session
        localStorage.setItem('admin_session', JSON.stringify({
          adminId: admin.id,
          username: admin.username,
          loginTime: new Date().toISOString()
        }));

        return { success: true, admin };
      } else {
        return { success: false, error: data.error || 'Invalid username or password' };
      }
    } catch (error) {
      console.error('Admin login error:', error);
      return { success: false, error: 'Connection error. Please try again.' };
    }
  }

  // Change admin password
  static async changePassword(
    username: string, 
    currentPassword: string, 
    newPassword: string
  ): Promise<PasswordChangeResult> {
    try {
      // Validate new password
      if (newPassword.length < 8) {
        return { success: false, error: 'Password harus minimal 8 karakter' };
      }

      if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(newPassword)) {
        return { 
          success: false, 
          error: 'Password harus mengandung huruf besar, huruf kecil, dan angka' 
        };
      }

      const { data, error } = await supabase
        .rpc('change_admin_password', {
          input_username: username,
          current_password: currentPassword,
          new_password: newPassword
        });

      if (error) {
        console.error('Password change error:', error);
        return { success: false, error: 'Gagal mengubah password. Silakan coba lagi.' };
      }

      if (data.success) {
        return { success: true, message: data.message };
      } else {
        return { success: false, error: data.error };
      }
    } catch (error) {
      console.error('Password change error:', error);
      return { success: false, error: 'Terjadi kesalahan. Silakan coba lagi.' };
    }
  }

  // Check if admin is logged in
  static isLoggedIn(): boolean {
    const session = localStorage.getItem('admin_session');
    if (!session) return false;

    try {
      const sessionData = JSON.parse(session);
      const loginTime = new Date(sessionData.loginTime);
      const now = new Date();
      const hoursDiff = (now.getTime() - loginTime.getTime()) / (1000 * 60 * 60);

      // Session expires after 8 hours
      if (hoursDiff > 8) {
        this.logout();
        return false;
      }

      return true;
    } catch {
      this.logout();
      return false;
    }
  }

  // Get current admin session
  static getCurrentAdmin(): AdminUser | null {
    const session = localStorage.getItem('admin_session');
    if (!session) return null;

    try {
      const sessionData = JSON.parse(session);
      return {
        id: sessionData.adminId,
        username: sessionData.username
      };
    } catch {
      return null;
    }
  }

  // Logout admin
  static logout(): void {
    localStorage.removeItem('admin_session');
  }

  // Add new admin user (for super admin functionality)
  static async addAdminUser(username: string, password: string): Promise<PasswordChangeResult> {
    try {
      const { data, error } = await supabase
        .rpc('add_admin_user', {
          input_username: username,
          input_password: password
        });

      if (error) {
        console.error('Add admin error:', error);
        return { success: false, error: 'Gagal menambahkan admin. Silakan coba lagi.' };
      }

      if (data.success) {
        return { success: true, message: 'Admin berhasil ditambahkan' };
      } else {
        return { success: false, error: data.error };
      }
    } catch (error) {
      console.error('Add admin error:', error);
      return { success: false, error: 'Terjadi kesalahan. Silakan coba lagi.' };
    }
  }

  // Test database connection
  static async testConnection(): Promise<boolean> {
    try {
      const { data, error } = await supabase
        .from('admin_users')
        .select('count')
        .limit(1);

      return !error;
    } catch (error) {
      console.error('Admin connection test failed:', error);
      return false;
    }
  }
}