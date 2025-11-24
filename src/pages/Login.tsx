import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogIn, UserPlus, Mail, Lock, User, Phone, MapPin } from 'lucide-react';
import {
  login as loginApi,
  register as registerApi,
  getMyProfile,
  upsertMyProfile,
  ProfileData,
  AUTH_TOKEN_STORAGE_KEY
} from '../api/apiService';

const extractRoleFromToken = (token: string) => {
  try {
    const [, payload] = token.split('.');
    if (!payload) {
      return undefined;
    }
    const decoded = JSON.parse(atob(payload));
    return decoded.role || decoded.roles?.[0] || decoded.authorities?.[0];
  } catch {
    return undefined;
  }
};

function Login() {
  const navigate = useNavigate();
  const [isSignup, setIsSignup] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    phone: '',
    address: ''
  });
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  type UserProfile = ProfileData & { id?: string; role?: string };

  const completeLoginFlow = async (email: string, password: string, extraProfileData?: ProfileData) => {
    const authData = await loginApi(email, password);
    if (!authData.token) {
      throw new Error('Login failed. Please try again.');
    }
    localStorage.setItem(AUTH_TOKEN_STORAGE_KEY, authData.token);

    let profile: UserProfile | undefined = authData.user as UserProfile | undefined;
    if (!profile) {
      profile = (await getMyProfile()) as UserProfile;
    }

    if (extraProfileData && Object.keys(extraProfileData).length > 0) {
      const updatedProfile = await upsertMyProfile(extraProfileData);
      profile = { ...profile, ...updatedProfile };
    }

    const tokenRole = extractRoleFromToken(authData.token);
    const normalizedRole = (profile?.role || authData.user?.role || tokenRole || 'student')
      .toString()
      .toLowerCase();
    const normalizedUser: UserProfile = {
      ...profile,
      email: profile?.email ?? email,
      name: profile?.name ?? extraProfileData?.name ?? email.split('@')[0],
      role: normalizedRole
    };

    localStorage.setItem('user', JSON.stringify(normalizedUser));
    return normalizedUser;
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      const user = await completeLoginFlow(formData.email, formData.password);
      const destination = user.role === 'admin' ? '/admin/dashboard' : '/student/dashboard';
      navigate(destination);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Invalid email or password');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!formData.name || !formData.email || !formData.password || !formData.phone || !formData.address) {
      setError('All fields are required');
      return;
    }

    setIsSubmitting(true);
    try {
      await registerApi({ name: formData.name, email: formData.email, password: formData.password });
      const user = await completeLoginFlow(formData.email, formData.password, {
        name: formData.name,
        phone: formData.phone,
        address: formData.address
      });
      const destination = user.role === 'admin' ? '/admin/dashboard' : '/student/dashboard';
      navigate(destination);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 via-blue-600 to-blue-800 flex items-center justify-center p-4">
      <div className="w-full max-w-5xl flex bg-white rounded-2xl shadow-2xl overflow-hidden animate-fade-in">
        <div className="hidden md:flex md:w-1/2 bg-gradient-to-br from-blue-600 to-blue-800 p-12 flex-col justify-center items-center text-white">
          <div className="mb-8">
            <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center mb-6 backdrop-blur-sm">
              <LogIn className="w-12 h-12" />
            </div>
            <h2 className="text-4xl font-bold mb-4">Welcome to</h2>
            <h1 className="text-5xl font-bold mb-6">Student Portal</h1>
            <p className="text-xl text-blue-100">Your gateway to learning excellence</p>
          </div>
          <div className="mt-8 space-y-4 text-blue-100">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-white rounded-full"></div>
              <span>Access your courses anytime, anywhere</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-white rounded-full"></div>
              <span>Track your learning progress</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-white rounded-full"></div>
              <span>Connect with instructors</span>
            </div>
          </div>
        </div>

        <div className="w-full md:w-1/2 p-8 md:p-12">
          <div className="mb-8">
            <h3 className="text-3xl font-bold text-gray-800 mb-2">
              {isSignup ? 'Create Account' : 'Sign In'}
            </h3>
            <p className="text-gray-600">
              {isSignup ? 'Join us to start your learning journey' : 'Welcome back! Please enter your details'}
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-600 rounded-lg flex items-center gap-2">
              <span className="font-medium">{error}</span>
            </div>
          )}

          <form onSubmit={isSignup ? handleSignup : handleLogin} className="space-y-5">
            {isSignup && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="John Doe"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="you@example.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="••••••••"
                />
              </div>
            </div>

            {isSignup && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      placeholder="+1234567890"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
                    <textarea
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                      rows={2}
                      placeholder="123 Main St, City, Country"
                    />
                  </div>
                </div>
              </>
            )}

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-blue-800 transition-all duration-200 hover:shadow-lg hover:scale-105 flex items-center justify-center gap-2"
              disabled={isSubmitting}
            >
              {isSignup ? (
                <>
                  <UserPlus className="w-5 h-5" />
                  {isSubmitting ? 'Creating Account...' : 'Create Account'}
                </>
              ) : (
                <>
                  <LogIn className="w-5 h-5" />
                  {isSubmitting ? 'Signing In...' : 'Sign In'}
                </>
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={() => {
                setIsSignup(!isSignup);
                setError('');
                setFormData({ email: '', password: '', name: '', phone: '', address: '' });
              }}
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              {isSignup ? 'Already have an account? Sign In' : "Don't have an account? Sign Up"}
            </button>
          </div>

          {!isSignup && (
            <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-sm text-gray-600 font-medium mb-2">Demo Credentials:</p>
              <div className="space-y-1 text-sm text-gray-700">
                <p><strong>Student:</strong> student@test.com / student123</p>
                <p><strong>Admin:</strong> admin@test.com / admin123</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Login;
