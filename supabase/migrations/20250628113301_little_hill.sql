/*
  # Fix Question Bank Policies

  1. Security Changes
    - Update policies for questions table to allow proper CRUD operations
    - Ensure both anonymous and authenticated users can manage questions
    - Fix INSERT, UPDATE, and DELETE policies for question management

  2. Policy Updates
    - Drop existing restrictive policies
    - Create comprehensive policies that work for admin dashboard
*/

-- Drop existing policies for questions table
DROP POLICY IF EXISTS "Anyone can read questions" ON questions;
DROP POLICY IF EXISTS "Authenticated users can manage questions" ON questions;

-- Create new comprehensive policies for questions table

-- Allow reading questions
CREATE POLICY "Anyone can read questions"
  ON questions
  FOR SELECT
  TO anon, authenticated
  USING (true);

-- Allow inserting questions
CREATE POLICY "Anyone can insert questions"
  ON questions
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Allow updating questions
CREATE POLICY "Anyone can update questions"
  ON questions
  FOR UPDATE
  TO anon, authenticated
  USING (true)
  WITH CHECK (true);

-- Allow deleting questions
CREATE POLICY "Anyone can delete questions"
  ON questions
  FOR DELETE
  TO anon, authenticated
  USING (true);