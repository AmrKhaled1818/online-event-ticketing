import React, { useState } from 'react';
import './UpdateProfileForm.css';
import axios from 'axios';

const UpdateProfileForm = ({ user, onUpdate }) => {
    const [formData, setFormData] = useState({
        name: user.name,
        email: user.email,
    });
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.put('/api/users/profile', formData, { withCredentials: true });
            setMessage('Profile updated successfully!');
            setError('');
            setTimeout(() => {
                onUpdate();
            }, 1000);
        } catch (err) {
            setError(err.response?.data?.message || 'Update failed');
        }
    };

    return (
        <form className="update-form" onSubmit={handleSubmit}>
            <h2>Edit Profile</h2>
            {error && <p className="error-message">{error}</p>}
            {message && <p className="success-message">{message}</p>}
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
                placeholder="Email Address"
                value={formData.email}
                onChange={handleChange}
                required
            />
            <div className="form-actions">
                <button type="submit">Save</button>
                <button type="button" onClick={onUpdate}>Cancel</button>
            </div>
        </form>
    );
};

export default UpdateProfileForm;
