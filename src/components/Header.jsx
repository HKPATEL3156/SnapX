import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FaCameraRetro, FaImages, FaUpload, FaUserShield, FaSignInAlt, FaSignOutAlt, FaBars, FaTimes } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsMenuOpen(false);
  };

  const navigation = user ? [
    { name: 'Feed', href: '/', icon: FaImages },
    { name: 'Upload', href: '/upload', icon: FaUpload },
    { name: 'My Profile', href: '/profile', icon: FaUserShield },
  ] : [
    { name: 'Gallery', href: '/', icon: FaImages },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <header className="header">
      <div className="container">
        <div className="flex justify-between items-center" style={{height: '4rem'}}>
          {/* Logo */}
          <Link to="/" className="flex items-center hover-lift" style={{gap: '1rem', textDecoration: 'none'}}>
            <div className="bg-gradient-primary glow-blue rounded-xl shadow-lg" style={{padding: '1rem', transition: 'all 0.3s ease'}}>
              <FaCameraRetro className="text-white" style={{fontSize: '1.5rem'}} />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gradient">
                PhotoShare
              </h1>
              <p className="text-sm text-gray">Professional Photo Community</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="md:flex items-center hidden" style={{gap: '0.25rem'}}>
            {navigation.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`nav-link flex items-center ${isActive(item.href) ? 'active' : ''}`}
                  style={{gap: '0.5rem'}}
                >
                  <Icon />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>

          {/* User Actions */}
          <div className="flex items-center" style={{gap: '0.75rem'}}>
            {user ? (
              <>
                {user.role === 'admin' && (
                  <Link
                    to="/admin"
                    className="btn btn-warning hidden"
                    style={{display: 'none'}}
                  >
                    <FaUserShield />
                    <span>Admin</span>
                  </Link>
                )}
                <div className="flex items-center bg-white rounded-lg p-4 shadow hidden" style={{gap: '0.75rem', display: 'none'}}>
                  <div className="bg-gradient rounded-full flex items-center justify-center" style={{width: '2rem', height: '2rem'}}>
                    <span className="text-white text-sm font-bold">
                      {user.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div className="text-sm">
                    <p className="font-medium" style={{color: '#1f2937'}}>{user.name}</p>
                    <p style={{color: '#6b7280', textTransform: 'capitalize'}}>{user.role}</p>
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="btn btn-danger"
                >
                  <FaSignOutAlt />
                  <span className="hidden">Logout</span>
                </button>
              </>
            ) : (
              <Link
                to="/login"
                className="btn btn-primary"
              >
                <FaSignInAlt />
                <span>Sign In</span>
              </Link>
            )}

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="btn md:hidden"
              style={{background: 'none', color: '#6b7280', padding: '0.5rem'}}
            >
              {isMenuOpen ? <FaTimes /> : <FaBars />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden p-4 animate-slide-up" style={{borderTop: '1px solid #e5e7eb'}}>
            <nav style={{display: 'flex', flexDirection: 'column', gap: '0.5rem'}}>
              {navigation.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    onClick={() => setIsMenuOpen(false)}
                    className={`nav-link flex items-center ${isActive(item.href) ? 'active' : ''}`}
                    style={{gap: '0.75rem', padding: '0.75rem 1rem'}}
                  >
                    <Icon />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
              
              {user?.role === 'admin' && (
                <Link
                  to="/admin"
                  onClick={() => setIsMenuOpen(false)}
                  className="nav-link flex items-center text-yellow"
                  style={{gap: '0.75rem', padding: '0.75rem 1rem'}}
                >
                  <FaUserShield />
                  <span>Admin Panel</span>
                </Link>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;