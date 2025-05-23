import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // TODO: integrate with auth API
    localStorage.removeItem('user'); // if you're storing a token
    navigate('/logout');
  };

  return (
    <nav className="navbar">
      <div className="navbar-logo" cursor="pointer">
        TicketEase
      </div>

      <div className="navbar-links">
        <NavLink to="/events">Events</NavLink>
        <NavLink to="/my-events">My Events</NavLink>
        <NavLink to="/profile">Profile</NavLink>
        <button className="logout-btn" onClick={handleLogout}>Logout</button>
      </div>
    </nav>
  );
};

export default Navbar;
