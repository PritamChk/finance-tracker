import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '../services/auth.service';
import { useAuthStore } from '../stores/auth.store';

const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const { accessToken, clearAuth } = useAuthStore();
  const [user, setUser] = useState<{ full_name: string; email: string } | null>(null);

  useEffect(() => {
    if (!accessToken) {
      navigate('/login', { replace: true });
      return;
    }
    authService.getCurrentUser()
      .then(setUser)
      .catch(() => {
        clearAuth();
        navigate('/login', { replace: true });
      });
  }, [accessToken, clearAuth, navigate]);

  return (
    <div className="dashboard-page">
      <div className="card">
        <h1 className="card-title">Dashboard</h1>
        <p className="card-subtitle">Welcome to the Finance Tracker!</p>
        {user && (
          <div className="dashboard-info">
            <p><strong>Name:</strong> {user.full_name}</p>
            <p><strong>Email:</strong> {user.email}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;
