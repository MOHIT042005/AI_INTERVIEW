import React, { useState } from "react";
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Navbar() {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const goToSection = (sectionId) => {
    setMenuOpen(false);

    if (location.pathname === '/') {
      const target = document.getElementById(sectionId);
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        return;
      }
    }

    navigate(`/#${sectionId}`);
  };

  const handleLogout = async () => {
    try {
      await logout();
      setMenuOpen(false);
      navigate('/');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <div className="navbar">
      <div className="nav-brand">
        <Link to="/" className="logo" style={{ textDecoration: 'none' }} onClick={() => setMenuOpen(false)}>
          Intervio
        </Link>
        <span className="logo-tag">Mock interviews that feel focused</span>
      </div>

      <button
        className="menu-toggle"
        type="button"
        onClick={() => setMenuOpen((prev) => !prev)}
        aria-label="Toggle navigation"
        aria-expanded={menuOpen}
      >
        <span></span>
        <span></span>
        <span></span>
      </button>

      <div className={`nav-links ${menuOpen ? 'open' : ''}`}>
        <button type="button" className="nav-link" onClick={() => { setMenuOpen(false); navigate('/'); }}>
          Home
        </button>
        <button type="button" className="nav-link" onClick={() => goToSection('features')}>
          Features
        </button>
        <button type="button" className="nav-link" onClick={() => goToSection('pricing')}>
          Pricing
        </button>
        <button type="button" className="nav-link" onClick={() => goToSection('faq')}>
          FAQ
        </button>
      </div>

      <div className={`nav-auth ${menuOpen ? 'open' : ''}`}>
        {isAuthenticated ? (
          <>
            <div className="user-info">
              <span>{user?.user_metadata?.full_name || user?.email}</span>
            </div>
            <Link to="/dashboard" className="nav-btn dashboard-link" onClick={() => setMenuOpen(false)}>
              Dashboard
            </Link>
            <button className="nav-btn logout-btn" onClick={handleLogout}>
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="nav-btn login-link" onClick={() => setMenuOpen(false)}>
              Login
            </Link>
            <Link to="/signup" className="start-btn" onClick={() => setMenuOpen(false)}>
              Sign Up
            </Link>
          </>
        )}
      </div>
    </div>
  );
}

export default Navbar;
