import React, { useEffect } from 'react';
import api from '../../api/api';
import { useNavigate } from 'react-router-dom';
import './LoginPage.css';

const LogoutPage = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const logout = async () => {
            try {
                // First clear local storage
                localStorage.removeItem('user');
                localStorage.removeItem('token');
                
                // Then call the logout API
                await api.post('/logout');
                
                // Force a page reload to clear any remaining state
                window.location.href = '/login';
            } catch (error) {
                console.error('Logout failed', error);
                // Even if the API call fails, still redirect to login
                window.location.href = '/login';
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
