import { useState } from 'react';
import { Plus, Edit, Trash2, Calendar } from 'lucide-react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import ModalForm from '../components/ModalForm';
import Toast from '../components/Toast';

interface Course {
  id: number;
  name: string;
  description: string;
  startDate: string;
  endDate: string;
}

function ManageCourses() {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const [showModal, setShowModal] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [courses, setCourses] = useState<Course[]>([
    {
      id: 1,
      name: 'Web Development Fundamentals',
      description: 'Learn HTML, CSS, and JavaScript basics',
      startDate: '2024-01-15',
      endDate: '2024-04-15'
    },
    {
      id: 2,
      name: 'React Advanced Patterns',
      description: 'Master React hooks and performance',
      startDate: '2024-02-01',
      endDate: '2024-05-01'
    },
    {
      id: 3,
      name: 'Database Design',
      description: 'Learn SQL and database architecture',
      startDate: '2024-03-10',
      endDate: '2024-06-10'
    }
  ]);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    startDate: '',
    endDate: ''
  });

  const handleAdd = () => {
    setEditingCourse(null);
    setFormData({ name: '', description: '', startDate: '', endDate: '' });
    setShowModal(true);
  };

  const handleEdit = (course: Course) => {
    setEditingCourse(course);
    setFormData(course);
    setShowModal(true);
  };

  const handleDelete = (id: number) => {
    if (confirm('Are you sure you want to delete this course?')) {
      setCourses(courses.filter(c => c.id !== id));
      setToastMessage('Course deleted successfully');
      setShowToast(true);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingCourse) {
      setCourses(courses.map(c => c.id === editingCourse.id ? { ...c, ...formData } : c));
      setToastMessage('Course updated successfully');
    } else {
      const newCourse = { id: courses.length + 1, ...formData };
      setCourses([...courses, newCourse]);
      setToastMessage('Course added successfully');
    }
    setShowModal(false);
    setShowToast(true);
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
                            <span>{new Date(course.startDate).toLocaleDateString()}</span>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-2 text-gray-600">
                            <Calendar className="w-4 h-4" />
                            <span>{new Date(course.endDate).toLocaleDateString()}</span>
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
                            {isUpcoming(course.startDate) ? 'Upcoming' : 'Active'}
                          </span>
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleEdit(course)}
                              className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDelete(course.id)}
                              className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors"
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
              className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 font-medium"
            >
              {editingCourse ? 'Update' : 'Add'}
            </button>
          </div>
        </form>
      </ModalForm>
    </div>
  );
}

export default ManageCourses;
