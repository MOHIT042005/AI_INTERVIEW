import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { validateEmail } from '../utils/validators';

function ForgotPassword() {
  const { resetPassword } = useAuth();
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!validateEmail(email)) {
      setError('Please enter a valid email address.');
      return;
    }

    try {
      setLoading(true);
      await resetPassword(email.trim());
      setSuccess('Password reset link sent. Check your email and follow the instructions.');
    } catch (err) {
      setError(err.message || 'Unable to send reset email right now.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container auth-shell">
      <div className="auth-hero-panel">
        <span className="eyebrow">Recovery</span>
        <h1>Get back into your interview workspace</h1>
        <p>
          We will send a reset link so you can update your password and return to your
          dashboard without creating a new account.
        </p>
      </div>

      <div className="auth-card">
        <h1>Reset Password</h1>
        <p className="auth-subtitle">Enter the email you used when signing up.</p>

        {error && <div className="auth-error">{error}</div>}
        {success && <div className="auth-success">{success}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="reset-email">Email</label>
            <input
              id="reset-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              disabled={loading}
            />
          </div>

          <button type="submit" className="auth-btn" disabled={loading}>
            {loading ? 'Sending Reset Link...' : 'Send Reset Link'}
          </button>
        </form>

        <p className="auth-footer">
          Remembered it? <Link to="/login">Back to login</Link>
        </p>
      </div>
    </div>
  );
}

export default ForgotPassword;
