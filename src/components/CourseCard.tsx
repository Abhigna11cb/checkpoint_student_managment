import { Calendar, Send } from 'lucide-react';

interface CourseCardProps {
  course: {
    id: string;
    name: string;
    description: string;
    startDate: string;
  };
  onRequest: () => void;
  isRequesting?: boolean;
}

function CourseCard({ course, onRequest, isRequesting }: CourseCardProps) {
  return (
    <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 hover:scale-105 overflow-hidden border border-gray-100">
      <div className="h-2 bg-gradient-to-r from-blue-600 to-blue-800"></div>
      <div className="p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-2">{course.name}</h3>
        <p className="text-gray-600 mb-4 line-clamp-2">{course.description}</p>
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
          <Calendar className="w-4 h-4" />
          <span>Starts: {course.startDate ? new Date(course.startDate).toLocaleDateString() : 'TBD'}</span>
        </div>
        <button
          onClick={onRequest}
          disabled={isRequesting}
          className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 hover:shadow-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Send className="w-4 h-4" />
          {isRequesting ? 'Sending...' : 'Request Enrollment'}
        </button>
      </div>
    </div>
  );
}

export default CourseCard;
