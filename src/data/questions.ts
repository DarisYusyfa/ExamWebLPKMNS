import { Question } from '../types';

// Hiragana Questions - Basic Level
export const hiraganaBasicQuestions: Question[] = [
  {
    id: 'h_basic_1',
    type: 'hiragana',
    category: 'hiragana-basic',
    character: 'あ',
    options: ['a', 'i', 'u', 'e'],
    correctAnswer: 0,
    difficulty: 'beginner'
  },
  {
    id: 'h_basic_2',
    type: 'hiragana',
    category: 'hiragana-basic',
    character: 'い',
    options: ['a', 'i', 'u', 'e'],
    correctAnswer: 1,
    difficulty: 'beginner'
  },
  {
    id: 'h_basic_3',
    type: 'hiragana',
    category: 'hiragana-basic',
    character: 'う',
    options: ['a', 'i', 'u', 'e'],
    correctAnswer: 2,
    difficulty: 'beginner'
  },
  {
    id: 'h_basic_4',
    type: 'hiragana',
    category: 'hiragana-basic',
    character: 'え',
    options: ['a', 'i', 'u', 'e'],
    correctAnswer: 3,
    difficulty: 'beginner'
  },
  {
    id: 'h_basic_5',
    type: 'hiragana',
    category: 'hiragana-basic',
    character: 'お',
    options: ['o', 'a', 'i', 'u'],
    correctAnswer: 0,
    difficulty: 'beginner'
  },
  {
    id: 'h_basic_6',
    type: 'hiragana',
    category: 'hiragana-basic',
    character: 'か',
    options: ['ka', 'ki', 'ku', 'ke'],
    correctAnswer: 0,
    difficulty: 'beginner'
  },
  {
    id: 'h_basic_7',
    type: 'hiragana',
    category: 'hiragana-basic',
    character: 'き',
    options: ['ka', 'ki', 'ku', 'ke'],
    correctAnswer: 1,
    difficulty: 'beginner'
  },
  {
    id: 'h_basic_8',
    type: 'hiragana',
    category: 'hiragana-basic',
    character: 'く',
    options: ['ka', 'ki', 'ku', 'ke'],
    correctAnswer: 2,
    difficulty: 'beginner'
  },
  {
    id: 'h_basic_9',
    type: 'hiragana',
    category: 'hiragana-basic',
    character: 'け',
    options: ['ka', 'ki', 'ku', 'ke'],
    correctAnswer: 3,
    difficulty: 'beginner'
  },
  {
    id: 'h_basic_10',
    type: 'hiragana',
    category: 'hiragana-basic',
    character: 'こ',
    options: ['ko', 'ka', 'ki', 'ku'],
    correctAnswer: 0,
    difficulty: 'beginner'
  },
  {
    id: 'h_basic_11',
    type: 'hiragana',
    category: 'hiragana-basic',
    character: 'さ',
    options: ['sa', 'shi', 'su', 'se'],
    correctAnswer: 0,
    difficulty: 'beginner'
  },
  {
    id: 'h_basic_12',
    type: 'hiragana',
    category: 'hiragana-basic',
    character: 'し',
    options: ['sa', 'shi', 'su', 'se'],
    correctAnswer: 1,
    difficulty: 'beginner'
  },
  {
    id: 'h_basic_13',
    type: 'hiragana',
    category: 'hiragana-basic',
    character: 'す',
    options: ['sa', 'shi', 'su', 'se'],
    correctAnswer: 2,
    difficulty: 'beginner'
  },
  {
    id: 'h_basic_14',
    type: 'hiragana',
    category: 'hiragana-basic',
    character: 'せ',
    options: ['sa', 'shi', 'su', 'se'],
    correctAnswer: 3,
    difficulty: 'beginner'
  },
  {
    id: 'h_basic_15',
    type: 'hiragana',
    category: 'hiragana-basic',
    character: 'そ',
    options: ['so', 'sa', 'shi', 'su'],
    correctAnswer: 0,
    difficulty: 'beginner'
  }
];

