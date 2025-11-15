/*
  # Create grades table for student performance tracking

  1. New Tables
    - `grades`
      - `id` (uuid, primary key) - Unique identifier
      - `enrollment_id` (uuid, foreign key) - Reference to enrollment
      - `assignment_name` (text) - Name of assignment/exam
      - `score` (numeric) - Score obtained (0-100)
      - `max_score` (numeric) - Maximum possible score
      - `percentage` (numeric) - Percentage score
      - `graded_date` (timestamp) - When grade was assigned
      - `graded_by` (uuid, foreign key) - Admin who graded
      - `notes` (text) - Feedback/notes
      - `created_at` (timestamp) - Creation time
      - `updated_at` (timestamp) - Last update time

  2. Security
    - Enable RLS on grades table
    - Students can view their own grades
    - Admins can manage all grades
*/

CREATE TABLE IF NOT EXISTS grades (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  enrollment_id uuid NOT NULL REFERENCES enrollments(id) ON DELETE CASCADE,
  assignment_name text NOT NULL,
  score numeric(5, 2) NOT NULL,
  max_score numeric(5, 2) NOT NULL DEFAULT 100,
  percentage numeric(5, 2) GENERATED ALWAYS AS ((score / max_score) * 100) STORED,
  graded_date timestamptz DEFAULT now(),
  graded_by uuid NOT NULL REFERENCES users(id) ON DELETE SET NULL,
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE grades ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Students can view their own grades"
  ON grades FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM enrollments
      WHERE enrollments.id = grades.enrollment_id
      AND enrollments.student_id = auth.uid()
    )
  );

CREATE POLICY "Admins can view all grades"
  ON grades FOR SELECT
  TO authenticated
  USING ((SELECT role FROM users WHERE id = auth.uid()) = 'admin');

CREATE POLICY "Only admins can create grades"
  ON grades FOR INSERT
  TO authenticated
  WITH CHECK ((SELECT role FROM users WHERE id = auth.uid()) = 'admin');

CREATE POLICY "Only admins can update grades"
  ON grades FOR UPDATE
  TO authenticated
  USING ((SELECT role FROM users WHERE id = auth.uid()) = 'admin')
  WITH CHECK ((SELECT role FROM users WHERE id = auth.uid()) = 'admin');

CREATE POLICY "Only admins can delete grades"
  ON grades FOR DELETE
  TO authenticated
  USING ((SELECT role FROM users WHERE id = auth.uid()) = 'admin');

CREATE INDEX idx_grades_enrollment_id ON grades(enrollment_id);
CREATE INDEX idx_grades_graded_by ON grades(graded_by);
