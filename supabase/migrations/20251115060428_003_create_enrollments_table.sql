/*
  # Create enrollments table for course enrollment tracking

  1. New Tables
    - `enrollments`
      - `id` (uuid, primary key) - Unique identifier
      - `student_id` (uuid, foreign key) - Reference to student user
      - `course_id` (uuid, foreign key) - Reference to course
      - `status` (text) - Enrollment status (pending, approved, rejected)
      - `request_date` (timestamp) - When request was made
      - `approved_date` (timestamp) - When request was approved
      - `approved_by` (uuid, foreign key) - Admin who approved
      - `created_at` (timestamp) - Creation time
      - `updated_at` (timestamp) - Last update time

  2. Constraints
    - Unique constraint on student_id + course_id (no duplicate enrollments)

  3. Security
    - Enable RLS on enrollments table
    - Students can view their own enrollments
    - Admins can view all enrollments
*/

CREATE TABLE IF NOT EXISTS enrollments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  course_id uuid NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  status text NOT NULL CHECK (status IN ('pending', 'approved', 'rejected')) DEFAULT 'pending',
  request_date timestamptz DEFAULT now(),
  approved_date timestamptz,
  approved_by uuid REFERENCES users(id) ON DELETE SET NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(student_id, course_id)
);

ALTER TABLE enrollments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Students can view their own enrollments"
  ON enrollments FOR SELECT
  TO authenticated
  USING (student_id = auth.uid());

CREATE POLICY "Admins can view all enrollments"
  ON enrollments FOR SELECT
  TO authenticated
  USING ((SELECT role FROM users WHERE id = auth.uid()) = 'admin');

CREATE POLICY "Students can request enrollment"
  ON enrollments FOR INSERT
  TO authenticated
  WITH CHECK (
    student_id = auth.uid() AND
    (SELECT role FROM users WHERE id = auth.uid()) = 'student'
  );

CREATE POLICY "Only admins can update enrollments"
  ON enrollments FOR UPDATE
  TO authenticated
  USING ((SELECT role FROM users WHERE id = auth.uid()) = 'admin')
  WITH CHECK ((SELECT role FROM users WHERE id = auth.uid()) = 'admin');

CREATE POLICY "Only admins can delete enrollments"
  ON enrollments FOR DELETE
  TO authenticated
  USING ((SELECT role FROM users WHERE id = auth.uid()) = 'admin');

CREATE INDEX idx_enrollments_student_id ON enrollments(student_id);
CREATE INDEX idx_enrollments_course_id ON enrollments(course_id);
CREATE INDEX idx_enrollments_status ON enrollments(status);
CREATE INDEX idx_enrollments_request_date ON enrollments(request_date);
