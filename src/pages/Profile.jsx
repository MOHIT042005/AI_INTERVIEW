import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useProfiles } from '../hooks/useProfiles';
import { validateFullName } from '../utils/validators';

function Profile() {
  const { user } = useAuth();
  const { profile, loading, error, updateProfile } = useProfiles();
  const [fullName, setFullName] = useState('');
  const [message, setMessage] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setFullName(profile?.full_name || user?.user_metadata?.full_name || '');
  }, [profile, user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');

    if (!validateFullName(fullName)) {
      setMessage('Please enter a full name with at least 2 characters.');
      return;
    }

    try {
      setSaving(true);
      await updateProfile({ full_name: fullName.trim() });
      setMessage('Profile updated successfully.');
    } catch (err) {
      setMessage(err.message || 'Unable to update profile right now.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="state-screen">
        <div className="state-card">
          <div className="spinner"></div>
          <h2>Loading profile...</h2>
          <p>Pulling your account details and saved preferences.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-page">
      <section className="profile-hero">
        <div>
          <span className="eyebrow">Settings</span>
          <h1>Profile and account</h1>
          <p>Keep your details current so your workspace feels personal and consistent.</p>
        </div>
        <Link to="/dashboard" className="nav-btn dashboard-link">Back To Dashboard</Link>
      </section>

      <section className="profile-grid">
        <article className="profile-card">
          <h2>Your details</h2>
          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label htmlFor="profile-name">Full Name</label>
              <input
                id="profile-name"
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Your full name"
                disabled={saving}
              />
            </div>

            <div className="form-group">
              <label htmlFor="profile-email">Email</label>
              <input
                id="profile-email"
                type="email"
                value={profile?.email || user?.email || ''}
                disabled
              />
              <small>Email is managed by your auth account.</small>
            </div>

            {message && <div className={message.includes('successfully') ? 'auth-success' : 'auth-error'}>{message}</div>}
            {error && <div className="auth-error">{error}</div>}

            <button type="submit" className="auth-btn" disabled={saving}>
              {saving ? 'Saving Changes...' : 'Save Profile'}
            </button>
          </form>
        </article>

        <article className="profile-card profile-side-card">
          <h2>Workspace tips</h2>
          <div className="results-list">
            <div className="results-list-item">Run one timed session each week and one untimed session for review.</div>
            <div className="results-list-item">Use the results screen after every mock to spot repeating weak points.</div>
            <div className="results-list-item">Aim to improve one skill at a time instead of changing everything at once.</div>
          </div>
          <div className="profile-account-block">
            <span className="eyebrow">Account</span>
            <p>{profile?.email || user?.email || 'No email available'}</p>
          </div>
        </article>
      </section>
    </div>
  );
}

export default Profile;
