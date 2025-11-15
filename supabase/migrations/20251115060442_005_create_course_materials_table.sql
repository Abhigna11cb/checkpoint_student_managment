/*
  # Create course_materials table for course resources

  1. New Tables
    - `course_materials`
      - `id` (uuid, primary key) - Unique identifier
      - `course_id` (uuid, foreign key) - Reference to course
      - `title` (text) - Material title
      - `description` (text) - Material description
      - `file_url` (text) - URL to material file
      - `material_type` (text) - Type (lecture, assignment, resource)
      - `week_number` (integer) - Which week the material is for
      - `uploaded_by` (uuid, foreign key) - Admin who uploaded
      - `created_at` (timestamp) - Creation time
      - `updated_at` (timestamp) - Last update time

  2. Security
    - Enable RLS on course_materials table
    - Enrolled students can view materials for their courses
    - Admins can manage materials
*/

CREATE TABLE IF NOT EXISTS course_materials (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id uuid NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text,
  file_url text,
  material_type text NOT NULL CHECK (material_type IN ('lecture', 'assignment', 'resource')),
  week_number integer,
  uploaded_by uuid NOT NULL REFERENCES users(id) ON DELETE SET NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE course_materials ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Enrolled students can view course materials"
  ON course_materials FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM enrollments
      WHERE enrollments.course_id = course_materials.course_id
      AND enrollments.student_id = auth.uid()
      AND enrollments.status = 'approved'
    ) OR
    (SELECT role FROM users WHERE id = auth.uid()) = 'admin'
  );

CREATE POLICY "Only admins can create materials"
  ON course_materials FOR INSERT
  TO authenticated
  WITH CHECK ((SELECT role FROM users WHERE id = auth.uid()) = 'admin');

CREATE POLICY "Only admins can update materials"
  ON course_materials FOR UPDATE
  TO authenticated
  USING ((SELECT role FROM users WHERE id = auth.uid()) = 'admin')
  WITH CHECK ((SELECT role FROM users WHERE id = auth.uid()) = 'admin');

CREATE POLICY "Only admins can delete materials"
  ON course_materials FOR DELETE
  TO authenticated
  USING ((SELECT role FROM users WHERE id = auth.uid()) = 'admin');

CREATE INDEX idx_course_materials_course_id ON course_materials(course_id);
CREATE INDEX idx_course_materials_week_number ON course_materials(week_number);
