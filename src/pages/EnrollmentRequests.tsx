import { useEffect, useState } from 'react';
import { CheckCircle, XCircle } from 'lucide-react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import Toast from '../components/Toast';
import {
  approveEnrollment,
  EnrollmentSummary,
  getEnrollmentRequests,
  rejectEnrollment
} from '../api/apiService';

function EnrollmentRequests() {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [requests, setRequests] = useState<EnrollmentSummary[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isProcessing, setIsProcessing] = useState<string | null>(null);
  const [error, setError] = useState('');

  const fetchRequests = async () => {
    setIsLoading(true);
    setError('');
    try {
      const data = await getEnrollmentRequests();
      setRequests(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load enrollment requests');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleApprove = async (id: string) => {
    setIsProcessing(id);
    setError('');
    try {
      await approveEnrollment(id);
      setRequests(requests.map((r) => (r.id === id ? { ...r, status: 'Approved' } : r)));
      setToastMessage('Enrollment request approved successfully');
      setShowToast(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to approve enrollment');
    } finally {
      setIsProcessing(null);
    }
  };

  const handleReject = async (id: string) => {
    setIsProcessing(id);
    setError('');
    try {
      await rejectEnrollment(id);
      setRequests(requests.map((r) => (r.id === id ? { ...r, status: 'Rejected' } : r)));
      setToastMessage('Enrollment request rejected');
      setShowToast(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to reject enrollment');
    } finally {
      setIsProcessing(null);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Approved':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'Rejected':
        return 'bg-red-100 text-red-700 border-red-200';
      case 'Pending':
        return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
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
              <div className="bg-gradient-to-r from-blue-600 to-blue-800 px-8 py-6">
              <h1 className="text-3xl font-bold text-white">Enrollment Requests</h1>
              <p className="text-blue-100 mt-1">Review and manage student enrollment requests</p>
            </div>

            <div className="p-8">
                {error && (
                  <div className="mb-4 p-4 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm font-medium">
                    {error}
                  </div>
                )}
                {isLoading ? (
                  <div className="py-12 text-center text-gray-500">Loading requests...</div>
                ) : (
                  <>
                    <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b-2 border-gray-200">
                      <th className="text-left py-4 px-4 font-semibold text-gray-700">Student Name</th>
                      <th className="text-left py-4 px-4 font-semibold text-gray-700">Course</th>
                      <th className="text-left py-4 px-4 font-semibold text-gray-700">Status</th>
                      <th className="text-left py-4 px-4 font-semibold text-gray-700">Actions</th>
                    </tr>
                  </thead>
                        <tbody>
                    {requests.map((request, index) => (
                      <tr
                        key={request.id}
                        className={`border-b border-gray-100 hover:bg-blue-50 transition-colors ${
                          index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                        }`}
                      >
                        <td className="py-4 px-4 font-medium text-gray-800">{request.studentName}</td>
                        <td className="py-4 px-4 text-gray-600">{request.courseName}</td>
                        <td className="py-4 px-4">
                          <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(request.status)}`}>
                            {request.status}
                          </span>
                        </td>
                        <td className="py-4 px-4">
                          {request.status === 'Pending' ? (
                            <div className="flex gap-2">
                              <button
                                onClick={() => handleApprove(request.id)}
                                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all duration-200 hover:shadow-md font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                                disabled={isProcessing === request.id}
                              >
                                <CheckCircle className="w-4 h-4" />
                                {isProcessing === request.id ? 'Processing...' : 'Approve'}
                              </button>
                              <button
                                onClick={() => handleReject(request.id)}
                                className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all duration-200 hover:shadow-md font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                                disabled={isProcessing === request.id}
                              >
                                <XCircle className="w-4 h-4" />
                                Reject
                              </button>
                            </div>
                          ) : (
                            <span className="text-gray-500 italic">No action available</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

                    {requests.filter((r) => r.status === 'Pending').length === 0 && (
                <div className="text-center py-12">
                  <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="w-12 h-12 text-gray-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-700 mb-2">All caught up!</h3>
                  <p className="text-gray-500">No pending enrollment requests at the moment</p>
                  </div>
                )}
                  </>
                )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EnrollmentRequests;
