import { useEffect, useState } from 'react';
import { User, Mail, Phone, MapPin, Edit, Save, X, Award, BookOpen, GraduationCap, FileText } from 'lucide-react';
import Navbar from '../components/Navbar';
import Toast from '../components/Toast';
import { getMyProfile, upsertMyProfile } from '../api/apiService';

interface UiProfile {
  name: string;
  email: string;
  phone: string;
  address: string;
  gpa: string;
  totalCredits: string;
  enrollmentYear: string;
  bio: string;
  role?: string;
}

const normalizeProfile = (data: Partial<Record<string, unknown>>, fallback: UiProfile): UiProfile => ({
  name: typeof data.name === 'string' && data.name.length ? data.name : fallback.name,
  email: typeof data.email === 'string' && data.email.length ? data.email : fallback.email,
  phone: typeof data.phone === 'string' ? data.phone : fallback.phone,
  address: typeof data.address === 'string' ? data.address : fallback.address,
  gpa: data.gpa !== undefined && data.gpa !== null ? String(data.gpa) : fallback.gpa,
  totalCredits: data.totalCredits !== undefined && data.totalCredits !== null ? String(data.totalCredits) : fallback.totalCredits,
  enrollmentYear: data.enrollmentYear !== undefined && data.enrollmentYear !== null ? String(data.enrollmentYear) : fallback.enrollmentYear,
  bio: typeof data.bio === 'string' ? data.bio : fallback.bio,
  role: typeof data.role === 'string' ? data.role : fallback.role
});

function StudentProfile() {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const [isEditing, setIsEditing] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  const initialProfile: UiProfile = {
    name: user.name || 'John Doe',
    email: user.email || 'student@test.com',
    phone: '+1234567890',
    address: '123 Main St, City, Country',
    gpa: '0',
    totalCredits: '0',
    enrollmentYear: new Date().getFullYear().toString(),
    bio: '',
    role: user.role
  };
  const [profile, setProfile] = useState<UiProfile>(initialProfile);
  const [editedProfile, setEditedProfile] = useState({ ...profile });

  useEffect(() => {
    const fetchProfile = async () => {
      setIsLoading(true);
      setError('');
      try {
        const data = await getMyProfile();
        const normalizedProfile = normalizeProfile({ ...data, role: data.role || user.role }, profile);
        setProfile(normalizedProfile);
        setEditedProfile(normalizedProfile);
        const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
        localStorage.setItem('user', JSON.stringify({ ...storedUser, ...normalizedProfile }));
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Could not fetch profile information');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSave = async () => {
    setIsSaving(true);
    setError('');
    try {
      const payload = {
        phone: editedProfile.phone,
        address: editedProfile.address,
        bio: editedProfile.bio,
        gpa: editedProfile.gpa ? parseFloat(editedProfile.gpa) : undefined,
        totalCredits: editedProfile.totalCredits ? parseInt(editedProfile.totalCredits, 10) : undefined,
        enrollmentYear: editedProfile.enrollmentYear ? parseInt(editedProfile.enrollmentYear, 10) : undefined
      };
      const updated = await upsertMyProfile(payload);
      const nextProfile = normalizeProfile({ ...profile, ...payload, ...updated }, profile);
      setProfile(nextProfile);
      setEditedProfile(nextProfile);
      setIsEditing(false);
      setShowToast(true);
      const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
      localStorage.setItem('user', JSON.stringify({ ...storedUser, ...nextProfile }));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update profile');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setEditedProfile({ ...profile });
    setIsEditing(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar userName={profile.name || user.name} />

      {showToast && (
        <Toast
          message="Profile updated successfully!"
          type="success"
          onClose={() => setShowToast(false)}
        />
      )}

      {error && (
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
          <div className="p-4 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm font-medium">
            {error}
          </div>
        </div>
      )}

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-blue-800 px-8 py-6">
            <h1 className="text-3xl font-bold text-white">My Profile</h1>
            <p className="text-blue-100 mt-1">Manage your personal information</p>
          </div>

          <div className="p-8">
            {isLoading ? (
              <div className="py-12 text-center text-gray-500">Loading profile...</div>
            ) : (
              <div className="flex flex-col lg:flex-row gap-8">
                <div className="lg:w-1/3 flex flex-col items-center">
                  <div className="w-48 h-48 bg-gradient-to-br from-blue-500 to-blue-700 rounded-full flex items-center justify-center mb-4 shadow-xl">
                    <User className="w-24 h-24 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-800 mb-1">{profile.name}</h2>
                  <p className="text-gray-500 capitalize">{user.role || 'Student'}</p>
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
                          disabled={isSaving}
                        >
                          <X className="w-5 h-5" />
                          Cancel
                        </button>
                        <button
                          onClick={handleSave}
                          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg hover:from-green-700 hover:to-green-800 transition-all duration-200 hover:shadow-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                          disabled={isSaving}
                        >
                          <Save className="w-5 h-5" />
                          {isSaving ? 'Saving...' : 'Save Changes'}
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
                        value={profile.name}
                        disabled
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 cursor-not-allowed"
                      />
                      <p className="text-xs text-gray-500 mt-1">Name cannot be changed</p>
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

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                          <Award className="w-4 h-4" />
                          GPA
                        </label>
                        <input
                          type="number"
                          step="0.01"
                          min="0"
                          max="10"
                          value={isEditing ? editedProfile.gpa : profile.gpa}
                          onChange={(e) => setEditedProfile({ ...editedProfile, gpa: e.target.value })}
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
                          <BookOpen className="w-4 h-4" />
                          Total Credits
                        </label>
                        <input
                          type="number"
                          min="0"
                          value={isEditing ? editedProfile.totalCredits : profile.totalCredits}
                          onChange={(e) => setEditedProfile({ ...editedProfile, totalCredits: e.target.value })}
                          disabled={!isEditing}
                          className={`w-full px-4 py-3 border border-gray-300 rounded-lg transition-all ${
                            isEditing
                              ? 'focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                              : 'bg-gray-50 cursor-not-allowed'
                          }`}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                          <GraduationCap className="w-4 h-4" />
                          Enrollment Year
                        </label>
                        <input
                          type="number"
                          min="1900"
                          max="2100"
                          value={isEditing ? editedProfile.enrollmentYear : profile.enrollmentYear}
                          onChange={(e) => setEditedProfile({ ...editedProfile, enrollmentYear: e.target.value })}
                          disabled={!isEditing}
                          className={`w-full px-4 py-3 border border-gray-300 rounded-lg transition-all ${
                            isEditing
                              ? 'focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                              : 'bg-gray-50 cursor-not-allowed'
                          }`}
                        />
                      </div>
                    </div>

                    <div>
                      <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                        <FileText className="w-4 h-4" />
                        Bio
                      </label>
                      <textarea
                        value={isEditing ? editedProfile.bio : profile.bio}
                        onChange={(e) => setEditedProfile({ ...editedProfile, bio: e.target.value })}
                        disabled={!isEditing}
                        rows={4}
                        className={`w-full px-4 py-3 border border-gray-300 rounded-lg transition-all resize-none ${
                          isEditing
                            ? 'focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                            : 'bg-gray-50 cursor-not-allowed'
                        }`}
                        placeholder="Share a short description about yourself"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default StudentProfile;
