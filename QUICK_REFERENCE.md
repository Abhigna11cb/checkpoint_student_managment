# Database Schema - Quick Reference

## 7 Tables Overview

| # | Table | Purpose | Primary Key | Key Foreign Keys |
|---|-------|---------|-------------|------------------|
| 1 | **users** | Authentication & Basic Profile | id (UUID) | None |
| 2 | **courses** | Course Information | id (UUID) | created_by → users |
| 3 | **enrollments** | Enrollment Requests & Status | id (UUID) | student_id, course_id, approved_by → users |
| 4 | **student_profiles** | Extended Student Academic Data | id (UUID) | user_id → users |
| 5 | **course_materials** | Course Content (Lectures, Assignments) | id (UUID) | course_id → courses, uploaded_by → users |
| 6 | **grades** | Student Grades & Scores | id (UUID) | enrollment_id → enrollments, graded_by → users |
| 7 | **notifications** | System Notifications | id (UUID) | user_id → users |

---

## Table Details at a Glance

### 1️⃣ users
```
id (UUID, PK) → email (UNIQUE) → password_hash → name → role (student/admin)
→ phone (optional) → address (optional) → created_at → updated_at
```
**Use for:** Authentication, user info, permission checks

### 2️⃣ courses
```
id (UUID, PK) → name → description → start_date → end_date
→ capacity (default: 50) → enrolled_count → created_by (admin)
→ created_at → updated_at
```
**Use for:** Course listing, availability, capacity tracking

### 3️⃣ enrollments
```
id (UUID, PK) → student_id (FK) → course_id (FK)
→ status (pending/approved/rejected) → request_date → approved_date
→ approved_by (admin FK, optional) → created_at → updated_at

UNIQUE: (student_id, course_id) - prevents duplicate enrollments
```
**Use for:** Track student requests, approvals, enrollment status

### 4️⃣ student_profiles
```
id (UUID, PK) → user_id (FK, UNIQUE) → bio → gpa (default: 0.00)
→ total_credits (default: 0) → enrollment_year → created_at → updated_at
```
**Use for:** Academic metrics, student stats (1:1 with users)

### 5️⃣ course_materials
```
id (UUID, PK) → course_id (FK) → title → description → file_url
→ material_type (lecture/assignment/resource) → week_number
→ uploaded_by (admin FK) → created_at → updated_at
```
**Use for:** Store course content, materials, resources

### 6️⃣ grades
```
id (UUID, PK) → enrollment_id (FK) → assignment_name → score
→ max_score (default: 100) → percentage (GENERATED) → graded_date
→ graded_by (admin FK) → notes (optional) → created_at → updated_at
```
**Use for:** Track student performance, grades

### 7️⃣ notifications
```
id (UUID, PK) → user_id (FK) → type (enrollment/grade/announcement/system)
→ title → message → related_id (optional) → is_read (default: false)
→ read_at (optional) → created_at
```
**Use for:** System notifications, alerts

---

## Data Types Reference

| Type | Examples | Use Case |
|------|----------|----------|
| **UUID** | `gen_random_uuid()` | Primary keys, foreign keys |
| **TEXT** | names, emails, descriptions | Flexible string storage |
| **DATE** | start_date, end_date | Date without time |
| **TIMESTAMPTZ** | created_at, updated_at | Timezone-aware timestamps |
| **INTEGER** | capacity, week_number, total_credits | Whole numbers |
| **NUMERIC(n,m)** | NUMERIC(3,2) for GPA, NUMERIC(5,2) for scores | Precise decimal numbers |
| **BOOLEAN** | is_read, is_active | True/False |

---

## Constraints Quick Lookup

### Check Constraints (Allowed Values)
```
users.role          → 'student' OR 'admin'
enrollments.status  → 'pending' OR 'approved' OR 'rejected'
course_materials.material_type → 'lecture' OR 'assignment' OR 'resource'
notifications.type → 'enrollment' OR 'grade' OR 'announcement' OR 'system'
```

### Unique Constraints
```
users.email                         → UNIQUE
enrollments(student_id, course_id)  → UNIQUE (prevent duplicates)
student_profiles.user_id            → UNIQUE (1:1 relationship)
```

