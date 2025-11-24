import { useEffect, useMemo, useState } from 'react';
import { Search } from 'lucide-react';
import Navbar from '../components/Navbar';
import CourseCard from '../components/CourseCard';
import Toast from '../components/Toast';
import { Course, getCourses, requestEnrollment } from '../api/apiService';

function RequestCourse() {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const [searchQuery, setSearchQuery] = useState('');
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('Enrollment request sent successfully!');
  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isRequesting, setIsRequesting] = useState<string | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchCourses = async () => {
      setIsLoading(true);
      setError('');
      try {
        const data = await getCourses();
        setCourses(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load courses');
      } finally {
        setIsLoading(false);
      }
    };

    fetchCourses();
  }, []);

  const filteredCourses = useMemo(
    () =>
      courses.filter(
        (course) =>
          course.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          course.description.toLowerCase().includes(searchQuery.toLowerCase())
      ),
    [courses, searchQuery]
  );

  const handleRequest = async (courseId: string) => {
    setIsRequesting(courseId);
    setError('');
    try {
      await requestEnrollment({ courseId });
      setToastMessage('Enrollment request sent successfully!');
      setShowToast(true);
    } catch (err) {
      setToastMessage(err instanceof Error ? err.message : 'Failed to request enrollment');
      setShowToast(true);
    } finally {
      setIsRequesting(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar userName={user.name} />

      {showToast && (
        <Toast
          message={toastMessage}
          type={toastMessage.toLowerCase().includes('fail') ? 'error' : 'success'}
          onClose={() => setShowToast(false)}
        />
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-2xl p-8 mb-4 text-white shadow-xl">
          <h1 className="text-3xl font-bold mb-2">Request New Course</h1>
          <p className="text-blue-100 text-lg">Explore available courses and request enrollment</p>
        </div>

        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm font-medium">
            {error}
          </div>
        )}

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

        {isLoading ? (
          <div className="text-center py-16 text-gray-500">Loading courses...</div>
        ) : filteredCourses.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No courses found</h3>
            <p className="text-gray-500">Try adjusting your search query</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCourses.map((course) => (
              <CourseCard
                key={course.id}
                course={course}
                onRequest={() => handleRequest(course.id)}
                isRequesting={isRequesting === course.id}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default RequestCourse;
