# Student Portal Web Application (POC)

A professional, dynamic Student Portal web application built with React and modern web technologies.

## Features

### Student Features
- Login/Signup with email and password
- Personal dashboard with quick navigation
- View and edit profile information
- View enrolled courses with status tracking
- Request enrollment in new courses
- Search and filter functionality

### Admin Features
- Admin dashboard with system overview
- Manage students (Add, Edit, Delete)
- Manage courses (Add, Edit, Delete)
- Review and approve/reject enrollment requests
- Real-time status updates

## Technology Stack

### Frontend
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **Routing**: React Router DOM v6
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Fonts**: Inter (Google Fonts)

### Backend
- **Framework**: Node.js + Express
- **CORS**: Enabled for cross-origin requests
- **Data**: In-memory dummy data (not connected)

## Project Structure

```
student-portal/
├── backend/
│   ├── server.js
│   ├── package.json
│   └── routes/
│       ├── auth.js
│       ├── students.js
│       ├── courses.js
│       ├── enrollments.js
│       └── admin.js
│
└── src/
    ├── App.tsx (Main routing)
    ├── index.css (Global styles)
    ├── main.tsx
    ├── components/
    │   ├── Navbar.tsx
    │   ├── Sidebar.tsx
    │   ├── CourseCard.tsx
    │   ├── ModalForm.tsx
    │   └── Toast.tsx
    └── pages/
        ├── Login.tsx
        ├── StudentDashboard.tsx
        ├── StudentProfile.tsx
        ├── MyCourses.tsx
        ├── RequestCourse.tsx
        ├── AdminDashboard.tsx
        ├── ManageStudents.tsx
        ├── ManageCourses.tsx
        └── EnrollmentRequests.tsx
```

## Demo Credentials

### Student Account
- **Email**: student@test.com
- **Password**: student123

### Admin Account
- **Email**: admin@test.com
- **Password**: admin123

## Running the Application

### Frontend (React + Vite)

The frontend is already configured and ready to run:

```bash
npm install
npm run dev
```

The application will start on `http://localhost:5173`

### Backend (Node.js + Express)

The backend is set up but not connected. To run it:

```bash
cd backend
npm install
npm start
```

The backend will run on `http://localhost:3001`

**Note**: Currently, the frontend uses dummy data and does not connect to the backend API.

## Design Highlights

- **Color Palette**: Blue gradient theme (#2563eb to #1e40af)
- **Typography**: Inter font family with multiple weights
- **UI Components**: Clean cards with soft shadows and rounded corners
- **Animations**: Smooth transitions, hover effects, and fade-in animations
- **Responsive**: Fully responsive design for mobile, tablet, and desktop
- **Toast Notifications**: Success/error feedback for user actions
- **Modal Forms**: Clean modal interface for add/edit operations

## Routes

### Student Routes
- `/login` - Login/Signup page
- `/student/dashboard` - Student dashboard
- `/student/profile` - View and edit profile
- `/student/courses` - View enrolled courses
- `/student/request` - Request new courses

### Admin Routes
- `/admin/dashboard` - Admin dashboard
- `/admin/students` - Manage students
- `/admin/courses` - Manage courses
- `/admin/requests` - Review enrollment requests

## Protected Routes

All routes are protected with role-based authentication:
- Student routes require `role: "student"`
- Admin routes require `role: "admin"`
- Unauthorized access redirects to login

## Future Enhancements

- Connect frontend to backend API
- Add SQLite database integration
- Implement real authentication with JWT
- Add pagination for tables
- Add sorting and advanced filtering
- Email notifications for enrollment requests
- File upload for profile pictures
- Course materials and assignments
- Progress tracking and analytics
