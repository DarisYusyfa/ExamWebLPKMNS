/*
  # Japanese Exam System Database Schema

  1. New Tables
    - `exam_tokens`
      - `id` (uuid, primary key)
      - `token` (text, unique)
      - `exam_type` (text, hiragana or katakana)
      - `created_at` (timestamp)
      - `used` (boolean)
      - `used_at` (timestamp, nullable)
    
    - `students`
      - `id` (uuid, primary key)
      - `name` (text)
      - `token` (text)
      - `exam_type` (text)
      - `start_time` (timestamp)
      - `end_time` (timestamp, nullable)
      - `status` (text, active/completed/disconnected)
      - `time_remaining` (integer, milliseconds)
      - `current_question` (integer)
      - `created_at` (timestamp)
    
    - `questions`
      - `id` (uuid, primary key)
      - `question_id` (text, unique)
      - `type` (text, hiragana or katakana)
      - `character` (text)
      - `options` (jsonb, array of options)
      - `correct_answer` (integer)
      - `is_custom` (boolean)
      - `created_at` (timestamp)
    
    - `exam_sessions`
      - `id` (uuid, primary key)
      - `student_id` (uuid, foreign key)
      - `exam_type` (text)
      - `answers` (jsonb)
      - `start_time` (timestamp)
      - `time_remaining` (integer)
      - `current_question` (integer)
      - `is_fullscreen` (boolean)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `exam_results`
      - `id` (uuid, primary key)
      - `student_id` (uuid, foreign key)
      - `student_name` (text)
      - `exam_type` (text)
      - `score` (integer)
      - `total_questions` (integer)
      - `time_spent` (integer, milliseconds)
      - `completed_at` (timestamp)
      - `answers` (jsonb)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
    - Add policies for admin access
*/

-- Create exam_tokens table
CREATE TABLE IF NOT EXISTS exam_tokens (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  token text UNIQUE NOT NULL,
  exam_type text NOT NULL CHECK (exam_type IN ('hiragana', 'katakana')),
  created_at timestamptz DEFAULT now(),
  used boolean DEFAULT false,
  used_at timestamptz
);

