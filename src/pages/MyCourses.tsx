import { useEffect, useMemo, useState } from 'react';
import { Calendar, Filter } from 'lucide-react';
import Navbar from '../components/Navbar';
import { EnrollmentSummary, getMyCourses } from '../api/apiService';

const normalizeStatus = (status?: string) => {
  if (!status) return 'Pending';
  const lowered = status.toLowerCase();
  if (lowered.includes('approve')) return 'Approved';
  if (lowered.includes('reject') || lowered.includes('decline')) return 'Rejected';
  if (lowered.includes('pending')) return 'Pending';
  return status;
};

function MyCourses() {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const [filter, setFilter] = useState('All');
  const [courses, setCourses] = useState<EnrollmentSummary[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchCourses = async () => {
      setIsLoading(true);
      setError('');
      try {
        const data = await getMyCourses();
        setCourses(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load your courses');
      } finally {
        setIsLoading(false);
      }
    };

    fetchCourses();
  }, []);

  const filters = useMemo(() => {
    const unique = Array.from(new Set(courses.map((course) => normalizeStatus(course.status))));
    return ['All', ...unique];
  }, [courses]);

  const filteredCourses = useMemo(() => {
    if (filter === 'All') {
      return courses;
    }
    return courses.filter((course) => normalizeStatus(course.status) === filter);
  }, [courses, filter]);

  const getStatusColor = (status?: string) => {
    const normalized = normalizeStatus(status);
    switch (normalized) {
      case 'Approved':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'Pending':
        return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'Rejected':
        return 'bg-red-100 text-red-700 border-red-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar userName={user.name} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-blue-800 px-8 py-6">
            <h1 className="text-3xl font-bold text-white">My Courses</h1>
            <p className="text-blue-100 mt-1">Track your enrolled courses and their status</p>
          </div>

          <div className="p-8">
            <div className="flex items-center gap-4 mb-6">
              <Filter className="w-5 h-5 text-gray-600" />
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {filters.map((option) => (
                  <option key={option}>{option}</option>
                ))}
              </select>
            </div>

            {error && (
              <div className="mb-4 p-4 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm font-medium">
                {error}
              </div>
            )}

            {isLoading ? (
              <div className="text-center py-16 text-gray-500">Loading your courses...</div>
            ) : filteredCourses.length === 0 ? (
              <div className="text-center py-16">
                <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Calendar className="w-12 h-12 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-700 mb-2">No courses found</h3>
                <p className="text-gray-500">No courses match your filter criteria</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b-2 border-gray-200">
                      <th className="text-left py-4 px-4 font-semibold text-gray-700">Course Name</th>
                      <th className="text-left py-4 px-4 font-semibold text-gray-700">Start Date</th>
                      <th className="text-left py-4 px-4 font-semibold text-gray-700">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredCourses.map((course, index) => (
                      <tr
                        key={course.id}
                        className={`border-b border-gray-100 hover:bg-blue-50 transition-colors ${
                          index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                        }`}
                      >
                        <td className="py-4 px-4">
                          <span className="font-medium text-gray-800">
                            {course.courseName || 'Course'}
                          </span>
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-2 text-gray-600">
                            <Calendar className="w-4 h-4" />
                            <span>
                              {course.startDate ? new Date(course.startDate).toLocaleDateString() : 'TBD'}
                            </span>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(course.status)}`}>
                            {normalizeStatus(course.status)}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default MyCourses;
