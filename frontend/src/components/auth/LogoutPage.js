import React, { useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './LogoutPage.css';

const LogoutPage = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const logout = async () => {
            try {
                await axios.post('/api/auth/logout', {}, { withCredentials: true });
                console.log('Logged out');
            } catch (error) {
                console.error('Logout failed', error);
            } finally {
                // Clear any user context or local storage here if needed
                navigate('/login');
            }
        };

        logout();
    }, [navigate]);

    return (
        <div className="logout-wrapper">
            <video autoPlay muted loop className="video-background">
                <source src="/background.mp4" type="video/mp4" />
                Your browser does not support the video tag.
            </video>
            <div className="logout-message">
                <h2>Logging you out...</h2>
            </div>
        </div>
    );
};

export default LogoutPage;
