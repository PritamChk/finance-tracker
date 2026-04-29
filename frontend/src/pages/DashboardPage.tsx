import React from 'react';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';

const DashboardPage: React.FC = () => {
  const { data: user, isLoading } = useAuth();
  const navigate = useNavigate();

  if (isLoading) return <div className="auth-container">Loading...</div>;
  if (!user) return null; // ProtectedRoute should handle this, but just in case

  return (
    <div className="auth-container">
      <div className="card">
        <h1 className="card-title">Dashboard</h1>
        <p className="card-subtitle">Welcome to the TicTacToe Arena!</p>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <p>Hello, <strong>{user.full_name}</strong>!</p>
          <p>Email: {user.email}</p>
        </div>
        <button 
          onClick={() => {
            window.localStorage.clear();
            navigate('/login');
          }} 
          className="btn btn-secondary"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default DashboardPage;
