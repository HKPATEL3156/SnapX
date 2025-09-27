import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Mock users for development
const MOCK_USERS = [
  {
    id: 1,
    name: 'Admin User',
    email: 'admin@snapx.com',
    role: 'admin'
  },
  {
    id: 2,
    name: 'John Doe',
    email: 'john@example.com',
    role: 'user'
  }
];

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const savedUser = localStorage.getItem('snapx_user');
      
      if (savedUser) {
        setUser(JSON.parse(savedUser));
      }
    } catch (error) {
      console.error('Auth verification failed:', error);
      logout();
    } finally {
      setLoading(false);
    }
  };

  const login = async (credentials) => {
    try {
      // Mock login logic
      const mockUser = MOCK_USERS.find(u => u.email === credentials.email);
      
      if (mockUser && (credentials.password === 'admin@snapx001' || credentials.password === 'password123')) {
        localStorage.setItem('snapx_user', JSON.stringify(mockUser));
        setUser(mockUser);
        return { success: true, user: mockUser };
      } else {
        return { success: false, message: 'Invalid credentials' };
      }
    } catch (error) {
      return { success: false, message: 'Login failed' };
    }
  };

  const register = async (userData) => {
    try {
      // Mock registration logic
      const newUser = {
        id: Date.now(),
        name: userData.name,
        email: userData.email,
        role: 'user'
      };
      
      localStorage.setItem('snapx_user', JSON.stringify(newUser));
      setUser(newUser);
      
      return { success: true, user: newUser };
    } catch (error) {
      return { success: false, message: 'Registration failed' };
    }
  };

  const logout = () => {
    localStorage.removeItem('snapx_token');
    localStorage.removeItem('snapx_user');
    setUser(null);
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};