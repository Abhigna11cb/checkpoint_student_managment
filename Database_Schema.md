# Student Portal - Database Schema Documentation

## Overview

The Student Portal uses a comprehensive relational database with 7 tables, all with Row Level Security (RLS) enabled. This ensures data privacy and proper access control based on user roles.

---

## Table Structure

### 1. **users** Table
Core user authentication and profile information.

| Column | Type | Constraints | Description |
|--------|------|-----------|-------------|
| `id` | UUID | PRIMARY KEY, Default: gen_random_uuid() | Unique user identifier |
| `email` | TEXT | UNIQUE, NOT NULL | User's email address |
| `password_hash` | TEXT | NOT NULL | Hashed password (use bcrypt/argon2) |
| `name` | TEXT | NOT NULL | Full name |
| `role` | TEXT | NOT NULL, CHECK: 'student' \| 'admin' | User role |
| `phone` | TEXT | NULLABLE | Phone number |
| `address` | TEXT | NULLABLE | Physical address |
| `created_at` | TIMESTAMPTZ | Default: now() | Account creation timestamp |
| `updated_at` | TIMESTAMPTZ | Default: now() | Last update timestamp |

**Indexes:**
- `idx_users_email` - Email lookup
- `idx_users_role` - Role filtering

**RLS Policies:**
- Users can read their own data
- Admins can read all users
- Users can update their own data

---

### 2. **courses** Table
Course information and enrollment tracking.

| Column | Type | Constraints | Description |
|--------|------|-----------|-------------|
| `id` | UUID | PRIMARY KEY, Default: gen_random_uuid() | Unique course identifier |
| `name` | TEXT | NOT NULL | Course name |
| `description` | TEXT | NOT NULL | Course description |
| `start_date` | DATE | NOT NULL | Course start date |
| `end_date` | DATE | NOT NULL | Course end date |
| `capacity` | INTEGER | NOT NULL, Default: 50 | Maximum enrollments |
| `enrolled_count` | INTEGER | NOT NULL, Default: 0 | Current enrollment count |
| `created_by` | UUID | FOREIGN KEY → users(id), NOT NULL | Admin who created course |
| `created_at` | TIMESTAMPTZ | Default: now() | Creation timestamp |
| `updated_at` | TIMESTAMPTZ | Default: now() | Last update timestamp |

**Indexes:**
- `idx_courses_start_date` - Course date range queries
- `idx_courses_created_by` - Filter by admin

**RLS Policies:**
- Anyone can view courses
- Only admins can insert courses
- Only admins can update courses
- Only admins can delete courses

---

### 3. **enrollments** Table
Student course enrollment and request tracking.

| Column | Type | Constraints | Description |
|--------|------|-----------|-------------|
| `id` | UUID | PRIMARY KEY, Default: gen_random_uuid() | Unique enrollment identifier |
| `student_id` | UUID | FOREIGN KEY → users(id), NOT NULL | Student user ID |
| `course_id` | UUID | FOREIGN KEY → courses(id), NOT NULL | Course ID |
| `status` | TEXT | NOT NULL, CHECK: 'pending' \| 'approved' \| 'rejected', Default: 'pending' | Enrollment status |
| `request_date` | TIMESTAMPTZ | Default: now() | Request submission time |
| `approved_date` | TIMESTAMPTZ | NULLABLE | Approval timestamp |
| `approved_by` | UUID | FOREIGN KEY → users(id), NULLABLE | Admin who approved |
| `created_at` | TIMESTAMPTZ | Default: now() | Creation timestamp |
| `updated_at` | TIMESTAMPTZ | Default: now() | Last update timestamp |

**Constraints:**
- UNIQUE(student_id, course_id) - Prevent duplicate enrollments

**Indexes:**
- `idx_enrollments_student_id` - Get student's enrollments
- `idx_enrollments_course_id` - Get course's enrollments
- `idx_enrollments_status` - Filter by status
- `idx_enrollments_request_date` - Sort by request time

**RLS Policies:**
- Students can view their own enrollments
- Admins can view all enrollments
- Students can request enrollment
- Only admins can update/delete enrollments

---

### 4. **student_profiles** Table
Extended student information and academic data.

