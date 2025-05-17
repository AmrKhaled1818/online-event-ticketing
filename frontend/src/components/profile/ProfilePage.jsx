import React, { useEffect, useState } from 'react';
import './ProfilePage.css';
import UpdateProfileForm from './UpdateProfileForm';    
import api from '../../api/api'; 

const ProfilePage = () => {
    const [user, setUser] = useState(null);
    const [editMode, setEditMode] = useState(false);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await api.get('/users/profile');
                setUser(response.data);
            } catch (err) {
                console.error('Failed to fetch profile', err);
            }
        };
        fetchProfile();
    }, []);

    return (
        <div className="profile-wrapper">
            <div className="profile-card">
                {!user ? (
                    <p className="loading-text">Loading profile...</p>
                ) : editMode ? (
                    <UpdateProfileForm user={user} onUpdate={() => setEditMode(false)} />
                ) : (
                    <>
                        <h2>Welcome, {user.name}</h2>
                        <p><span>Name:</span> {user.name}</p>
                        <p><span>Email:</span> {user.email}</p>
                        <p><span>Role:</span> {user.role}</p>
                        <button onClick={() => setEditMode(true)}>Edit Profile</button>
                    </>
                )}
            </div>
        </div>
    );
};

export default ProfilePage;
