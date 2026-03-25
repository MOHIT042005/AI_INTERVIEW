import React from "react";
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Navbar(){
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return(
    <div className="navbar">

      <Link to="/" className="logo" style={{textDecoration: 'none'}}>
        Intervio
      </Link>

      <div className="nav-links">
        <span onClick={() => navigate('/')}>Home</span>
        <span onClick={() => navigate('/#features')}>Features</span>
        <span onClick={() => navigate('/#pricing')}>Pricing</span>
        <span onClick={() => navigate('/#faq')}>FAQ</span>
      </div>

      <div className="nav-auth">
        {isAuthenticated ? (
          <>
            <div className="user-info">
              <span>{user?.user_metadata?.full_name || user?.email}</span>
            </div>
            <Link to="/dashboard" className="nav-btn dashboard-link">
              Dashboard
            </Link>
            <button className="nav-btn logout-btn" onClick={handleLogout}>
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="nav-btn login-link">
              Login
            </Link>
            <Link to="/signup" className="start-btn">
              Sign Up
            </Link>
          </>
        )}
      </div>

    </div>
  )
}

export default Navbar;