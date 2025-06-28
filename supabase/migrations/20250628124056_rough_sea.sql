/*
  # Add missing columns to exam system

  1. New Columns
    - Add `difficulty` column to `exam_tokens` table (text)
    - Add `exam_category` column to `exam_tokens` table (text)
    - Add `exam_category` column to `students` table (text)
    - Add `difficulty` column to `students` table (text)
    - Add `exam_category` column to `exam_sessions` table (text)
    - Add `difficulty` column to `exam_sessions` table (text)
    - Add `exam_category` column to `exam_results` table (text)
    - Add `difficulty` column to `exam_results` table (text)

  2. Security
    - No RLS changes needed as existing policies will cover new columns

  3. Notes
    - Adding default values to ensure data consistency
    - Using conditional logic to prevent errors if columns already exist
*/

-- Add difficulty and exam_category columns to exam_tokens table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'exam_tokens' AND column_name = 'difficulty'
  ) THEN
    ALTER TABLE exam_tokens ADD COLUMN difficulty text DEFAULT 'medium';
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'exam_tokens' AND column_name = 'exam_category'
  ) THEN
    ALTER TABLE exam_tokens ADD COLUMN exam_category text DEFAULT 'basic';
  END IF;
END $$;

-- Add exam_category and difficulty columns to students table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'students' AND column_name = 'exam_category'
  ) THEN
    ALTER TABLE students ADD COLUMN exam_category text DEFAULT 'basic';
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'students' AND column_name = 'difficulty'
  ) THEN
    ALTER TABLE students ADD COLUMN difficulty text DEFAULT 'medium';
  END IF;
END $$;

-- Add exam_category and difficulty columns to exam_sessions table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'exam_sessions' AND column_name = 'exam_category'
  ) THEN
    ALTER TABLE exam_sessions ADD COLUMN exam_category text DEFAULT 'basic';
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'exam_sessions' AND column_name = 'difficulty'
  ) THEN
    ALTER TABLE exam_sessions ADD COLUMN difficulty text DEFAULT 'medium';
  END IF;
END $$;

-- Add exam_category and difficulty columns to exam_results table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'exam_results' AND column_name = 'exam_category'
  ) THEN
    ALTER TABLE exam_results ADD COLUMN exam_category text DEFAULT 'basic';
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'exam_results' AND column_name = 'difficulty'
  ) THEN
    ALTER TABLE exam_results ADD COLUMN difficulty text DEFAULT 'medium';
  END IF;
END $$;