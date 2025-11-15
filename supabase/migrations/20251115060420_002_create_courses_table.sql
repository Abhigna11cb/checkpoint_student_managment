/*
  # Create courses table

  1. New Tables
    - `courses`
      - `id` (uuid, primary key) - Unique identifier
      - `name` (text) - Course name
      - `description` (text) - Course description
      - `start_date` (date) - Course start date
      - `end_date` (date) - Course end date
      - `capacity` (integer) - Maximum students allowed
      - `enrolled_count` (integer) - Current enrollment count
      - `created_by` (uuid, foreign key) - Admin who created course
      - `created_at` (timestamp) - Creation time
      - `updated_at` (timestamp) - Last update time

  2. Security
    - Enable RLS on courses table
    - Students can view all courses
    - Only admins can create/update/delete courses
*/

CREATE TABLE IF NOT EXISTS courses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text NOT NULL,
  start_date date NOT NULL,
  end_date date NOT NULL,
  capacity integer NOT NULL DEFAULT 50,
  enrolled_count integer NOT NULL DEFAULT 0,
  created_by uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE courses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view courses"
  ON courses FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Only admins can insert courses"
  ON courses FOR INSERT
  TO authenticated
  WITH CHECK (
    (SELECT role FROM users WHERE id = auth.uid()) = 'admin'
  );

CREATE POLICY "Only admins can update courses"
  ON courses FOR UPDATE
  TO authenticated
  USING ((SELECT role FROM users WHERE id = auth.uid()) = 'admin')
  WITH CHECK ((SELECT role FROM users WHERE id = auth.uid()) = 'admin');

CREATE POLICY "Only admins can delete courses"
  ON courses FOR DELETE
  TO authenticated
  USING ((SELECT role FROM users WHERE id = auth.uid()) = 'admin');

CREATE INDEX idx_courses_start_date ON courses(start_date);
CREATE INDEX idx_courses_created_by ON courses(created_by);
