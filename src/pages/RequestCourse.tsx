import { useState } from 'react';
import { Search } from 'lucide-react';
import Navbar from '../components/Navbar';
import CourseCard from '../components/CourseCard';
import Toast from '../components/Toast';

function RequestCourse() {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const [searchQuery, setSearchQuery] = useState('');
  const [showToast, setShowToast] = useState(false);

  const courses = [
    {
      id: 1,
      name: 'Web Development Fundamentals',
      description: 'Learn HTML, CSS, and JavaScript basics to build modern websites',
      startDate: '2024-01-15'
    },
    {
      id: 2,
      name: 'React Advanced Patterns',
      description: 'Master React hooks, context, and performance optimization techniques',
      startDate: '2024-02-01'
    },
    {
      id: 3,
      name: 'Database Design',
      description: 'Learn SQL and database architecture principles for scalable applications',
      startDate: '2024-03-10'
    },
    {
      id: 4,
      name: 'Node.js Backend Development',
      description: 'Build scalable backend applications with Node.js and Express',
      startDate: '2024-04-01'
    },
    {
      id: 5,
      name: 'UI/UX Design Principles',
      description: 'Create beautiful and user-friendly interfaces with modern design principles',
      startDate: '2024-05-15'
    },
    {
      id: 6,
      name: 'Cloud Computing with AWS',
      description: 'Deploy and manage applications on Amazon Web Services cloud platform',
      startDate: '2024-06-01'
    }
  ];

  const filteredCourses = courses.filter(course =>
    course.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    course.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleRequest = (courseId: number, courseName: string) => {
    setShowToast(true);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar userName={user.name} />

      {showToast && (
        <Toast
          message="Enrollment request sent successfully!"
          type="success"
          onClose={() => setShowToast(false)}
        />
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-2xl p-8 mb-8 text-white shadow-xl">
          <h1 className="text-3xl font-bold mb-2">Request New Course</h1>
          <p className="text-blue-100 text-lg">Explore available courses and request enrollment</p>
        </div>

        <div className="mb-8">
          <div className="relative max-w-2xl">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search courses by name or description..."
              className="w-full pl-12 pr-4 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-md"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map(course => (
            <CourseCard
              key={course.id}
              course={course}
              onRequest={handleRequest}
            />
          ))}
        </div>

        {filteredCourses.length === 0 && (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No courses found</h3>
            <p className="text-gray-500">Try adjusting your search query</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default RequestCourse;