| Column | Type | Constraints | Description |
|--------|------|-----------|-------------|
| `id` | UUID | PRIMARY KEY, Default: gen_random_uuid() | Unique profile identifier |
| `user_id` | UUID | FOREIGN KEY → users(id), UNIQUE, NOT NULL | Reference to student user |
| `bio` | TEXT | NULLABLE | Student biography |
| `gpa` | NUMERIC(3,2) | Default: 0.00 | Current GPA (0.00-4.00) |
| `total_credits` | INTEGER | Default: 0 | Credits completed |
| `enrollment_year` | INTEGER | NULLABLE | Year of enrollment |
| `created_at` | TIMESTAMPTZ | Default: now() | Creation timestamp |
| `updated_at` | TIMESTAMPTZ | Default: now() | Last update timestamp |

**Constraints:**
- One-to-one relationship with users table
- Only students have profiles

**Indexes:**
- `idx_student_profiles_user_id` - Profile lookup by user

**RLS Policies:**
- Students can view their own profile
- Admins can view all profiles
- Students can update their own profile
- Admins can update student profiles

---

### 5. **course_materials** Table
Course content (lectures, assignments, resources).

| Column | Type | Constraints | Description |
|--------|------|-----------|-------------|
| `id` | UUID | PRIMARY KEY, Default: gen_random_uuid() | Unique material identifier |
| `course_id` | UUID | FOREIGN KEY → courses(id), NOT NULL | Reference to course |
| `title` | TEXT | NOT NULL | Material title |
| `description` | TEXT | NULLABLE | Material description |
| `file_url` | TEXT | NULLABLE | URL to material file |
| `material_type` | TEXT | NOT NULL, CHECK: 'lecture' \| 'assignment' \| 'resource' | Type of material |
| `week_number` | INTEGER | NULLABLE | Which week (1-16) |
| `uploaded_by` | UUID | FOREIGN KEY → users(id), NOT NULL | Admin who uploaded |
| `created_at` | TIMESTAMPTZ | Default: now() | Creation timestamp |
| `updated_at` | TIMESTAMPTZ | Default: now() | Last update timestamp |

**Indexes:**
- `idx_course_materials_course_id` - Get materials for course
- `idx_course_materials_week_number` - Filter by week

**RLS Policies:**
- Enrolled students can view materials for their courses
- Admins can create/update/delete materials

---

### 6. **grades** Table
Student assignment and exam grades.

| Column | Type | Constraints | Description |
|--------|------|-----------|-------------|
| `id` | UUID | PRIMARY KEY, Default: gen_random_uuid() | Unique grade identifier |
| `enrollment_id` | UUID | FOREIGN KEY → enrollments(id), NOT NULL | Reference to enrollment |
| `assignment_name` | TEXT | NOT NULL | Name of assignment/exam |
| `score` | NUMERIC(5,2) | NOT NULL | Score obtained |
| `max_score` | NUMERIC(5,2) | NOT NULL, Default: 100 | Maximum possible score |
| `percentage` | NUMERIC(5,2) | GENERATED (score/max_score*100) | Auto-calculated percentage |
| `graded_date` | TIMESTAMPTZ | Default: now() | When grade was assigned |
| `graded_by` | UUID | FOREIGN KEY → users(id), NOT NULL | Admin who graded |
| `notes` | TEXT | NULLABLE | Feedback/comments |
| `created_at` | TIMESTAMPTZ | Default: now() | Creation timestamp |
| `updated_at` | TIMESTAMPTZ | Default: now() | Last update timestamp |

**Indexes:**
- `idx_grades_enrollment_id` - Get grades for enrollment
- `idx_grades_graded_by` - Filter by grader

**RLS Policies:**
- Students can view their own grades
- Admins can view all grades
- Only admins can create/update/delete grades

---

### 7. **notifications** Table
System notifications for users.

| Column | Type | Constraints | Description |
|--------|------|-----------|-------------|
| `id` | UUID | PRIMARY KEY, Default: gen_random_uuid() | Unique notification identifier |
| `user_id` | UUID | FOREIGN KEY → users(id), NOT NULL | Target user |
| `type` | TEXT | NOT NULL, CHECK: 'enrollment' \| 'grade' \| 'announcement' \| 'system' | Notification type |
| `title` | TEXT | NOT NULL | Notification title |
| `message` | TEXT | NOT NULL | Notification message |
| `related_id` | UUID | NULLABLE | ID of related record |
| `is_read` | BOOLEAN | Default: false | Read status |
| `read_at` | TIMESTAMPTZ | NULLABLE | When notification was read |
| `created_at` | TIMESTAMPTZ | Default: now() | Creation timestamp |

