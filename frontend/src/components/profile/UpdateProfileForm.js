import React, { useState } from 'react';
import './UpdateProfileForm.css';
import api from '../../api/api';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

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
        console.log('Form submitted'); // Debug log
        try {
            const res = await api.put('/users/profile', formData);
            console.log('Update successful:', res.data); // Debug log
            setMessage('Profile updated successfully!');
            setError('');
            
            // Call toast directly
            toast('Profile updated successfully!', {
                type: 'success',
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
            });
            
            setTimeout(() => {
                onUpdate();
            }, 1000);
        } catch (err) {
            console.log('Update failed:', err); // Debug log
            const errorMessage = err.response?.data?.message || 'Update failed';
            setError(errorMessage);
            
            // Call toast directly
            toast(errorMessage, {
                type: 'error',
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
            });
        }
    };

    return (
        <div className="update-profile-form">
            <h2>Update Profile</h2>
            {message && <p className="success-message">{message}</p>}
            {error && <p className="error-message">{error}</p>}
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="name">Name</label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="email">Email</label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />
                </div>
                <button type="submit">Update Profile</button>
            </form>
        </div>
    );
};

export default UpdateProfileForm;
