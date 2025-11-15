/*
  # Create student_profiles table for extended student information

  1. New Tables
    - `student_profiles`
      - `id` (uuid, primary key) - Unique identifier
      - `user_id` (uuid, foreign key, unique) - Reference to student user
      - `bio` (text) - Student bio/about
      - `gpa` (numeric) - Current GPA
      - `total_credits` (integer) - Total credits completed
      - `enrollment_year` (integer) - Year of enrollment
      - `created_at` (timestamp) - Creation time
      - `updated_at` (timestamp) - Last update time

  2. Constraints
    - One-to-one relationship with users table
    - Only students have profiles

  3. Security
    - Enable RLS on student_profiles table
    - Students can view their own profile
    - Admins can view all profiles
*/

CREATE TABLE IF NOT EXISTS student_profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  bio text,
  gpa numeric(3, 2) DEFAULT 0.00,
  total_credits integer DEFAULT 0,
  enrollment_year integer,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE student_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Students can view their own profile"
  ON student_profiles FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Admins can view all profiles"
  ON student_profiles FOR SELECT
  TO authenticated
  USING ((SELECT role FROM users WHERE id = auth.uid()) = 'admin');

CREATE POLICY "Students can update their own profile"
  ON student_profiles FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Admins can update student profiles"
  ON student_profiles FOR UPDATE
  TO authenticated
  USING ((SELECT role FROM users WHERE id = auth.uid()) = 'admin')
  WITH CHECK ((SELECT role FROM users WHERE id = auth.uid()) = 'admin');

CREATE INDEX idx_student_profiles_user_id ON student_profiles(user_id);
