/*
  # Create notifications table for system notifications

  1. New Tables
    - `notifications`
      - `id` (uuid, primary key) - Unique identifier
      - `user_id` (uuid, foreign key) - Target user
      - `type` (text) - Notification type (enrollment, grade, announcement)
      - `title` (text) - Notification title
      - `message` (text) - Notification message
      - `related_id` (uuid) - ID of related record (enrollment, course, etc)
      - `is_read` (boolean) - Whether notification is read
      - `read_at` (timestamp) - When notification was read
      - `created_at` (timestamp) - Creation time

  2. Security
    - Enable RLS on notifications table
    - Users can view their own notifications
    - System/admins can create notifications
*/

CREATE TABLE IF NOT EXISTS notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  type text NOT NULL CHECK (type IN ('enrollment', 'grade', 'announcement', 'system')),
  title text NOT NULL,
  message text NOT NULL,
  related_id uuid,
  is_read boolean DEFAULT false,
  read_at timestamptz,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own notifications"
  ON notifications FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can mark their notifications as read"
  ON notifications FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Only admins can create notifications"
  ON notifications FOR INSERT
  TO authenticated
  WITH CHECK ((SELECT role FROM users WHERE id = auth.uid()) = 'admin');

CREATE POLICY "Only admins can delete notifications"
  ON notifications FOR DELETE
  TO authenticated
  USING ((SELECT role FROM users WHERE id = auth.uid()) = 'admin');

CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_is_read ON notifications(is_read);
CREATE INDEX idx_notifications_created_at ON notifications(created_at);
