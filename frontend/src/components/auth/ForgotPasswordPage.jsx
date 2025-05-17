import React, { useState } from 'react';
import './ForgotPasswordPage.css';
import axios from 'axios';

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('/api/auth/forgot-password', { email });
      setMessage(res.data.message || 'Password reset link sent to your email.');
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong.');
      setMessage('');
    }
  };

  return (
      <div className="forgot-wrapper">
        <video autoPlay muted loop className="video-background">
          <source src="/background.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>

        <div className="forgot-container">
          <form className="forgot-form" onSubmit={handleSubmit}>
            <h2>Reset Password</h2>
            {error && <p className="error-message">{error}</p>}
            {message && <p className="success-message">{message}</p>}
            <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
            />
            <button type="submit">Send Reset Link</button>
            <div className="link-container">
              <a href="/login">Back to Login</a>
            </div>
          </form>
        </div>
      </div>
  );
};

export default ForgotPasswordPage;
