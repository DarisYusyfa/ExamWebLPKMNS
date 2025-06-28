/*
  # Admin Authentication System

  1. New Tables
    - `admin_users`
      - `id` (uuid, primary key)
      - `username` (text, unique)
      - `password_hash` (text)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
      - `last_login` (timestamp, nullable)

  2. Security
    - Enable RLS on admin_users table
    - Add policies for admin management
    - Insert default admin user with secure password

  3. Functions
    - Password hashing function
    - Admin authentication function
    - Password change function
*/

-- Create admin_users table
CREATE TABLE IF NOT EXISTS admin_users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  username text UNIQUE NOT NULL,
  password_hash text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  last_login timestamptz
);

-- Enable Row Level Security
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- Create policies for admin_users
CREATE POLICY "Allow admin authentication"
  ON admin_users
  FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Allow admin updates"
  ON admin_users
  FOR UPDATE
  TO anon, authenticated
  USING (true)
  WITH CHECK (true);

-- Create function to hash passwords (simple hash for demo - in production use proper bcrypt)
CREATE OR REPLACE FUNCTION hash_password(password text)
RETURNS text
LANGUAGE plpgsql
AS $$
BEGIN
  -- Simple hash function (in production, use proper bcrypt or similar)
  RETURN encode(digest(password || 'salt_mns_2025', 'sha256'), 'hex');
END;
$$;

-- Create function to verify admin login
CREATE OR REPLACE FUNCTION verify_admin_login(input_username text, input_password text)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  admin_record admin_users%ROWTYPE;
  hashed_password text;
BEGIN
  -- Hash the input password
  hashed_password := hash_password(input_password);
  
  -- Find admin user
  SELECT * INTO admin_record
  FROM admin_users
  WHERE username = input_username AND password_hash = hashed_password;
  
  IF FOUND THEN
    -- Update last login
    UPDATE admin_users 
    SET last_login = now(), updated_at = now()
    WHERE id = admin_record.id;
    
    RETURN json_build_object(
      'success', true,
      'admin_id', admin_record.id,
      'username', admin_record.username,
      'last_login', admin_record.last_login
    );
  ELSE
    RETURN json_build_object('success', false, 'error', 'Invalid credentials');
  END IF;
END;
$$;

-- Create function to change admin password
CREATE OR REPLACE FUNCTION change_admin_password(
  input_username text, 
  current_password text, 
  new_password text
)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  admin_record admin_users%ROWTYPE;
  current_hashed text;
  new_hashed text;
BEGIN
  -- Hash the current password
  current_hashed := hash_password(current_password);
  
  -- Verify current password
  SELECT * INTO admin_record
  FROM admin_users
  WHERE username = input_username AND password_hash = current_hashed;
  
  IF NOT FOUND THEN
    RETURN json_build_object('success', false, 'error', 'Current password is incorrect');
  END IF;
  
  -- Hash new password
  new_hashed := hash_password(new_password);
  
  -- Update password
  UPDATE admin_users 
  SET password_hash = new_hashed, updated_at = now()
  WHERE id = admin_record.id;
  
  RETURN json_build_object('success', true, 'message', 'Password changed successfully');
END;
$$;

-- Create function to add new admin user
CREATE OR REPLACE FUNCTION add_admin_user(input_username text, input_password text)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  hashed_password text;
  new_admin_id uuid;
BEGIN
  -- Check if username already exists
  IF EXISTS (SELECT 1 FROM admin_users WHERE username = input_username) THEN
    RETURN json_build_object('success', false, 'error', 'Username already exists');
  END IF;
  
  -- Hash password
  hashed_password := hash_password(input_password);
  
  -- Insert new admin
  INSERT INTO admin_users (username, password_hash)
  VALUES (input_username, hashed_password)
  RETURNING id INTO new_admin_id;
  
  RETURN json_build_object(
    'success', true, 
    'admin_id', new_admin_id,
    'username', input_username
  );
END;
$$;

-- Grant execute permissions
GRANT EXECUTE ON FUNCTION hash_password(text) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION verify_admin_login(text, text) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION change_admin_password(text, text, text) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION add_admin_user(text, text) TO anon, authenticated;

-- Insert default admin user with new password
INSERT INTO admin_users (username, password_hash)
VALUES ('admin', hash_password('adminMNS2025'))
ON CONFLICT (username) DO UPDATE SET
  password_hash = hash_password('adminMNS2025'),
  updated_at = now();

-- Create trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_admin_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_admin_users_updated_at
    BEFORE UPDATE ON admin_users
    FOR EACH ROW
    EXECUTE FUNCTION update_admin_updated_at();

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_admin_users_username ON admin_users(username);
CREATE INDEX IF NOT EXISTS idx_admin_users_last_login ON admin_users(last_login);