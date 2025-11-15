/*
  # Create users table for authentication

  1. New Tables
    - `users`
      - `id` (uuid, primary key) - Unique identifier
      - `email` (text, unique) - User email address
      - `password_hash` (text) - Hashed password
      - `name` (text) - Full name
      - `role` (text) - User role (student or admin)
      - `phone` (text) - Phone number
      - `address` (text) - Address
      - `created_at` (timestamp) - Account creation time
      - `updated_at` (timestamp) - Last update time

  2. Security
    - Enable RLS on users table
    - Users can only read their own data
    - Only admins can view all users
*/

CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  password_hash text NOT NULL,
  name text NOT NULL,
  role text NOT NULL CHECK (role IN ('student', 'admin')),
  phone text,
  address text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own data"
  ON users FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Admins can read all users"
  ON users FOR SELECT
  TO authenticated
  USING ((SELECT role FROM users WHERE id = auth.uid()) = 'admin');

CREATE POLICY "Users can update own data"
  ON users FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
