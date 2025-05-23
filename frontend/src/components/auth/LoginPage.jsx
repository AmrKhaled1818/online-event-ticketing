import React, { useState, useEffect } from 'react';
import './LoginPage.css';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../../api/api';
import Loader from '../common/Loader';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (location.state?.message) {
      toast.success(location.state.message);
    }
  }, [location]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      console.log('Attempting login with:', { email });
      const response = await api.post('/login', { email, password });
      console.log('Login response:', response.data);

      if (response.data) {
        // ✅ Store token if it exists
        if (response.data.token) {
          localStorage.setItem('token', response.data.token);
        }

        // Optional: Store user info separately (if needed)
        localStorage.setItem('user', JSON.stringify(response.data));

        toast.success('Login successful!');
        // Add artificial delay
        setTimeout(() => {
          navigate('/');
        }, 1500);
      } else {
        setError('Invalid response from server');
        toast.error('Invalid response from server');
      }
    } catch (err) {
      console.error('Login error:', err);
      const errorMessage = err.response?.data?.message || 'Login failed. Please check your credentials.';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-wrapper">
      <Loader loading={loading} message="Logging in..." />
      <video autoPlay muted loop className="video-background">
        <source src="/background.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      <div className="login-container">
        <form className="login-form" onSubmit={handleLogin}>
          <h2>Login</h2>
          {error && <p className="error-message">{error}</p>}
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit" disabled={loading}>Login</button>
          <div className="link-container">
            <a href="/register">Create account</a>
            <a href="/forgot-password">Forgot password?</a>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;