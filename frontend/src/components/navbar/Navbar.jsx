import React, { useEffect, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import api from '../../api/api';
import './Navbar.css';

const Navbar = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  
  useEffect(() => {
    // Get user data from localStorage
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  const handleLogout = async () => {
    try {
      // First clear local storage
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      
      // Then call the logout API
      await api.post('/logout');
      
      // Force a page reload to clear any remaining state
      window.location.href = '/login';
    } catch (error) {
      console.error('Logout failed:', error);
      // Even if the API call fails, still redirect to login
      window.location.href = '/login';
    }
  };

  return (
    <nav className="navbar">
      <div className="navbar-logo" onClick={() => navigate('/')}>
        TicketEase
      </div>

      <div className="navbar-links">
        <NavLink to="/events">Events</NavLink>
        {user ? (
          <>
            {user.role === 'organizer' && (
              <NavLink to="/my-events">My Events</NavLink>
            )}
            {user.role === 'admin' && (
              <NavLink to="/admin/events">Admin</NavLink>
            )}
            <NavLink to="/profile">Profile</NavLink>
            <button className="logout-btn" onClick={handleLogout}>Logout</button>
          </>
        ) : (
          <NavLink to="/login">Login</NavLink>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
