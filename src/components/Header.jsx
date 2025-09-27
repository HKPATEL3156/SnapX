import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FaCamera, FaHome, FaPlus, FaUser, FaSignInAlt, FaSignOutAlt, FaBars, FaTimes, FaCog } from 'react-icons/fa';
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
    { name: 'Home', href: '/', icon: FaHome },
    { name: 'Feed', href: '/feed', icon: FaCamera },
    { name: 'Upload', href: '/upload', icon: FaPlus },
    { name: 'Profile', href: '/profile', icon: FaUser },
  ] : [
    { name: 'Home', href: '/', icon: FaHome },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <header style={{
      background: 'rgba(15, 23, 42, 0.95)',
      backdropFilter: 'blur(16px)',
      borderBottom: '1px solid rgba(148, 163, 184, 0.1)',
      position: 'sticky',
      top: 0,
      zIndex: 50,
      padding: '1rem 0'
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '0 1rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        {/* Logo */}
        <Link to="/" style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          textDecoration: 'none'
        }}>
          <div style={{
            background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
            padding: '0.75rem',
            borderRadius: '0.75rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <FaCamera style={{color: 'white', fontSize: '1.25rem'}} />
          </div>
          <h1 style={{
            fontSize: '1.75rem',
            fontWeight: 'bold',
            background: 'linear-gradient(135deg, #60a5fa, #a78bfa)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            margin: 0
          }}>
            SnapX
          </h1>
        </Link>

        {/* Desktop Navigation */}
        <nav style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem'
        }} className="hidden md:flex">
          {navigation.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                to={item.href}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.75rem 1rem',
                  borderRadius: '0.5rem',
                  textDecoration: 'none',
                  color: isActive(item.href) ? '#60a5fa' : '#94a3b8',
                  background: isActive(item.href) ? 'rgba(59, 130, 246, 0.1)' : 'transparent',
                  transition: 'all 0.3s ease'
                }}
                onMouseOver={(e) => {
                  if (!isActive(item.href)) {
                    e.target.style.color = '#e2e8f0';
                    e.target.style.background = 'rgba(30, 41, 59, 0.5)';
                  }
                }}
                onMouseOut={(e) => {
                  if (!isActive(item.href)) {
                    e.target.style.color = '#94a3b8';
                    e.target.style.background = 'transparent';
                  }
                }}
              >
                <Icon />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* User Actions */}
        <div style={{display: 'flex', alignItems: 'center', gap: '1rem'}}>
          {user ? (
            <>
              {user.role === 'admin' && (
                <Link
                  to="/admin"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    padding: '0.5rem 1rem',
                    background: 'linear-gradient(135deg, #7c3aed, #581c87)',
                    color: 'white',
                    textDecoration: 'none',
                    borderRadius: '0.5rem',
                    fontSize: '0.875rem',
                    fontWeight: '500',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseOver={(e) => e.target.style.transform = 'translateY(-2px)'}
                  onMouseOut={(e) => e.target.style.transform = 'translateY(0)'}
                >
                  <FaCog />
                  <span className="hidden sm:inline">Admin</span>
                </Link>
              )}
              <button
                onClick={handleLogout}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.5rem 1rem',
                  background: 'rgba(239, 68, 68, 0.2)',
                  border: '1px solid rgba(239, 68, 68, 0.3)',
                  color: '#f87171',
                  borderRadius: '0.5rem',
                  cursor: 'pointer',
                  fontSize: '0.875rem',
                  transition: 'all 0.3s ease'
                }}
                onMouseOver={(e) => {
                  e.target.style.background = 'rgba(239, 68, 68, 0.3)';
                  e.target.style.transform = 'translateY(-2px)';
                }}
                onMouseOut={(e) => {
                  e.target.style.background = 'rgba(239, 68, 68, 0.2)';
                  e.target.style.transform = 'translateY(0)';
                }}
              >
                <FaSignOutAlt />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </>
          ) : (
            <div style={{display: 'flex', gap: '0.75rem'}}>
              <Link
                to="/login"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.5rem 1rem',
                  background: 'linear-gradient(135deg, #1e40af, #3730a3)',
                  color: 'white',
                  textDecoration: 'none',
                  borderRadius: '0.5rem',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  transition: 'all 0.3s ease'
                }}
                onMouseOver={(e) => e.target.style.transform = 'translateY(-2px)'}
                onMouseOut={(e) => e.target.style.transform = 'translateY(0)'}
              >
                <FaSignInAlt />
                <span>Sign In</span>
              </Link>
            </div>
          )}

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            style={{
              display: 'block',
              background: 'none',
              border: 'none',
              color: '#94a3b8',
              padding: '0.5rem',
              cursor: 'pointer',
              borderRadius: '0.5rem'
            }}
            className="md:hidden"
          >
            {isMenuOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div style={{
          padding: '1rem',
          borderTop: '1px solid rgba(148, 163, 184, 0.1)',
          background: 'rgba(15, 23, 42, 0.98)'
        }} className="md:hidden">
          <nav style={{display: 'flex', flexDirection: 'column', gap: '0.5rem'}}>
            {navigation.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={() => setIsMenuOpen(false)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    padding: '0.75rem 1rem',
                    borderRadius: '0.5rem',
                    textDecoration: 'none',
                    color: isActive(item.href) ? '#60a5fa' : '#94a3b8',
                    background: isActive(item.href) ? 'rgba(59, 130, 246, 0.1)' : 'transparent'
                  }}
                >
                  <Icon />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>
      )}

      {/* Credits */}
      <div style={{
        position: 'absolute',
        top: '100%',
        right: '1rem',
        background: 'rgba(15, 23, 42, 0.9)',
        padding: '0.5rem 1rem',
        borderRadius: '0 0 0.5rem 0.5rem',
        fontSize: '0.75rem',
        color: '#64748b',
        border: '1px solid rgba(148, 163, 184, 0.1)',
        borderTop: 'none'
      }}>
        Made with ❤️ by 23DCS045 | 23DCS016
      </div>
    </header>
  );
};

export default Header;