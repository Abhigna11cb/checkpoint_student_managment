import { useNavigate } from 'react-router-dom';
import { User, BookOpen, Send } from 'lucide-react';
import Navbar from '../components/Navbar';

function StudentDashboard() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const cards = [
    {
      title: 'My Profile',
      description: 'View and edit your personal details',
      icon: User,
      path: '/student/profile',
      color: 'from-blue-500 to-blue-600'
    },
    {
      title: 'My Courses',
      description: 'View your enrolled courses',
      icon: BookOpen,
      path: '/student/courses',
      color: 'from-green-500 to-green-600'
    },
    {
      title: 'Request New Course',
      description: 'Explore and enroll in new courses',
      icon: Send,
      path: '/student/request',
      color: 'from-purple-500 to-purple-600'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar userName={user.name} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-2xl p-8 mb-8 text-white shadow-xl">
          <h1 className="text-4xl font-bold mb-2">Welcome, {user.name}!</h1>
          <p className="text-blue-100 text-lg">Ready to continue your learning journey?</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cards.map((card) => {
            const Icon = card.icon;
            return (
              <div
                key={card.path}
                onClick={() => navigate(card.path)}
                className="bg-white rounded-xl shadow-md hover:shadow-2xl transition-all duration-300 cursor-pointer overflow-hidden group hover:scale-105"
              >
                <div className={`h-2 bg-gradient-to-r ${card.color}`}></div>
                <div className="p-6">
                  <div className={`w-16 h-16 rounded-full bg-gradient-to-r ${card.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 mb-2">{card.title}</h3>
                  <p className="text-gray-600">{card.description}</p>
                  <div className="mt-4 flex items-center text-blue-600 font-medium group-hover:translate-x-2 transition-transform duration-300">
                    <span>Learn more</span>
                    <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default StudentDashboard;