**Indexes:**
- `idx_notifications_user_id` - Get user's notifications
- `idx_notifications_is_read` - Filter unread notifications
- `idx_notifications_created_at` - Sort by creation time

**RLS Policies:**
- Users can view their own notifications
- Users can mark their notifications as read
- Only admins can create notifications
- Only admins can delete notifications

---

## Relationships Diagram

```
users (1) ──────────── (N) courses
  │                       │
  │                       │
  ├─── (1) ──────────── (1) student_profiles
  │
  ├─ (1) ──────────── (N) enrollments ──────────── (N) courses
  │
  ├─ (1) ──────────── (N) course_materials ──────────── (N) courses
  │
  ├─ (1) ──────────── (N) grades ──────────── (N) enrollments
  │
  └─ (1) ──────────── (N) notifications
```

---

## Key Features

### Row Level Security (RLS)
All tables have RLS enabled to ensure:
- Users can only access their own data
- Admins have full access
- Enrollment data is private
- Academic records are confidential

### Data Integrity
- Foreign key constraints prevent orphaned data
- CHECK constraints enforce valid values
- UNIQUE constraints prevent duplicates
- Generated columns calculate percentage automatically

### Performance
- Strategic indexes on frequently queried columns
- Foreign key indexes for joins
- Status and date indexes for filtering

### Audit Trail
- `created_at` and `updated_at` timestamps on all tables
- Track who created/modified content
- Historical data preservation

---

## Access Control Matrix

| Table | Student Read | Student Write | Admin Read | Admin Write |
|-------|--------------|---------------|-----------|------------|
| users | Own only | Own only | All | All |
| courses | All | None | All | All |
| enrollments | Own only | Own (request) | All | All |
| student_profiles | Own only | Own | All | All |
| course_materials | Enrolled courses | None | All | All |
| grades | Own only | None | All | All |
| notifications | Own only | Own (mark read) | All | All |

---

## Migration Strategy

All tables are created through Supabase migrations with:
1. Proper migration naming (001_*, 002_*, etc.)
2. Detailed documentation in migration comments
3. Comprehensive RLS policy setup
4. Index creation for performance
5. Constraint definitions for data integrity

---

## Future Considerations

1. **Archiving** - Soft delete for historical records
2. **Audit Logging** - Track all data changes
3. **Full-text Search** - Enable on descriptions
4. **Caching** - Redis for frequently accessed data
5. **Replication** - Database backup strategy
6. **Analytics** - Summary tables for reporting

---

## Example Queries

### Get student's enrolled courses
```sql
SELECT c.* FROM courses c
INNER JOIN enrollments e ON c.id = e.course_id
WHERE e.student_id = 'uuid' AND e.status = 'approved';
```

### Get pending enrollment requests
```sql
SELECT e.*, c.name, u.name as student_name
FROM enrollments e
JOIN courses c ON e.course_id = c.id
JOIN users u ON e.student_id = u.id
WHERE e.status = 'pending'
ORDER BY e.request_date DESC;
```

### Get student's grades with course info
```sql
SELECT g.*, c.name as course_name, e.id as enrollment_id
FROM grades g
JOIN enrollments e ON g.enrollment_id = e.id
JOIN courses c ON e.course_id = c.id
WHERE e.student_id = 'uuid'
ORDER BY g.graded_date DESC;
```

### Get course analytics
```sql
SELECT
  c.id,
  c.name,
  COUNT(e.id) as total_enrollments,
  COUNT(CASE WHEN e.status = 'approved' THEN 1 END) as approved,
  COUNT(CASE WHEN e.status = 'pending' THEN 1 END) as pending,
  AVG(g.percentage) as avg_grade
FROM courses c
LEFT JOIN enrollments e ON c.id = e.course_id
LEFT JOIN grades g ON e.id = g.enrollment_id
GROUP BY c.id, c.name;
```
