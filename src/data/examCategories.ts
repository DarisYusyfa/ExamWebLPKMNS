import { ExamCategory } from '../types';

export const examCategories: ExamCategory[] = [
  // Hiragana Categories
  {
    id: 'hiragana-basic',
    name: 'Hiragana Dasar',
    description: 'Ujian hiragana untuk siswa baru (あ-の)',
    type: 'hiragana',
    difficulty: 'beginner',
    timeLimit: 20,
    questionCount: 15
  },
  {
    id: 'hiragana-intermediate',
    name: 'Hiragana Menengah',
    description: 'Ujian hiragana untuk siswa menengah (は-ん)',
    type: 'hiragana',
    difficulty: 'intermediate',
    timeLimit: 25,
    questionCount: 20
  },
  {
    id: 'hiragana-advanced',
    name: 'Hiragana Lengkap',
    description: 'Ujian hiragana lengkap untuk siswa akhir',
    type: 'hiragana',
    difficulty: 'advanced',
    timeLimit: 30,
    questionCount: 30
  },

  // Katakana Categories
  {
    id: 'katakana-basic',
    name: 'Katakana Dasar',
    description: 'Ujian katakana untuk siswa baru (ア-ノ)',
    type: 'katakana',
    difficulty: 'beginner',
    timeLimit: 20,
    questionCount: 15
  },
  {
    id: 'katakana-intermediate',
    name: 'Katakana Menengah',
    description: 'Ujian katakana untuk siswa menengah (ハ-ン)',
    type: 'katakana',
    difficulty: 'intermediate',
    timeLimit: 25,
    questionCount: 20
  },
  {
    id: 'katakana-advanced',
    name: 'Katakana Lengkap',
    description: 'Ujian katakana lengkap untuk siswa akhir',
    type: 'katakana',
    difficulty: 'advanced',
    timeLimit: 30,
    questionCount: 30
  },

  // Vocabulary Categories by Chapters
  {
    id: 'vocabulary-ch1-2',
    name: 'Kosakata Bab 1-2',
    description: 'Kosakata dasar: salam, perkenalan, angka',
    type: 'vocabulary',
    difficulty: 'beginner',
    chapters: ['1', '2'],
    timeLimit: 25,
    questionCount: 20
  },
  {
    id: 'vocabulary-ch3-5',
    name: 'Kosakata Bab 3-5',
    description: 'Kosakata: tempat, waktu, kegiatan sehari-hari',
    type: 'vocabulary',
    difficulty: 'beginner',
    chapters: ['3', '4', '5'],
    timeLimit: 30,
    questionCount: 25
  },
  {
    id: 'vocabulary-ch6-8',
    name: 'Kosakata Bab 6-8',
    description: 'Kosakata: makanan, minuman, berbelanja',
    type: 'vocabulary',
    difficulty: 'beginner',
    chapters: ['6', '7', '8'],
    timeLimit: 30,
    questionCount: 25
  },
  {
    id: 'vocabulary-ch9-12',
    name: 'Kosakata Bab 9-12',
    description: 'Kosakata: hobi, keluarga, pekerjaan',
    type: 'vocabulary',
    difficulty: 'intermediate',
    chapters: ['9', '10', '11', '12'],
    timeLimit: 35,
    questionCount: 30
  },
  {
    id: 'vocabulary-ch13-16',
    name: 'Kosakata Bab 13-16',
    description: 'Kosakata: keinginan, permintaan, cuaca',
    type: 'vocabulary',
    difficulty: 'intermediate',
    chapters: ['13', '14', '15', '16'],
    timeLimit: 35,
    questionCount: 30
  },
  {
    id: 'vocabulary-ch17-20',
    name: 'Kosakata Bab 17-20',
    description: 'Kosakata: bentuk, warna, pengalaman',
    type: 'vocabulary',
    difficulty: 'intermediate',
    chapters: ['17', '18', '19', '20'],
    timeLimit: 40,
    questionCount: 35
  },
  {
    id: 'vocabulary-ch21-25',
    name: 'Kosakata Bab 21-25',
    description: 'Kosakata: pendapat, rencana, kondisi',
    type: 'vocabulary',
    difficulty: 'advanced',
    chapters: ['21', '22', '23', '24', '25'],
    timeLimit: 45,
    questionCount: 40
  },

  // Grammar Categories by Chapters
  {
    id: 'grammar-ch1-2',
    name: 'Tata Bahasa Bab 1-2',
    description: 'Grammar: です/である, ini/itu/apa',
    type: 'grammar',
    difficulty: 'beginner',
    chapters: ['1', '2'],
    timeLimit: 30,
    questionCount: 20
  },
  {
    id: 'grammar-ch3-5',
    name: 'Tata Bahasa Bab 3-5',
    description: 'Grammar: ada/tidak ada, kata kerja dasar',
    type: 'grammar',
    difficulty: 'beginner',
    chapters: ['3', '4', '5'],
    timeLimit: 35,
    questionCount: 25
  },
  {
    id: 'grammar-ch6-8',
    name: 'Tata Bahasa Bab 6-8',
    description: 'Grammar: kata kerja transitif, objek',
    type: 'grammar',
    difficulty: 'beginner',
    chapters: ['6', '7', '8'],
    timeLimit: 35,
    questionCount: 25
  },
  {
    id: 'grammar-ch9-12',
    name: 'Tata Bahasa Bab 9-12',
    description: 'Grammar: kata sifat, perbandingan',
    type: 'grammar',
    difficulty: 'intermediate',
    chapters: ['9', '10', '11', '12'],
    timeLimit: 40,
    questionCount: 30
  },
  {
    id: 'grammar-ch13-16',
    name: 'Tata Bahasa Bab 13-16',
    description: 'Grammar: keinginan, kemampuan, permintaan',
    type: 'grammar',
    difficulty: 'intermediate',
    chapters: ['13', '14', '15', '16'],
    timeLimit: 40,
    questionCount: 30
  },
  {
    id: 'grammar-ch17-20',
    name: 'Tata Bahasa Bab 17-20',
    description: 'Grammar: bentuk kasual, pengalaman',
    type: 'grammar',
    difficulty: 'intermediate',
    chapters: ['17', '18', '19', '20'],
    timeLimit: 45,
    questionCount: 35
  },
  {
    id: 'grammar-ch21-25',
    name: 'Tata Bahasa Bab 21-25',
    description: 'Grammar: bentuk kondisional, rencana',
    type: 'grammar',
    difficulty: 'advanced',
    chapters: ['21', '22', '23', '24', '25'],
    timeLimit: 50,
    questionCount: 40
  },

  // Kanji Categories
  {
    id: 'kanji-basic',
    name: 'Kanji Dasar N5',
    description: 'Kanji dasar untuk level N5 (80 kanji)',
    type: 'kanji',
    difficulty: 'beginner',
    timeLimit: 40,
    questionCount: 30
  },
  {
    id: 'kanji-intermediate',
    name: 'Kanji Menengah N5',
    description: 'Kanji menengah untuk level N5',
    type: 'kanji',
    difficulty: 'intermediate',
    timeLimit: 45,
    questionCount: 35
  },
  {
    id: 'kanji-advanced',
    name: 'Kanji Lengkap N5',
    description: 'Semua kanji N5 untuk ujian akhir',
    type: 'kanji',
    difficulty: 'advanced',
    timeLimit: 60,
    questionCount: 50
  }
];

