/*
  # Fix RLS Policy for Exam Tokens

  1. Security Changes
    - Update INSERT policy to allow both anonymous and authenticated users
    - This enables the admin dashboard to generate tokens using the anon key
    - Maintains existing SELECT, UPDATE, and DELETE policies for authenticated users

  Note: In a production environment, consider implementing proper admin authentication
  and restricting this policy to authenticated admin users only.
*/

-- Drop the existing INSERT policy
DROP POLICY IF EXISTS "Authenticated users can insert tokens" ON exam_tokens;

-- Create a new INSERT policy that allows both anon and authenticated users
CREATE POLICY "Allow token generation"
  ON exam_tokens
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);