// User-friendly error messages in Indonesian
export const getErrorMessage = (error: unknown): string => {
  if (typeof error === 'string') {
    return translateError(error);
  }
  
  if (error instanceof Error) {
    return translateError(error.message);
  }
  
  return 'Terjadi kesalahan yang tidak diketahui. Silakan coba lagi.';
};

const translateError = (errorMessage: string): string => {
  const message = errorMessage.toLowerCase();
  
  // Database connection errors
  if (message.includes('connection') || message.includes('network') || message.includes('fetch')) {
    return 'Koneksi ke database bermasalah. Periksa koneksi internet Anda.';
  }
  
  // Token related errors
  if (message.includes('token')) {
    if (message.includes('not found') || message.includes('invalid')) {
      return 'Token tidak valid atau sudah digunakan.';
    }
    if (message.includes('generate') || message.includes('create')) {
      return 'Gagal membuat token. Silakan coba lagi.';
    }
    if (message.includes('delete')) {
      return 'Gagal menghapus token. Silakan coba lagi.';
    }
    return 'Terjadi masalah dengan token. Silakan coba lagi.';
  }
  
  // Student related errors
  if (message.includes('student')) {
    if (message.includes('not found')) {
      return 'Data siswa tidak ditemukan.';
    }
    if (message.includes('create')) {
      return 'Gagal mendaftarkan siswa. Silakan coba lagi.';
    }
    if (message.includes('delete')) {
      return 'Gagal menghapus data siswa. Silakan coba lagi.';
    }
    if (message.includes('update')) {
      return 'Gagal memperbarui data siswa. Silakan coba lagi.';
    }
    return 'Terjadi masalah dengan data siswa. Silakan coba lagi.';
  }
  
  // Question related errors
  if (message.includes('question')) {
    if (message.includes('add') || message.includes('create')) {
      return 'Gagal menambahkan soal. Silakan coba lagi.';
    }
    if (message.includes('update') || message.includes('edit')) {
      return 'Gagal memperbarui soal. Silakan coba lagi.';
    }
    if (message.includes('delete')) {
      return 'Gagal menghapus soal. Silakan coba lagi.';
    }
    return 'Terjadi masalah dengan bank soal. Silakan coba lagi.';
  }
  
  // Exam result related errors
  if (message.includes('result') || message.includes('exam')) {
    if (message.includes('save')) {
      return 'Gagal menyimpan hasil ujian. Silakan coba lagi.';
    }
    if (message.includes('delete')) {
      return 'Gagal menghapus hasil ujian. Silakan coba lagi.';
    }
    return 'Terjadi masalah dengan hasil ujian. Silakan coba lagi.';
  }
  
  // Session related errors
  if (message.includes('session')) {
    return 'Terjadi masalah dengan sesi ujian. Silakan refresh halaman.';
  }
  
  // Authentication errors
  if (message.includes('auth') || message.includes('login') || message.includes('password')) {
    return 'Login gagal. Periksa password Anda.';
  }
  
  // Permission errors
  if (message.includes('permission') || message.includes('unauthorized') || message.includes('forbidden')) {
    return 'Anda tidak memiliki izin untuk melakukan tindakan ini.';
  }
  
  // Validation errors
  if (message.includes('required') || message.includes('invalid') || message.includes('format')) {
    return 'Data yang dimasukkan tidak valid. Periksa kembali form Anda.';
  }
  
  // SQL/Database specific errors
  if (message.includes('sql') || message.includes('syntax') || message.includes('constraint')) {
    return 'Terjadi kesalahan sistem. Silakan hubungi administrator.';
  }
  
  // Generic fallback
  return 'Terjadi kesalahan. Silakan coba lagi.';
};

export const getSuccessMessage = (action: string, item: string): string => {
  const actions: Record<string, string> = {
    create: 'berhasil dibuat',
    add: 'berhasil ditambahkan',
    update: 'berhasil diperbarui',
    delete: 'berhasil dihapus',
    save: 'berhasil disimpan',
    generate: 'berhasil dibuat',
    submit: 'berhasil dikirim',
    complete: 'berhasil diselesaikan',
  };
  
  const items: Record<string, string> = {
    token: 'Token',
    student: 'Data siswa',
    question: 'Soal',
    result: 'Hasil ujian',
    exam: 'Ujian',
    session: 'Sesi',
  };
  
  const actionText = actions[action.toLowerCase()] || 'berhasil diproses';
  const itemText = items[item.toLowerCase()] || item;
  
  return `${itemText} ${actionText}.`;
};