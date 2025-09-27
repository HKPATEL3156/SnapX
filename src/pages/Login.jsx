import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaUser, FaEnvelope, FaLock, FaIdCard, FaUserPlus, FaEye, FaEyeSlash, FaCamera, FaArrowLeft } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
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
        toast.success(isLogin ? 'Welcome back to SnapX! 🎉' : 'Account created successfully! Welcome to SnapX! 🎉');
        
        if (result.user.role === 'admin') {
          navigate('/admin');
        } else {
          navigate('/feed');
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

  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{
      background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 40%, #334155 100%)',
      position: 'relative'
    }}>
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-20 w-96 h-96 bg-gradient-to-r from-blue-500 to-purple-600 opacity-10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-80 h-80 bg-gradient-to-r from-purple-500 to-pink-500 opacity-8 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
        <div className="absolute top-1/2 left-10 w-64 h-64 bg-gradient-to-r from-indigo-500 to-blue-500 opacity-6 rounded-full blur-2xl animate-pulse" style={{animationDelay: '4s'}}></div>
      </div>

      {/* Main Form Container */}
      <div className="relative z-10" style={{ width: '420px' }}>
        
        {/* Back to Home Link */}
        <Link 
          to="/" 
          className="inline-flex items-center gap-2 text-gray-300 hover:text-white mb-6 transition-all duration-300 group"
          style={{ fontSize: '0.9rem', fontWeight: '500' }}
        >
          <FaArrowLeft className="group-hover:-translate-x-1 transition-transform" />
          <span>Back to Home</span>
        </Link>

        {/* Main Form Card */}
        <div style={{
          background: 'rgba(30, 41, 59, 0.95)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          border: '1px solid rgba(148, 163, 184, 0.1)',
          borderRadius: '24px',
          padding: '2.5rem',
          boxShadow: '0 25px 50px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.05)',
        }}>
          
          {/* Header Section */}
          <div className="text-center mb-8">
            <div style={{
              width: '80px',
              height: '80px',
              background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
              borderRadius: '20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1.5rem',
              boxShadow: '0 8px 32px rgba(59, 130, 246, 0.3)'
            }}>
              <FaCamera className="text-2xl text-white" />
            </div>
            
            <h1 className="text-4xl font-bold text-white mb-3" style={{letterSpacing: '-0.02em'}}>
              {isLogin ? 'Welcome Back' : 'Join SnapX'}
            </h1>
            <p className="text-gray-300 text-lg">
              {isLogin 
                ? 'Sign in to continue your photography journey' 
                : 'Start your creative photography journey'
              }
            </p>
          </div>

          {/* Mode Toggle */}
          <div className="flex mb-8" style={{
            background: 'rgba(15, 23, 42, 0.6)',
            padding: '4px',
            borderRadius: '12px',
            border: '1px solid rgba(148, 163, 184, 0.1)'
          }}>
            <button
              type="button"
              onClick={() => setIsLogin(true)}
              style={{
                flex: 1,
                padding: '12px 24px',
                borderRadius: '8px',
                fontWeight: '600',
                fontSize: '0.95rem',
                transition: 'all 0.3s ease',
                background: isLogin ? 'linear-gradient(135deg, #3b82f6, #6366f1)' : 'transparent',
                color: isLogin ? 'white' : '#9ca3af',
                border: 'none',
                cursor: 'pointer',
                boxShadow: isLogin ? '0 4px 12px rgba(59, 130, 246, 0.4)' : 'none'
              }}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => setIsLogin(false)}
              style={{
                flex: 1,
                padding: '12px 24px',
                borderRadius: '8px',
                fontWeight: '600',
                fontSize: '0.95rem',
                transition: 'all 0.3s ease',
                background: !isLogin ? 'linear-gradient(135deg, #3b82f6, #6366f1)' : 'transparent',
                color: !isLogin ? 'white' : '#9ca3af',
                border: 'none',
                cursor: 'pointer',
                boxShadow: !isLogin ? '0 4px 12px rgba(59, 130, 246, 0.4)' : 'none'
              }}
            >
              Sign Up
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            
            {/* Name Field (Register only) */}
            {!isLogin && (
              <div>
                <label style={{
                  display: 'block',
                  color: '#e2e8f0',
                  fontSize: '0.9rem',
                  fontWeight: '600',
                  marginBottom: '0.5rem'
                }}>Full Name</label>
                <div style={{ position: 'relative' }}>
                  <FaUser style={{
                    position: 'absolute',
                    left: '16px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: '#94a3b8',
                    zIndex: 10
                  }} />
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Enter your full name"
                    required={!isLogin}
                    style={{
                      width: '100%',
                      padding: '16px 16px 16px 48px',
                      background: 'rgba(15, 23, 42, 0.6)',
                      border: '2px solid rgba(148, 163, 184, 0.2)',
                      borderRadius: '12px',
                      fontSize: '1rem',
                      color: '#e2e8f0',
                      transition: 'all 0.3s ease',
                      outline: 'none'
                    }}
                    onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
                    onBlur={(e) => e.target.style.borderColor = 'rgba(148, 163, 184, 0.2)'}
                  />
                </div>
              </div>
            )}

            {/* Email Field */}
            <div>
              <label style={{
                display: 'block',
                color: '#e2e8f0',
                fontSize: '0.9rem',
                fontWeight: '600',
                marginBottom: '0.5rem'
              }}>Email Address</label>
              <div style={{ position: 'relative' }}>
                <FaEnvelope style={{
                  position: 'absolute',
                  left: '16px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: '#94a3b8',
                  zIndex: 10
                }} />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Enter your email"
                  required
                  style={{
                    width: '100%',
                    padding: '16px 16px 16px 48px',
                    background: 'rgba(15, 23, 42, 0.6)',
                    border: '2px solid rgba(148, 163, 184, 0.2)',
                    borderRadius: '12px',
                    fontSize: '1rem',
                    color: '#e2e8f0',
                    transition: 'all 0.3s ease',
                    outline: 'none'
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
                  onBlur={(e) => e.target.style.borderColor = 'rgba(148, 163, 184, 0.2)'}
                />
              </div>
            </div>

            {/* Student ID (Register only) */}
            {!isLogin && (
              <div style={{ marginBottom: '20px' }}>
                <label style={{
                  display: 'block',
                  marginBottom: '8px',
                  color: 'rgba(255, 255, 255, 0.9)',
                  fontSize: '14px',
                  fontWeight: '500',
                  letterSpacing: '0.5px'
                }}>Student ID</label>
                <div style={{ position: 'relative' }}>
                  <FaIdCard style={{
                    position: 'absolute',
                    left: '16px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: 'rgba(255, 255, 255, 0.6)',
                    zIndex: 10,
                    fontSize: '16px'
                  }} />
                  <input
                    type="text"
                    name="studentId"
                    value={formData.studentId}
                    onChange={handleInputChange}
                    placeholder="Enter your student ID"
                    required={!isLogin}
                    style={{
                      width: '100%',
                      height: '50px',
                      padding: '0 16px 0 48px',
                      backgroundColor: 'rgba(255, 255, 255, 0.1)',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      borderRadius: '12px',
                      color: '#ffffff',
                      fontSize: '16px',
                      outline: 'none',
                      backdropFilter: 'blur(10px)',
                      WebkitBackdropFilter: 'blur(10px)',
                      transition: 'all 0.3s ease',
                      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)'
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = 'rgba(59, 130, 246, 0.6)';
                      e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.15)';
                      e.target.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.15), 0 0 0 2px rgba(59, 130, 246, 0.2)';
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = 'rgba(255, 255, 255, 0.2)';
                      e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
                      e.target.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.1)';
                    }}
                  />
                </div>
              </div>
            )}

            {/* Password Field */}
            <div style={{ marginBottom: '20px' }}>
              <label style={{
                display: 'block',
                marginBottom: '8px',
                color: 'rgba(255, 255, 255, 0.9)',
                fontSize: '14px',
                fontWeight: '500',
                letterSpacing: '0.5px'
              }}>Password</label>
              <div style={{ position: 'relative' }}>
                <FaLock style={{
                  position: 'absolute',
                  left: '16px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: 'rgba(255, 255, 255, 0.6)',
                  zIndex: 10,
                  fontSize: '16px'
                }} />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="Enter your password"
                  required
                  style={{
                    width: '100%',
                    height: '50px',
                    padding: '0 48px 0 48px',
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    borderRadius: '12px',
                    color: '#ffffff',
                    fontSize: '16px',
                    outline: 'none',
                    backdropFilter: 'blur(10px)',
                    WebkitBackdropFilter: 'blur(10px)',
                    transition: 'all 0.3s ease',
                    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = 'rgba(59, 130, 246, 0.6)';
                    e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.15)';
                    e.target.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.15), 0 0 0 2px rgba(59, 130, 246, 0.2)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = 'rgba(255, 255, 255, 0.2)';
                    e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
                    e.target.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.1)';
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute',
                    right: '16px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    color: 'rgba(255, 255, 255, 0.6)',
                    cursor: 'pointer',
                    zIndex: 10,
                    fontSize: '16px',
                    transition: 'color 0.3s ease',
                    padding: '4px'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.color = 'rgba(59, 130, 246, 0.8)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.color = 'rgba(255, 255, 255, 0.6)';
                  }}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>

            {/* Forgot Password (Login only) */}
            {isLogin && (
              <div className="text-right">
                <Link 
                  to="/forgot-password" 
                  className="text-blue hover:text-blue-light transition-colors text-sm"
                >
                  Forgot your password?
                </Link>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%',
                height: '56px',
                background: loading 
                  ? 'linear-gradient(135deg, #64748b, #475569)' 
                  : 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
                border: 'none',
                borderRadius: '14px',
                color: '#ffffff',
                fontSize: '16px',
                fontWeight: '600',
                letterSpacing: '0.5px',
                cursor: loading ? 'not-allowed' : 'pointer',
                transition: 'all 0.3s ease',
                boxShadow: loading 
                  ? '0 8px 25px rgba(100, 116, 139, 0.3)'
                  : '0 8px 25px rgba(59, 130, 246, 0.4)',
                backdropFilter: 'blur(10px)',
                WebkitBackdropFilter: 'blur(10px)',
                transform: 'translateY(0)',
                marginTop: '8px'
              }}
              onMouseEnter={(e) => {
                if (!loading) {
                  e.target.style.transform = 'translateY(-2px)';
                  e.target.style.boxShadow = '0 12px 35px rgba(59, 130, 246, 0.5)';
                  e.target.style.background = 'linear-gradient(135deg, #2563eb, #1e40af)';
                }
              }}
              onMouseLeave={(e) => {
                if (!loading) {
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = '0 8px 25px rgba(59, 130, 246, 0.4)';
                  e.target.style.background = 'linear-gradient(135deg, #3b82f6, #1d4ed8)';
                }
              }}
            >
              {loading ? (
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  gap: '8px' 
                }}>
                  <div style={{
                    width: '20px',
                    height: '20px',
                    border: '2px solid #ffffff',
                    borderTop: '2px solid transparent',
                    borderRadius: '50%',
                    animation: 'spin 1s linear infinite'
                  }}></div>
                  <span>Please wait...</span>
                </div>
              ) : (
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  gap: '8px' 
                }}>
                  {isLogin ? <FaUser /> : <FaUserPlus />}
                  <span>{isLogin ? 'Sign In' : 'Create Account'}</span>
                </div>
              )}
            </button>

          </form>

          {/* Footer */}
          <div className="mt-8 text-center">
            <p className="text-gray-light text-sm">
              {isLogin ? "Don't have an account? " : "Already have an account? "}
              <button
                onClick={() => setIsLogin(!isLogin)}
                className="text-blue hover:text-blue-light font-semibold transition-colors"
              >
                {isLogin ? 'Sign Up' : 'Sign In'}
              </button>
            </p>
          </div>

        </div>

        {/* Additional Info */}
        <div className="text-center mt-6 text-gray-light text-sm">
          <p>By continuing, you agree to our Terms of Service and Privacy Policy</p>
        </div>
      </div>
    </div>
  );
};

export default Login;