import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import Header from './components/Header';
import Footer from './components/Footer';
import Landing from './pages/Landing';
import Feed from './pages/Feed';
import Upload from './pages/Upload';
import Login from './pages/Login';
import Profile from './pages/Profile';
import AdminDashboard from './pages/AdminDashboard';
import './styles.css';

// Protected Route Component
const ProtectedRoute = ({ children, requireAuth = true, adminOnly = false }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen section-dark flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin" style={{
            width: '3rem',
            height: '3rem',
            border: '4px solid transparent',
            borderTop: '4px solid #3b82f6',
            borderRadius: '50%',
            margin: '0 auto 1rem'
          }} />
          <p className="text-gray">Loading...</p>
        </div>
      </div>
    );
  }

  if (requireAuth && !user) {
    return <Navigate to="/login" replace />;
  }

  if (adminOnly && user?.role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  return children;
};

// Main App Routes Component
const AppRoutes = () => {
  const { user } = useAuth();

  return (
    <Routes>
      {/* Landing page for non-authenticated users, feed for authenticated users */}
      <Route 
        path="/" 
        element={
          user ? (
            <Navigate to="/feed" replace />
          ) : (
            <Landing />
          )
        } 
      />
      
      {/* Feed for authenticated users */}
      <Route 
        path="/feed" 
        element={
          <ProtectedRoute requireAuth={true}>
            <Feed />
          </ProtectedRoute>
        } 
      />
      
      {/* Authentication */}
      <Route 
        path="/login" 
        element={
          user ? <Navigate to="/feed" replace /> : <Login />
        } 
      />
      
      <Route 
        path="/register" 
        element={
          user ? <Navigate to="/feed" replace /> : <Login />
        } 
      />
      
      {/* Protected User Routes */}
      <Route 
        path="/upload" 
        element={
          <ProtectedRoute requireAuth={true}>
            <Upload />
          </ProtectedRoute>
        } 
      />
      
      <Route 
        path="/profile" 
        element={
          <ProtectedRoute requireAuth={true}>
            <Profile />
          </ProtectedRoute>
        } 
      />
      
      {/* Admin Routes */}
      <Route 
        path="/admin" 
        element={
          <ProtectedRoute requireAuth={true} adminOnly={true}>
            <AdminDashboard />
          </ProtectedRoute>
        } 
      />
      
      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};



function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="min-h-screen flex flex-col bg-dark">
          <Header />
          
          <main className="flex-1">
            <AppRoutes />
          </main>
          
          <Footer />
          
          {/* Toast Notifications */}
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: 'rgba(30, 41, 59, 0.95)',
                color: '#e2e8f0',
                borderRadius: '0.75rem',
                border: '1px solid rgba(148, 163, 184, 0.2)',
                backdropFilter: 'blur(16px)',
              },
              success: {
                duration: 3000,
                style: {
                  background: 'linear-gradient(135deg, #059669, #047857)',
                  color: '#ffffff',
                },
              },
              error: {
                duration: 5000,
                style: {
                  background: 'linear-gradient(135deg, #dc2626, #b91c1c)',
                  color: '#ffffff',
                },
              },
              loading: {
                style: {
                  background: 'linear-gradient(135deg, #1e40af, #3730a3)',
                  color: '#ffffff',
                },
              },
            }}
          />
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
