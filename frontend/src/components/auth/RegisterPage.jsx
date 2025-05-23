import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import './LoginPage.css';
import axios from 'axios';
import Loader from '../common/Loader';

const RegisterPage = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        role: 'user',
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            toast.error('Passwords do not match');
            return;
        }

        setLoading(true);
        try {
            const response = await axios.post('/api/v1/register', formData);
            console.log('Register success:', response.data);
            toast.success('Registration successful! Please log in.');
            setError('');
            
            // Add artificial delay
            setTimeout(() => {
                navigate('/login');
            }, 1500);
        } catch (err) {
            const errorMessage = err.response?.data?.message || 'Registration failed';
            setError(errorMessage);
            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="register-wrapper">
            <Loader loading={loading} message="Creating your account..." />
            <video autoPlay muted loop className="video-background">
                <source src="/background.mp4" type="video/mp4" />
                Your browser does not support the video tag.
            </video>

            <div className="register-container">
                <form className="register-form" onSubmit={handleRegister}>
                    <h2>Create Account</h2>
                    {error && <p className="error-message">{error}</p>}
                    <input
                        type="text"
                        name="name"
                        placeholder="Full Name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                    />
                    <input
                        type="email"
                        name="email"
                        placeholder="Email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />
                    <input
                        type="password"
                        name="password"
                        placeholder="Password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                    />
                    <input
                        type="password"
                        name="confirmPassword"
                        placeholder="Confirm Password"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        required
                    />
                    <select name="role" value={formData.role} onChange={handleChange}>
                        <option value="user">Standard User</option>
                        <option value="organizer">Event Organizer</option>
                        <option value="admin">Admin</option>
                    </select>
                    <button type="submit" disabled={loading}>Register</button>
                    <div className="link-container">
                        <a href="/login">Already have an account?</a>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default RegisterPage;
