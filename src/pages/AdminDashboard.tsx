import { Users, BookOpen, ClipboardList } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';

function AdminDashboard() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const stats = [
    {
      title: 'Total Students',
      count: 25,
      icon: Users,
      color: 'from-blue-500 to-blue-600',
      path: '/admin/students'
    },
    {
      title: 'Total Courses',
      count: 12,
      icon: BookOpen,
      color: 'from-green-500 to-green-600',
      path: '/admin/courses'
    },
    {
      title: 'Pending Requests',
      count: 8,
      icon: ClipboardList,
      color: 'from-purple-500 to-purple-600',
      path: '/admin/requests'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar userName={user.name} />

      <div className="flex">
        <Sidebar />

        <div className="flex-1 p-8">
          <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-2xl p-8 mb-8 text-white shadow-xl">
            <h1 className="text-4xl font-bold mb-2">Admin Dashboard</h1>
            <p className="text-blue-100 text-lg">Welcome back! Here's an overview of the system</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {stats.map((stat) => {
              const Icon = stat.icon;
              return (
                <div
                  key={stat.title}
                  onClick={() => navigate(stat.path)}
                  className="bg-white rounded-xl shadow-md hover:shadow-2xl transition-all duration-300 cursor-pointer overflow-hidden group hover:scale-105"
                >
                  <div className={`h-2 bg-gradient-to-r ${stat.color}`}></div>
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className={`w-16 h-16 rounded-full bg-gradient-to-r ${stat.color} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                        <Icon className="w-8 h-8 text-white" />
                      </div>
                      <div className="text-right">
                        <div className="text-4xl font-bold text-gray-800">{stat.count}</div>
                      </div>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-700">{stat.title}</h3>
                    <div className="mt-4 flex items-center text-blue-600 font-medium group-hover:translate-x-2 transition-transform duration-300">
                      <span>View details</span>
                      <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl shadow-md p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Recent Activity</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                  <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                  <span className="text-gray-700">New student registered: Jane Smith</span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                  <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                  <span className="text-gray-700">Course approved: Web Development</span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg">
                  <div className="w-2 h-2 bg-purple-600 rounded-full"></div>
                  <span className="text-gray-700">New enrollment request received</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-md p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <button
                  onClick={() => navigate('/admin/students')}
                  className="w-full text-left p-3 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors flex items-center gap-3"
                >
                  <Users className="w-5 h-5 text-blue-600" />
                  <span className="font-medium text-gray-700">Add New Student</span>
                </button>
                <button
                  onClick={() => navigate('/admin/courses')}
                  className="w-full text-left p-3 bg-green-50 hover:bg-green-100 rounded-lg transition-colors flex items-center gap-3"
                >
                  <BookOpen className="w-5 h-5 text-green-600" />
                  <span className="font-medium text-gray-700">Create New Course</span>
                </button>
                <button
                  onClick={() => navigate('/admin/requests')}
                  className="w-full text-left p-3 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors flex items-center gap-3"
                >
                  <ClipboardList className="w-5 h-5 text-purple-600" />
                  <span className="font-medium text-gray-700">Review Requests</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