// Vocabulary Questions - Chapter 1-2
export const vocabularyChapter1_2Questions: Question[] = [
  {
    id: 'v_ch1_2_1',
    type: 'vocabulary',
    category: 'vocabulary-ch1-2',
    question: 'Apa arti dari "はじめまして"?',
    options: ['Selamat pagi', 'Senang berkenalan', 'Terima kasih', 'Selamat malam'],
    correctAnswer: 1,
    chapter: '1',
    difficulty: 'beginner'
  },
  {
    id: 'v_ch1_2_2',
    type: 'vocabulary',
    category: 'vocabulary-ch1-2',
    question: 'Bagaimana cara mengatakan "mahasiswa" dalam bahasa Jepang?',
    options: ['せんせい', 'がくせい', 'かいしゃいん', 'いしゃ'],
    correctAnswer: 1,
    chapter: '1',
    difficulty: 'beginner'
  },
  {
    id: 'v_ch1_2_3',
    type: 'vocabulary',
    category: 'vocabulary-ch1-2',
    question: 'Apa arti dari "これ"?',
    options: ['Itu (jauh)', 'Ini', 'Itu (dekat)', 'Apa'],
    correctAnswer: 1,
    chapter: '2',
    difficulty: 'beginner'
  },
  {
    id: 'v_ch1_2_4',
    type: 'vocabulary',
    category: 'vocabulary-ch1-2',
    question: 'Bagaimana cara mengatakan "buku" dalam bahasa Jepang?',
    options: ['ほん', 'ペン', 'かみ', 'つくえ'],
    correctAnswer: 0,
    chapter: '2',
    difficulty: 'beginner'
  },
  {
    id: 'v_ch1_2_5',
    type: 'vocabulary',
    category: 'vocabulary-ch1-2',
    question: 'Apa arti dari "すみません"?',
    options: ['Terima kasih', 'Maaf/Permisi', 'Selamat tinggal', 'Tidak apa-apa'],
    correctAnswer: 1,
    chapter: '1',
    difficulty: 'beginner'
  }
];

// Grammar Questions - Chapter 1-2
export const grammarChapter1_2Questions: Question[] = [
  {
    id: 'g_ch1_2_1',
    type: 'grammar',
    category: 'grammar-ch1-2',
    question: 'Lengkapi kalimat: わたし___がくせいです。',
    options: ['は', 'が', 'を', 'に'],
    correctAnswer: 0,
    chapter: '1',
    difficulty: 'beginner'
  },
  {
    id: 'g_ch1_2_2',
    type: 'grammar',
    category: 'grammar-ch1-2',
    question: 'Bentuk negatif dari "です" adalah:',
    options: ['ではありません', 'じゃありません', 'ではないです', 'Semua benar'],
    correctAnswer: 3,
    chapter: '1',
    difficulty: 'beginner'
  },
  {
    id: 'g_ch1_2_3',
    type: 'grammar',
    category: 'grammar-ch1-2',
    question: 'これ___ほんです。',
    options: ['は', 'が', 'を', 'の'],
    correctAnswer: 0,
    chapter: '2',
    difficulty: 'beginner'
  },
  {
    id: 'g_ch1_2_4',
    type: 'grammar',
    category: 'grammar-ch1-2',
    question: 'Untuk menanyakan "apa ini?", kita menggunakan:',
    options: ['これはなんですか', 'これはだれですか', 'これはどこですか', 'これはいつですか'],
    correctAnswer: 0,
    chapter: '2',
    difficulty: 'beginner'
  }
];

// Kanji Questions - Basic Level
export const kanjiBasicQuestions: Question[] = [
  {
    id: 'k_basic_1',
    type: 'kanji',
    category: 'kanji-basic',
    question: 'Bagaimana cara membaca kanji "人"?',
    options: ['ひと', 'じん', 'にん', 'Semua benar'],
    correctAnswer: 3,
    difficulty: 'beginner'
  },
  {
    id: 'k_basic_2',
    type: 'kanji',
    category: 'kanji-basic',
    question: 'Apa arti dari kanji "日"?',
    options: ['Bulan', 'Hari/Matahari', 'Tahun', 'Minggu'],
    correctAnswer: 1,
    difficulty: 'beginner'
  },
  {
    id: 'k_basic_3',
    type: 'kanji',
    category: 'kanji-basic',
    question: 'Bagaimana cara membaca "本"?',
    options: ['ほん', 'もと', 'ぼん', 'A dan B benar'],
    correctAnswer: 3,
    difficulty: 'beginner'
  },
  {
    id: 'k_basic_4',
    type: 'kanji',
    category: 'kanji-basic',
    question: 'Apa arti dari "学生"?',
    options: ['Guru', 'Mahasiswa', 'Sekolah', 'Belajar'],
    correctAnswer: 1,
    difficulty: 'beginner'
  }
];

// Export all questions by category
export const questionsByCategory: Record<string, Question[]> = {
  'hiragana-basic': hiraganaBasicQuestions,
  'vocabulary-ch1-2': vocabularyChapter1_2Questions,
  'grammar-ch1-2': grammarChapter1_2Questions,
  'kanji-basic': kanjiBasicQuestions,
  // Add more categories as needed
};

// Legacy exports for backward compatibility
export const hiraganaQuestions = hiraganaBasicQuestions;
export const katakanaQuestions: Question[] = []; // Will be populated similar to hiragana