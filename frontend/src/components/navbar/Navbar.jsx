import React, { useEffect, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
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

  const handleLogout = () => {
    // TODO: integrate with auth API
    localStorage.removeItem('user'); // if you're storing a token
    navigate('/logout');
  };

  return (
    <nav className="navbar">
      <div className="navbar-logo" onClick={() => navigate('/')}>
      TicketEase
      </div>

      <div className="navbar-links">
        <NavLink to="/events">Events</NavLink>
        <NavLink to="/my-events">My Events</NavLink>
        {user && user.role === 'admin' && (
          <NavLink to="/admin/events">Admin</NavLink>
        )}
        <NavLink to="/profile">Profile</NavLink>
        <button className="logout-btn" onClick={handleLogout}>Logout</button>
      </div>
    </nav>
  );
};

export default Navbar;
