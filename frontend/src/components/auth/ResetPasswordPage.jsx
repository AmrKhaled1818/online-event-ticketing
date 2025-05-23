import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './ResetPasswordPage.css';
import api from '../../api/api';

const ResetPasswordPage = () => {
    const [formData, setFormData] = useState({
        password: '',
        confirmPassword: ''
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        // Check if reset token exists in localStorage
        const resetToken = localStorage.getItem('resetToken');
        if (!resetToken) {
            navigate('/forgot-password');
        }
    }, [navigate]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        if (formData.password.length < 6) {
            setError('Password must be at least 6 characters long');
            return;
        }

        try {
            const resetToken = localStorage.getItem('resetToken');
            await api.put('/resetPassword', {
                resetToken,
                password: formData.password
            });

            setSuccess('Password reset successful!');
            
            // Clear stored data
            localStorage.removeItem('resetEmail');
            localStorage.removeItem('resetToken');
            
            // Redirect to login page after 2 seconds
            setTimeout(() => {
                navigate('/login', { 
                    state: { message: 'Password reset successful! Please log in with your new password.' }
                });
            }, 2000);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to reset password. Please try again.');
        }
    };

    return (
        <div className="reset-wrapper">
            <video autoPlay muted loop className="video-background">
                <source src="/background.mp4" type="video/mp4" />
                Your browser does not support the video tag.
            </video>

            <div className="reset-container">
                <form className="reset-form" onSubmit={handleSubmit}>
                    <h2>Reset Password</h2>
                    {error && <p className="error-message">{error}</p>}
                    {success && <p className="success-message">{success}</p>}
                    <input
                        type="password"
                        name="password"
                        placeholder="New Password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                    />
                    <input
                        type="password"
                        name="confirmPassword"
                        placeholder="Confirm New Password"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        required
                    />
                    <button type="submit">Reset Password</button>
                    <div className="link-container">
                        <a href="/login">Back to Login</a>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ResetPasswordPage; 