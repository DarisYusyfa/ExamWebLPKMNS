/*
  # Update exam_tokens check constraint

  1. Changes
    - Drop existing check constraint on exam_tokens.exam_type
    - Add new check constraint allowing all exam types: hiragana, katakana, vocabulary, grammar, kanji
    - Update similar constraints on other tables for consistency

  2. Security
    - Maintains existing RLS policies
    - No changes to table structure or data
*/

-- Update exam_tokens table constraint
ALTER TABLE exam_tokens DROP CONSTRAINT IF EXISTS exam_tokens_exam_type_check;
ALTER TABLE exam_tokens ADD CONSTRAINT exam_tokens_exam_type_check 
  CHECK (exam_type = ANY (ARRAY['hiragana'::text, 'katakana'::text, 'vocabulary'::text, 'grammar'::text, 'kanji'::text]));

-- Update questions table constraint for consistency
ALTER TABLE questions DROP CONSTRAINT IF EXISTS questions_type_check;
ALTER TABLE questions ADD CONSTRAINT questions_type_check 
  CHECK (type = ANY (ARRAY['hiragana'::text, 'katakana'::text, 'vocabulary'::text, 'grammar'::text, 'kanji'::text]));

-- Update students table constraint for consistency
ALTER TABLE students DROP CONSTRAINT IF EXISTS students_exam_type_check;
ALTER TABLE students ADD CONSTRAINT students_exam_type_check 
  CHECK (exam_type = ANY (ARRAY['hiragana'::text, 'katakana'::text, 'vocabulary'::text, 'grammar'::text, 'kanji'::text]));

-- Update exam_sessions table constraint for consistency
ALTER TABLE exam_sessions DROP CONSTRAINT IF EXISTS exam_sessions_exam_type_check;
ALTER TABLE exam_sessions ADD CONSTRAINT exam_sessions_exam_type_check 
  CHECK (exam_type = ANY (ARRAY['hiragana'::text, 'katakana'::text, 'vocabulary'::text, 'grammar'::text, 'kanji'::text]));

-- Update exam_results table constraint for consistency
ALTER TABLE exam_results DROP CONSTRAINT IF EXISTS exam_results_exam_type_check;
ALTER TABLE exam_results ADD CONSTRAINT exam_results_exam_type_check 
  CHECK (exam_type = ANY (ARRAY['hiragana'::text, 'katakana'::text, 'vocabulary'::text, 'grammar'::text, 'kanji'::text]));