### Default Values
```
courses.capacity              → 50
courses.enrolled_count        → 0
enrollments.status            → 'pending'
student_profiles.gpa          → 0.00
student_profiles.total_credits→ 0
grades.max_score              → 100
notifications.is_read         → false
All created_at/updated_at     → now()
```

---

## RLS Security Summary

| Table | Authenticated User Can | Admin Can |
|-------|--------|---------|
| users | Read own, Update own | Read all, Update all |
| courses | Read all | Read all, Create, Update, Delete |
| enrollments | Read own, Create own | Read all, Update, Delete |
| student_profiles | Read own, Update own | Read all, Update all |
| course_materials | Read if enrolled+approved | Create, Update, Delete |
| grades | Read own | Create, Update, Delete |
| notifications | Read own, Mark read | Create, Delete |

---

## Sample Records

### users table
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "email": "student@example.com",
  "password_hash": "$argon2...",
  "name": "John Doe",
  "role": "student",
  "phone": "+1234567890",
  "address": "123 Main St, City, Country",
  "created_at": "2024-01-15T10:30:00Z",
  "updated_at": "2024-01-20T14:20:00Z"
}
```

### courses table
```json
{
  "id": "660e8400-e29b-41d4-a716-446655440111",
  "name": "Web Development Fundamentals",
  "description": "Learn HTML, CSS, and JavaScript basics",
  "start_date": "2024-01-15",
  "end_date": "2024-04-15",
  "capacity": 50,
  "enrolled_count": 23,
  "created_by": "550e8400-e29b-41d4-a716-446655440000",
  "created_at": "2024-01-10T08:00:00Z",
  "updated_at": "2024-01-20T12:00:00Z"
}
```

### enrollments table
```json
{
  "id": "770e8400-e29b-41d4-a716-446655440222",
  "student_id": "550e8400-e29b-41d4-a716-446655440000",
  "course_id": "660e8400-e29b-41d4-a716-446655440111",
  "status": "approved",
  "request_date": "2024-01-15T10:30:00Z",
  "approved_date": "2024-01-16T14:00:00Z",
  "approved_by": "880e8400-e29b-41d4-a716-446655440333",
  "created_at": "2024-01-15T10:30:00Z",
  "updated_at": "2024-01-16T14:00:00Z"
}
```

---

## Common Queries

### Get student's courses
```sql
SELECT c.* FROM courses c
JOIN enrollments e ON c.id = e.course_id
WHERE e.student_id = 'uuid' AND e.status = 'approved';
```

### Get pending requests
```sql
SELECT e.*, c.name, u.name as student_name
FROM enrollments e
JOIN courses c ON e.course_id = c.id
JOIN users u ON e.student_id = u.id
WHERE e.status = 'pending';
```

### Get student grades
```sql
SELECT g.*, c.name as course_name
FROM grades g
JOIN enrollments e ON g.enrollment_id = e.id
JOIN courses c ON e.course_id = c.id
WHERE e.student_id = 'uuid';
```

### Count enrollments by course
```sql
SELECT c.name, COUNT(e.id) as count
FROM courses c
LEFT JOIN enrollments e ON c.id = e.course_id
GROUP BY c.id, c.name;
```

---

## Migration Files Created

1. `001_create_users_table` - User authentication
2. `002_create_courses_table` - Course management
3. `003_create_enrollments_table` - Enrollment tracking
4. `004_create_student_profiles_table` - Student data
5. `005_create_course_materials_table` - Course content
6. `006_create_grades_table` - Grade tracking
7. `007_create_notifications_table` - Notifications

All migrations include:
- Detailed documentation comments
- RLS policy definitions
- Index creation
- Constraint definitions
- Foreign key relationships

---

## Performance Tips

1. Always use indexed columns in WHERE clauses
2. Enrollments queries are fast due to (student_id, course_id) indexes
3. Notifications may require archival for performance
4. Use generated column `percentage` for grade percentages
5. Cascading deletes prevent orphaned data

---

## Schema Maintenance

### Backup Strategy
- Regular automated backups via Supabase
- Point-in-time recovery enabled
- Replication for high availability

### Monitoring
- Monitor query performance on large tables
- Check notification table size monthly
- Verify index usage

### Scaling Considerations
- Consider archiving old notifications
- Implement soft deletes if needed
- Monitor database connection limits

