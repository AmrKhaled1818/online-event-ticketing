import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import './LoginPage.css';
import api from '../../api/api';
import Loader from '../common/Loader';

const ResetPasswordPage = () => {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        if (password !== confirmPassword) {
            setError('Passwords do not match');
            toast.error('Passwords do not match');
            setLoading(false);
            return;
        }

        try {
            const email = localStorage.getItem('resetEmail');
            if (!email) {
                throw new Error('Email not found. Please try the forgot password process again.');
            }

            await api.put('/resetPassword', { email, password });
            toast.success('Password reset successful!');
            
            // Clear stored email
            localStorage.removeItem('resetEmail');
            
            // Add artificial delay
            setTimeout(() => {
                navigate('/login');
            }, 1500);
        } catch (err) {
            const errorMessage = err.response?.data?.message || 'Failed to reset password. Please try again.';
            setError(errorMessage);
            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="reset-wrapper">
            <Loader loading={loading} message="Resetting password..." />
            <video autoPlay muted loop className="video-background">
                <source src="/background.mp4" type="video/mp4" />
                Your browser does not support the video tag.
            </video>

            <div className="reset-container">
                <form className="reset-form" onSubmit={handleSubmit}>
                    <h2>Reset Password</h2>
                    {error && <p className="error-message">{error}</p>}
                    <input
                        type="password"
                        placeholder="New Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    <input
                        type="password"
                        placeholder="Confirm New Password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                    />
                    <button type="submit" disabled={loading}>Reset Password</button>
                    <div className="link-container">
                        <a href="/login">Back to Login</a>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ResetPasswordPage; 