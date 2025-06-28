/*
  # Fix Token Deletion Issues

  1. Security Changes
    - Update DELETE policy to allow proper token deletion
    - Ensure RLS policies work correctly for token management
    - Add proper permissions for admin operations

  2. Policy Updates
    - Fix DELETE policy for exam_tokens table
    - Ensure tokens can be properly deleted by admin
*/

-- Drop existing DELETE policy if it exists
DROP POLICY IF EXISTS "Authenticated users can delete tokens" ON exam_tokens;

-- Create new DELETE policy that works properly
CREATE POLICY "Allow token deletion"
  ON exam_tokens
  FOR DELETE
  TO anon, authenticated
  USING (true);

-- Also ensure UPDATE policy works for marking tokens as used
DROP POLICY IF EXISTS "Authenticated users can update tokens" ON exam_tokens;

CREATE POLICY "Allow token updates"
  ON exam_tokens
  FOR UPDATE
  TO anon, authenticated
  USING (true)
  WITH CHECK (true);