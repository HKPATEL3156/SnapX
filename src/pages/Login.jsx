import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaUser, FaEnvelope, FaLock, FaIdCard, FaUserPlus, FaEye, FaEyeSlash } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';
import toast from 'react-hot-toast';

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    studentId: ''
  });

  const { login, register } = useAuth();
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      let result;
      
      if (isLogin) {
        result = await login({
          email: formData.email,
          password: formData.password
        });
      } else {
        result = await register(formData);
      }

      if (result.success) {
        toast.success(isLogin ? 'Welcome back!' : 'Account created successfully!');
        
        // Redirect based on user role
        if (result.user.role === 'admin') {
          navigate('/admin');
        } else {
          navigate('/');
        }
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      console.error('Auth error:', error);
      toast.error('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const fillAdminCredentials = () => {
    setFormData({
      ...formData,
      email: 'admin@snapx.com',
      password: 'admin@snapx001'
    });
    toast.info('Admin credentials filled!');
  };

  return (
    <div className="min-h-screen bg-gradient-light flex items-center justify-center" style={{
      padding: '3rem 1rem'
    }}>
      <div className="animate-fade-in" style={{
        maxWidth: '28rem',
        width: '100%'
      }}>
        {/* Header */}
        <div className="text-center mb-8">
          <div className="bg-gradient-primary inline-block mb-4" style={{
            padding: '1rem',
            borderRadius: '1rem'
          }}>
            <FaUserPlus className="text-white text-3xl" />
          </div>
          <h2 className="text-3xl font-bold" style={{color: '#1f2937'}}>
            {isLogin ? 'Welcome Back' : 'Join SnapX'}
          </h2>
          <p className="mt-2" style={{color: '#6b7280'}}>
            {isLogin 
              ? 'Sign in to your account to continue' 
              : 'Create an account to start sharing your photos'
            }
          </p>
        </div>

        {/* Form */}
        <div className="card" style={{
          borderRadius: '1rem',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          border: '1px solid #f3f4f6'
        }}>
          <form onSubmit={handleSubmit} style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '1.5rem'
          }}>
            {/* Name Field (Register only) */}
            {!isLogin && (
              <div>
                <label className="form-label">
                  Full Name
                </label>
                <div style={{position: 'relative'}}>
                  <FaUser style={{
                    position: 'absolute',
                    left: '0.75rem',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: '#9ca3af'
                  }} />
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="form-input"
                    style={{paddingLeft: '2.5rem'}}
                    placeholder="Enter your full name"
                  />
                </div>
              </div>
            )}

            {/* Email Field */}
            <div>
              <label className="form-label">
                Email Address
              </label>
              <div style={{position: 'relative'}}>
                <FaEnvelope style={{
                  position: 'absolute',
                  left: '0.75rem',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: '#9ca3af'
                }} />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="form-input"
                  style={{paddingLeft: '2.5rem'}}
                  placeholder="Enter your email"
                />
              </div>
            </div>

            {/* Student ID (Register only) */}
            {!isLogin && (
              <div>
                <label className="form-label">
                  Student ID (Optional)
                </label>
                <div style={{position: 'relative'}}>
                  <FaIdCard style={{
                    position: 'absolute',
                    left: '0.75rem',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: '#9ca3af'
                  }} />
                  <input
                    type="text"
                    name="studentId"
                    value={formData.studentId}
                    onChange={handleInputChange}
                    className="form-input"
                    style={{paddingLeft: '2.5rem'}}
                    placeholder="Enter your student ID"
                  />
                </div>
              </div>
            )}

            {/* Password Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                  className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>

            {/* Admin Quick Fill */}
            {isLogin && (
              <div className="bg-warning/10 border border-warning/20 rounded-lg p-3">
                <p className="text-sm text-warning-800 mb-2">
                  <strong>Admin Access:</strong>
                </p>
                <button
                  type="button"
                  onClick={fillAdminCredentials}
                  className="text-sm text-warning-700 hover:text-warning-900 font-medium underline"
                >
                  Click here to fill admin credentials
                </button>
                <p className="text-xs text-warning-600 mt-1">
                  Username: admin@snapx.com | Password: admin@snapx001
                </p>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-primary-600 to-purple text-white py-3 px-4 rounded-lg font-medium hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              {loading ? (
                <LoadingSpinner size="sm" color="white" />
              ) : (
                <>
                  <span>{isLogin ? 'Sign In' : 'Create Account'}</span>
                </>
              )}
            </button>
          </form>

          {/* Toggle Form */}
          <div className="mt-6 text-center">
            <p className="text-gray-600">
              {isLogin ? "Don't have an account?" : "Already have an account?"}
            </p>
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="text-primary-600 hover:text-primary-700 font-medium mt-1"
            >
              {isLogin ? 'Create one here' : 'Sign in instead'}
            </button>
          </div>

          {/* Back to Gallery */}
          <div className="mt-4 text-center">
            <Link
              to="/"
              className="text-gray-500 hover:text-gray-700 text-sm"
            >
              ← Back to Gallery
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;