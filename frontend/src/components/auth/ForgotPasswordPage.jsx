import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import './LoginPage.css';
import api from '../../api/api';
import Loader from '../common/Loader';

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await api.put('/forgetPassword', { email });
      toast.success('OTP has been sent to your email. Please check your inbox.');
      
      // Store email in localStorage for the next step
      localStorage.setItem('resetEmail', email);
      
      // Add artificial delay
      setTimeout(() => {
        navigate('/verify-otp');
      }, 1500);
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to send OTP. Please try again.';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="forgot-wrapper">
      <Loader loading={loading} message="Sending OTP..." />
      <video autoPlay muted loop className="video-background">
        <source src="/background.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      <div className="forgot-container">
        <form className="forgot-form" onSubmit={handleSubmit}>
          <h2>Reset Password</h2>
          {error && <p className="error-message">{error}</p>}
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <button type="submit" disabled={loading}>Send OTP</button>
          <div className="link-container">
            <a href="/login">Back to Login</a>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