-- Create students table
CREATE TABLE IF NOT EXISTS students (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  token text NOT NULL,
  exam_type text NOT NULL CHECK (exam_type IN ('hiragana', 'katakana')),
  start_time timestamptz DEFAULT now(),
  end_time timestamptz,
  status text DEFAULT 'active' CHECK (status IN ('active', 'completed', 'disconnected')),
  time_remaining integer DEFAULT 1800000, -- 30 minutes in milliseconds
  current_question integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Create questions table
CREATE TABLE IF NOT EXISTS questions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  question_id text UNIQUE NOT NULL,
  type text NOT NULL CHECK (type IN ('hiragana', 'katakana')),
  character text NOT NULL,
  options jsonb NOT NULL,
  correct_answer integer NOT NULL,
  is_custom boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Create exam_sessions table
CREATE TABLE IF NOT EXISTS exam_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id uuid REFERENCES students(id) ON DELETE CASCADE,
  exam_type text NOT NULL CHECK (exam_type IN ('hiragana', 'katakana')),
  answers jsonb DEFAULT '{}',
  start_time timestamptz DEFAULT now(),
  time_remaining integer DEFAULT 1800000,
  current_question integer DEFAULT 0,
  is_fullscreen boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create exam_results table
CREATE TABLE IF NOT EXISTS exam_results (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id uuid REFERENCES students(id) ON DELETE CASCADE,
  student_name text NOT NULL,
  exam_type text NOT NULL CHECK (exam_type IN ('hiragana', 'katakana')),
  score integer NOT NULL,
  total_questions integer NOT NULL,
  time_spent integer NOT NULL,
  completed_at timestamptz DEFAULT now(),
  answers jsonb NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE exam_tokens ENABLE ROW LEVEL SECURITY;
ALTER TABLE students ENABLE ROW LEVEL SECURITY;
ALTER TABLE questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE exam_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE exam_results ENABLE ROW LEVEL SECURITY;

-- Create policies for exam_tokens
CREATE POLICY "Anyone can read tokens for validation"
  ON exam_tokens
  FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert tokens"
  ON exam_tokens
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update tokens"
  ON exam_tokens
  FOR UPDATE
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can delete tokens"
  ON exam_tokens
  FOR DELETE
  TO authenticated
  USING (true);

-- Create policies for students
CREATE POLICY "Anyone can read students"
  ON students
  FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Anyone can insert students"
  ON students
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Anyone can update students"
  ON students
  FOR UPDATE
  TO anon, authenticated
  USING (true);

-- Create policies for questions
CREATE POLICY "Anyone can read questions"
  ON questions
  FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Authenticated users can manage questions"
  ON questions
  FOR ALL
  TO authenticated
  USING (true);

-- Create policies for exam_sessions
CREATE POLICY "Anyone can manage exam sessions"
  ON exam_sessions
  FOR ALL
  TO anon, authenticated
  USING (true);

-- Create policies for exam_results
CREATE POLICY "Anyone can read exam results"
  ON exam_results
  FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Anyone can insert exam results"
  ON exam_results
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Insert default questions
INSERT INTO questions (question_id, type, character, options, correct_answer, is_custom) VALUES
-- Hiragana questions
('h1', 'hiragana', 'あ', '["a", "i", "u", "e"]', 0, false),
('h2', 'hiragana', 'い', '["a", "i", "u", "e"]', 1, false),
('h3', 'hiragana', 'う', '["a", "i", "u", "e"]', 2, false),
('h4', 'hiragana', 'え', '["a", "i", "u", "e"]', 3, false),
('h5', 'hiragana', 'お', '["o", "a", "i", "u"]', 0, false),
('h6', 'hiragana', 'か', '["ka", "ki", "ku", "ke"]', 0, false),
('h7', 'hiragana', 'き', '["ka", "ki", "ku", "ke"]', 1, false),
('h8', 'hiragana', 'く', '["ka", "ki", "ku", "ke"]', 2, false),
('h9', 'hiragana', 'け', '["ka", "ki", "ku", "ke"]', 3, false),
('h10', 'hiragana', 'こ', '["ko", "ka", "ki", "ku"]', 0, false),
('h11', 'hiragana', 'さ', '["sa", "shi", "su", "se"]', 0, false),
('h12', 'hiragana', 'し', '["sa", "shi", "su", "se"]', 1, false),
('h13', 'hiragana', 'す', '["sa", "shi", "su", "se"]', 2, false),
('h14', 'hiragana', 'せ', '["sa", "shi", "su", "se"]', 3, false),
('h15', 'hiragana', 'そ', '["so", "sa", "shi", "su"]', 0, false),
('h16', 'hiragana', 'た', '["ta", "chi", "tsu", "te"]', 0, false),
('h17', 'hiragana', 'ち', '["ta", "chi", "tsu", "te"]', 1, false),
('h18', 'hiragana', 'つ', '["ta", "chi", "tsu", "te"]', 2, false),
('h19', 'hiragana', 'て', '["ta", "chi", "tsu", "te"]', 3, false),
('h20', 'hiragana', 'と', '["to", "ta", "chi", "tsu"]', 0, false),

-- Katakana questions
('k1', 'katakana', 'ア', '["a", "i", "u", "e"]', 0, false),
('k2', 'katakana', 'イ', '["a", "i", "u", "e"]', 1, false),
('k3', 'katakana', 'ウ', '["a", "i", "u", "e"]', 2, false),
('k4', 'katakana', 'エ', '["a", "i", "u", "e"]', 3, false),
('k5', 'katakana', 'オ', '["o", "a", "i", "u"]', 0, false),
('k6', 'katakana', 'カ', '["ka", "ki", "ku", "ke"]', 0, false),
('k7', 'katakana', 'キ', '["ka", "ki", "ku", "ke"]', 1, false),
('k8', 'katakana', 'ク', '["ka", "ki", "ku", "ke"]', 2, false),
('k9', 'katakana', 'ケ', '["ka", "ki", "ku", "ke"]', 3, false),
('k10', 'katakana', 'コ', '["ko", "ka", "ki", "ku"]', 0, false),
('k11', 'katakana', 'サ', '["sa", "shi", "su", "se"]', 0, false),
('k12', 'katakana', 'シ', '["sa", "shi", "su", "se"]', 1, false),
('k13', 'katakana', 'ス', '["sa", "shi", "su", "se"]', 2, false),
('k14', 'katakana', 'セ', '["sa", "shi", "su", "se"]', 3, false),
('k15', 'katakana', 'ソ', '["so", "sa", "shi", "su"]', 0, false),
('k16', 'katakana', 'タ', '["ta", "chi", "tsu", "te"]', 0, false),
('k17', 'katakana', 'チ', '["ta", "chi", "tsu", "te"]', 1, false),
('k18', 'katakana', 'ツ', '["ta", "chi", "tsu", "te"]', 2, false),
('k19', 'katakana', 'テ', '["ta", "chi", "tsu", "te"]', 3, false),
('k20', 'katakana', 'ト', '["to", "ta", "chi", "tsu"]', 0, false)

ON CONFLICT (question_id) DO NOTHING;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_exam_tokens_token ON exam_tokens(token);
CREATE INDEX IF NOT EXISTS idx_students_token ON students(token);
CREATE INDEX IF NOT EXISTS idx_students_status ON students(status);
CREATE INDEX IF NOT EXISTS idx_questions_type ON questions(type);
CREATE INDEX IF NOT EXISTS idx_exam_sessions_student_id ON exam_sessions(student_id);
CREATE INDEX IF NOT EXISTS idx_exam_results_student_id ON exam_results(student_id);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for exam_sessions
CREATE TRIGGER update_exam_sessions_updated_at
    BEFORE UPDATE ON exam_sessions
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();