import { useEffect, useState } from 'react';
import { Plus, Edit, Trash2, Calendar } from 'lucide-react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import ModalForm from '../components/ModalForm';
import Toast from '../components/Toast';
import {
  Course,
  createCourse,
  deleteCourse,
  getCourses,
  updateCourse
} from '../api/apiService';

const emptyForm = {
  name: '',
  description: '',
  startDate: '',
  endDate: ''
};

function ManageCourses() {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const [showModal, setShowModal] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [courses, setCourses] = useState<Course[]>([]);
  const [formData, setFormData] = useState(emptyForm);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

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

  useEffect(() => {
    fetchCourses();
  }, []);

  const handleAdd = () => {
    setEditingCourse(null);
    setFormData(emptyForm);
    setShowModal(true);
  };

  const handleEdit = (course: Course) => {
    setEditingCourse(course);
    setFormData({
      name: course.name,
      description: course.description,
      startDate: course.startDate?.split('T')[0] || course.startDate,
      endDate: course.endDate?.split('T')[0] || course.endDate
    });
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this course?')) {
      return;
    }
    setIsSubmitting(true);
    setError('');
    try {
      await deleteCourse(id);
      setCourses(courses.filter((c) => c.id !== id));
      setToastMessage('Course deleted successfully');
      setShowToast(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete course');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');
    try {
      if (editingCourse) {
        const updated = await updateCourse(editingCourse.id, formData);
        setCourses(courses.map((c) => (c.id === editingCourse.id ? updated : c)));
        setToastMessage('Course updated successfully');
      } else {
        const created = await createCourse(formData);
        setCourses([...courses, created]);
        setToastMessage('Course added successfully');
      }
      setShowModal(false);
      setShowToast(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save course');
    } finally {
      setIsSubmitting(false);
    }
  };

  const isUpcoming = (startDate: string) => {
    return new Date(startDate) > new Date();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar userName={user.name} />

      {showToast && (
        <Toast
          message={toastMessage}
          type="success"
          onClose={() => setShowToast(false)}
        />
      )}

      <div className="flex">
        <Sidebar />

        <div className="flex-1 p-8">
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="bg-gradient-to-r from-blue-600 to-blue-800 px-8 py-6 flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold text-white">Manage Courses</h1>
                <p className="text-blue-100 mt-1">Create and manage course offerings</p>
              </div>
              <button
                onClick={handleAdd}
                className="flex items-center gap-2 px-6 py-3 bg-white text-blue-600 rounded-lg hover:bg-blue-50 transition-all duration-200 hover:shadow-lg font-medium"
              >
                <Plus className="w-5 h-5" />
                Add Course
              </button>
            </div>

            <div className="p-8">
              {error && (
                <div className="mb-4 p-4 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm font-medium">
                  {error}
                </div>
              )}
              {isLoading ? (
                <div className="py-12 text-center text-gray-500">Loading courses...</div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b-2 border-gray-200">
                        <th className="text-left py-4 px-4 font-semibold text-gray-700">Name</th>
                        <th className="text-left py-4 px-4 font-semibold text-gray-700">Start Date</th>
                        <th className="text-left py-4 px-4 font-semibold text-gray-700">End Date</th>
                        <th className="text-left py-4 px-4 font-semibold text-gray-700">Status</th>
                        <th className="text-left py-4 px-4 font-semibold text-gray-700">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {courses.map((course, index) => (
                        <tr
                          key={course.id}
                          className={`border-b border-gray-100 hover:bg-blue-50 transition-colors ${
                            index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                          }`}
                        >
                          <td className="py-4 px-4">
                            <div>
                              <div className="font-medium text-gray-800">{course.name}</div>
                              <div className="text-sm text-gray-500 line-clamp-1">{course.description}</div>
                            </div>
                          </td>
                          <td className="py-4 px-4">
                            <div className="flex items-center gap-2 text-gray-600">
                              <Calendar className="w-4 h-4" />
                              <span>{course.startDate ? new Date(course.startDate).toLocaleDateString() : '—'}</span>
                            </div>
                          </td>
                          <td className="py-4 px-4">
                            <div className="flex items-center gap-2 text-gray-600">
                              <Calendar className="w-4 h-4" />
                              <span>{course.endDate ? new Date(course.endDate).toLocaleDateString() : '—'}</span>
                            </div>
                          </td>
                          <td className="py-4 px-4">
                            <span
                              className={`px-3 py-1 rounded-full text-sm font-medium border ${
                                isUpcoming(course.startDate)
                                  ? 'bg-blue-100 text-blue-700 border-blue-200'
                                  : 'bg-green-100 text-green-700 border-green-200'
                              }`}
                            >
                              {course.status?.toUpperCase() || (isUpcoming(course.startDate) ? 'Upcoming' : 'Active')}
                            </span>
                          </td>
                          <td className="py-4 px-4">
                            <div className="flex gap-2">
                              <button
                                onClick={() => handleEdit(course)}
                                className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors"
                                disabled={isSubmitting}
                              >
                                <Edit className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleDelete(course.id)}
                                className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                disabled={isSubmitting}
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
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

      <ModalForm
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={editingCourse ? 'Edit Course' : 'Add Course'}
      >
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Course Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              rows={3}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
            <input
              type="date"
              value={formData.startDate}
              onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">End Date</label>
            <input
              type="date"
              value={formData.endDate}
              onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={() => setShowModal(false)}
              className="flex-1 px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Saving...' : editingCourse ? 'Update' : 'Add'}
            </button>
          </div>
        </form>
      </ModalForm>
    </div>
  );
}

export default ManageCourses;
