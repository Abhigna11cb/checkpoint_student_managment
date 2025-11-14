import { useState } from 'react';
import { User, Mail, Phone, MapPin, Edit, Save, X } from 'lucide-react';
import Navbar from '../components/Navbar';
import Toast from '../components/Toast';

function StudentProfile() {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const [isEditing, setIsEditing] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [profile, setProfile] = useState({
    name: user.name || 'John Doe',
    email: user.email || 'student@test.com',
    phone: '+1234567890',
    address: '123 Main St, City, Country'
  });
  const [editedProfile, setEditedProfile] = useState({ ...profile });

  const handleSave = () => {
    setProfile(editedProfile);
    setIsEditing(false);
    setShowToast(true);
  };

  const handleCancel = () => {
    setEditedProfile({ ...profile });
    setIsEditing(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar userName={user.name} />

      {showToast && (
        <Toast
          message="Profile updated successfully!"
          type="success"
          onClose={() => setShowToast(false)}
        />
      )}

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-blue-800 px-8 py-6">
            <h1 className="text-3xl font-bold text-white">My Profile</h1>
            <p className="text-blue-100 mt-1">Manage your personal information</p>
          </div>

          <div className="p-8">
            <div className="flex flex-col lg:flex-row gap-8">
              <div className="lg:w-1/3 flex flex-col items-center">
                <div className="w-48 h-48 bg-gradient-to-br from-blue-500 to-blue-700 rounded-full flex items-center justify-center mb-4 shadow-xl">
                  <User className="w-24 h-24 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-gray-800 mb-1">{profile.name}</h2>
                <p className="text-gray-500">Student</p>
              </div>

              <div className="lg:w-2/3">
                <div className="flex justify-end mb-6">
                  {!isEditing ? (
                    <button
                      onClick={() => setIsEditing(true)}
                      className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 hover:shadow-lg font-medium"
                    >
                      <Edit className="w-5 h-5" />
                      Edit Profile
                    </button>
                  ) : (
                    <div className="flex gap-3">
                      <button
                        onClick={handleCancel}
                        className="flex items-center gap-2 px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-all duration-200 hover:shadow-lg font-medium"
                      >
                        <X className="w-5 h-5" />
                        Cancel
                      </button>
                      <button
                        onClick={handleSave}
                        className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg hover:from-green-700 hover:to-green-800 transition-all duration-200 hover:shadow-lg font-medium"
                      >
                        <Save className="w-5 h-5" />
                        Save Changes
                      </button>
                    </div>
                  )}
                </div>

                <div className="space-y-6">
                  <div>
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                      <User className="w-4 h-4" />
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={isEditing ? editedProfile.name : profile.name}
                      onChange={(e) => setEditedProfile({ ...editedProfile, name: e.target.value })}
                      disabled={!isEditing}
                      className={`w-full px-4 py-3 border border-gray-300 rounded-lg transition-all ${
                        isEditing
                          ? 'focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                          : 'bg-gray-50 cursor-not-allowed'
                      }`}
                    />
                  </div>

                  <div>
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                      <Mail className="w-4 h-4" />
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={profile.email}
                      disabled
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 cursor-not-allowed"
                    />
                    <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
                  </div>

                  <div>
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                      <Phone className="w-4 h-4" />
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      value={isEditing ? editedProfile.phone : profile.phone}
                      onChange={(e) => setEditedProfile({ ...editedProfile, phone: e.target.value })}
                      disabled={!isEditing}
                      className={`w-full px-4 py-3 border border-gray-300 rounded-lg transition-all ${
                        isEditing
                          ? 'focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                          : 'bg-gray-50 cursor-not-allowed'
                      }`}
                    />
                  </div>

                  <div>
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                      <MapPin className="w-4 h-4" />
                      Address
                    </label>
                    <textarea
                      value={isEditing ? editedProfile.address : profile.address}
                      onChange={(e) => setEditedProfile({ ...editedProfile, address: e.target.value })}
                      disabled={!isEditing}
                      rows={3}
                      className={`w-full px-4 py-3 border border-gray-300 rounded-lg transition-all resize-none ${
                        isEditing
                          ? 'focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                          : 'bg-gray-50 cursor-not-allowed'
                      }`}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default StudentProfile;
