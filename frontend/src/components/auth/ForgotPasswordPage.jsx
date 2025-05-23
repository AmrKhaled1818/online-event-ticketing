import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './LoginPage.css';
import api from '../../api/api';

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
        setError('');
        setSuccess('');

    try {
            const response = await api.put('/forgetPassword', { email });
            setSuccess('OTP has been sent to your email. Please check your inbox.');
            
            // Store email in localStorage for the next step
            localStorage.setItem('resetEmail', email);
            
            // Redirect to OTP verification page after 2 seconds
            setTimeout(() => {
                navigate('/verify-otp');
            }, 2000);
    } catch (err) {
            setError(err.response?.data?.message || 'Failed to send OTP. Please try again.');
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
                    {success && <p className="success-message">{success}</p>}
            <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
            />
                    <button type="submit">Send OTP</button>
            <div className="link-container">
              <a href="/login">Back to Login</a>
            </div>
          </form>
        </div>
      </div>
  );
};

export default ForgotPasswordPage;
