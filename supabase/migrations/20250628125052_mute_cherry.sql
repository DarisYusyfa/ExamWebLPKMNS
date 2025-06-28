/*
  # Fix Student Deletion Issues

  1. Database Changes
    - Add proper cascade delete for foreign key relationships
    - Ensure RLS policies allow proper deletion
    - Fix any constraint issues preventing deletion

  2. Security
    - Maintain proper RLS policies for deletion
    - Ensure cascading deletes work correctly
*/

-- First, let's check and fix the foreign key constraints to ensure proper cascading

-- Drop existing foreign key constraints if they exist
ALTER TABLE exam_sessions DROP CONSTRAINT IF EXISTS exam_sessions_student_id_fkey;
ALTER TABLE exam_results DROP CONSTRAINT IF EXISTS exam_results_student_id_fkey;

-- Recreate foreign key constraints with proper CASCADE DELETE
ALTER TABLE exam_sessions 
ADD CONSTRAINT exam_sessions_student_id_fkey 
FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE;

ALTER TABLE exam_results 
ADD CONSTRAINT exam_results_student_id_fkey 
FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE;

-- Ensure we have proper DELETE policies for all related tables

-- Students table - allow deletion
DROP POLICY IF EXISTS "Anyone can delete students" ON students;
CREATE POLICY "Anyone can delete students"
  ON students
  FOR DELETE
  TO anon, authenticated
  USING (true);

-- Exam sessions table - allow deletion
DROP POLICY IF EXISTS "Anyone can delete exam sessions" ON exam_sessions;
CREATE POLICY "Anyone can delete exam sessions"
  ON exam_sessions
  FOR DELETE
  TO anon, authenticated
  USING (true);

-- Exam results table - ensure delete policy exists
DROP POLICY IF EXISTS "Anyone can delete exam results" ON exam_results;
CREATE POLICY "Anyone can delete exam results"
  ON exam_results
  FOR DELETE
  TO anon, authenticated
  USING (true);

-- Add indexes to improve deletion performance
CREATE INDEX IF NOT EXISTS idx_exam_sessions_student_id ON exam_sessions(student_id);
CREATE INDEX IF NOT EXISTS idx_exam_results_student_id ON exam_results(student_id);

-- Create a function to safely delete students with all related data
CREATE OR REPLACE FUNCTION delete_student_safely(student_uuid uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    session_count integer;
    result_count integer;
BEGIN
    -- Count related records for logging
    SELECT COUNT(*) INTO session_count FROM exam_sessions WHERE student_id = student_uuid;
    SELECT COUNT(*) INTO result_count FROM exam_results WHERE student_id = student_uuid;
    
    -- Delete exam sessions first (should cascade, but being explicit)
    DELETE FROM exam_sessions WHERE student_id = student_uuid;
    
    -- Delete exam results (should cascade, but being explicit)
    DELETE FROM exam_results WHERE student_id = student_uuid;
    
    -- Finally delete the student
    DELETE FROM students WHERE id = student_uuid;
    
    -- Check if student was actually deleted
    IF NOT FOUND THEN
        RETURN false;
    END IF;
    
    RETURN true;
END;
$$;

-- Grant execute permission on the function
GRANT EXECUTE ON FUNCTION delete_student_safely(uuid) TO anon, authenticated;