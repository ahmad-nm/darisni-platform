import React, { useContext } from 'react';
import { AuthContext } from '../../Context/AuthContext';
import { AdminLogin } from '../AdminLogin/AdminLogin';
import { Loader } from '../Loader/Loader';

export function ProtectedRoute({ children }) {
  const { user, loading } = useContext(AuthContext);

  // Show loading spinner while checking authentication
  if (loading) {
    return <Loader />;
  }

  // If no user is logged in, show admin login page
  if (!user) {
    return <AdminLogin />;
  }

  // Check if user is an admin based on the role field
  if (user.role !== 'admin') {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        flexDirection: 'column',
        fontFamily: 'Arial, sans-serif',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        textAlign: 'center',
        padding: '20px'
      }}>
        <div style={{
          background: 'rgba(255, 255, 255, 0.95)',
          color: '#2c3e50',
          padding: '40px',
          borderRadius: '20px',
          boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)',
          backdropFilter: 'blur(10px)'
        }}>
          <h1 style={{ color: '#e74c3c', marginBottom: '20px' }}>Access Denied</h1>
          <p style={{ color: '#666', fontSize: '18px', marginBottom: '20px' }}>
            You don't have admin privileges to access this panel.
          </p>
          <p style={{ color: '#95a5a6', fontSize: '14px', marginBottom: '30px' }}>
            Your current role: <strong>{user.role}</strong>
          </p>
          <button 
            onClick={() => window.location.reload()}
            style={{
              padding: '12px 24px',
              background: 'linear-gradient(135deg, #667eea, #764ba2)',
              color: 'white',
              border: 'none',
              borderRadius: '12px',
              cursor: 'pointer',
              fontSize: '16px',
              fontWeight: '600'
            }}
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // If user is authenticated and is admin, render the protected content
  return children;
}
