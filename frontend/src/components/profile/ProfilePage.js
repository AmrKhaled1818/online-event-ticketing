import React, { useEffect, useState } from 'react';
import './ProfilePage.css';
import UpdateProfileForm from './UpdateProfileForm';
import axios from 'axios';

const ProfilePage = () => {
    const [user, setUser] = useState(null);
    const [editMode, setEditMode] = useState(false);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await axios.get('/api/users/profile', { withCredentials: true });
                setUser(response.data);
            } catch (err) {
                console.error('Failed to fetch profile', err);
            }
        };
        fetchProfile();
    }, []);

    return (
        <div className="profile-wrapper">
            <video autoPlay muted loop className="video-background">
                <source src="/background.mp4" type="video/mp4" />
            </video>

            <div className="profile-container">
                {!user ? (
                    <p>Loading profile...</p>
                ) : editMode ? (
                    <UpdateProfileForm user={user} onUpdate={() => setEditMode(false)} />
                ) : (
                    <div className="profile-card">
                        <h2>Your Profile</h2>
                        <p><strong>Name:</strong> {user.name}</p>
                        <p><strong>Email:</strong> {user.email}</p>
                        <p><strong>Role:</strong> {user.role}</p>
                        <button onClick={() => setEditMode(true)}>Edit Profile</button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProfilePage;
