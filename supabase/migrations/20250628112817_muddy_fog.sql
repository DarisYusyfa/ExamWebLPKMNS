/*
  # Add DELETE policy for exam_results table

  1. Security Changes
    - Add DELETE policy for `exam_results` table to allow anonymous and authenticated users to delete exam results
    - This enables the admin dashboard to properly delete exam results

  2. Policy Details
    - Policy name: "Anyone can delete exam results"
    - Applies to: DELETE operations
    - Roles: anon, authenticated
    - Condition: true (allows all deletions for admin functionality)

  Note: This policy is designed for admin functionality where deletion access is needed.
  In a production environment, you may want to restrict this further based on user roles.
*/

-- Add DELETE policy for exam_results table
CREATE POLICY "Anyone can delete exam results"
  ON exam_results
  FOR DELETE
  TO anon, authenticated
  USING (true);