export const getDifficultyColor = (difficulty: 'beginner' | 'intermediate' | 'advanced'): string => {
  switch (difficulty) {
    case 'beginner':
      return 'bg-green-100 text-green-800';
    case 'intermediate':
      return 'bg-yellow-100 text-yellow-800';
    case 'advanced':
      return 'bg-red-100 text-red-800';
  }
};

export const getDifficultyText = (difficulty: 'beginner' | 'intermediate' | 'advanced'): string => {
  switch (difficulty) {
    case 'beginner':
      return 'Siswa Baru';
    case 'intermediate':
      return 'Siswa Menengah';
    case 'advanced':
      return 'Siswa Akhir';
  }
};

export const getTypeColor = (type: string): string => {
  switch (type) {
    case 'hiragana':
      return 'bg-blue-100 text-blue-800';
    case 'katakana':
      return 'bg-purple-100 text-purple-800';
    case 'vocabulary':
      return 'bg-indigo-100 text-indigo-800';
    case 'grammar':
      return 'bg-pink-100 text-pink-800';
    case 'kanji':
      return 'bg-gray-100 text-gray-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

export const getTypeText = (type: string): string => {
  switch (type) {
    case 'hiragana':
      return 'ひらがな';
    case 'katakana':
      return 'カタカナ';
    case 'vocabulary':
      return '語彙 (Kosakata)';
    case 'grammar':
      return '文法 (Tata Bahasa)';
    case 'kanji':
      return '漢字 (Kanji)';
    default:
      return type;
  }
};