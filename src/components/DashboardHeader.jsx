import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const DashboardHeader = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <div className="dashboard-header">
      <h1>Welcome back, {user?.user_metadata?.full_name || user?.email}!</h1>
      <div className="dashboard-header-actions">
        <button className="nav-btn dashboard-link" onClick={() => navigate('/profile')}>Profile</button>
        <button className="logout-btn" onClick={handleLogout}>Logout</button>
      </div>
    </div>
  );
};
