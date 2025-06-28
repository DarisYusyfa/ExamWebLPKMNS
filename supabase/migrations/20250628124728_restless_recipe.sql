/*
  # Fix Database Schema Errors

  1. Schema Updates
    - Add missing columns to questions table (category, difficulty, chapter, question)
    - Add unique constraint to exam_sessions.student_id for upsert operations
    - Update questions table structure to match application expectations

  2. Data Integrity
    - Ensure proper constraints and indexes
    - Add default values where appropriate

  3. Security
    - Maintain existing RLS policies
*/

-- Add missing columns to questions table
DO $$
BEGIN
  -- Add category column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'questions' AND column_name = 'category'
  ) THEN
    ALTER TABLE questions ADD COLUMN category text;
  END IF;

  -- Add difficulty column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'questions' AND column_name = 'difficulty'
  ) THEN
    ALTER TABLE questions ADD COLUMN difficulty text DEFAULT 'medium';
  END IF;

  -- Add chapter column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'questions' AND column_name = 'chapter'
  ) THEN
    ALTER TABLE questions ADD COLUMN chapter text;
  END IF;

  -- Add question column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'questions' AND column_name = 'question'
  ) THEN
    ALTER TABLE questions ADD COLUMN question text;
  END IF;
END $$;

-- Add unique constraint to exam_sessions.student_id for upsert operations
DO $$
BEGIN
  -- Check if unique constraint already exists
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints
    WHERE table_name = 'exam_sessions' 
    AND constraint_name = 'exam_sessions_student_id_unique'
    AND constraint_type = 'UNIQUE'
  ) THEN
    -- Add unique constraint on student_id
    ALTER TABLE exam_sessions ADD CONSTRAINT exam_sessions_student_id_unique UNIQUE (student_id);
  END IF;
END $$;

-- Update existing questions to have proper category values based on type
UPDATE questions 
SET category = CASE 
  WHEN type = 'hiragana' THEN 'hiragana-basic'
  WHEN type = 'katakana' THEN 'katakana-basic'
  WHEN type = 'vocabulary' THEN 'vocabulary-basic'
  WHEN type = 'grammar' THEN 'grammar-basic'
  WHEN type = 'kanji' THEN 'kanji-basic'
  ELSE 'basic'
END
WHERE category IS NULL;

-- Update existing questions to have proper question text (use character as fallback)
UPDATE questions 
SET question = CASE 
  WHEN type IN ('hiragana', 'katakana') THEN 'What is the reading of: ' || character
  WHEN type = 'kanji' THEN 'What is the meaning of: ' || character
  WHEN type = 'vocabulary' THEN 'What does this mean: ' || character
  WHEN type = 'grammar' THEN 'Complete the sentence: ' || character
  ELSE character
END
WHERE question IS NULL;

-- Update existing questions to have proper chapter values
UPDATE questions 
SET chapter = 'Chapter 1'
WHERE chapter IS NULL;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_questions_category ON questions(category);
CREATE INDEX IF NOT EXISTS idx_questions_difficulty ON questions(difficulty);
CREATE INDEX IF NOT EXISTS idx_questions_chapter ON questions(chapter);