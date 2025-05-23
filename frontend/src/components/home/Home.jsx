import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css';
import slideshow from './Slideshow.png';

const HomePage = () => {
  return (
    <div className="home-wrapper">
      <div className="hero-section">
        <img
          src={slideshow}
          alt="Hero Banner"
          className="hero-image"
        />
        <div className="hero-overlay">
          <h1>
            Unlock the stage to <span className="highlight">unforgettable experiences</span>.
          </h1>
          <p>
            Discover and book tickets to concerts, sports, festivals, and more. Best prices, best vibes.
          </p>
          <div className="hero-search">
            <input type="text" placeholder="Search for events..." />
            <button className="search-btn">
              <svg xmlns="http://www.w3.org/2000/svg" height="20" fill="#EEEEEE" viewBox="0 0 24 24" width="20">
                <path d="M0 0h24v24H0z" fill="none" />
                <path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0016 9.5
                    6.5 6.5 0 109.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5
                    4.99L20.49 19l-4.99-5zM10 14a4 4 0 110-8 4 4 0 010 8z"/>
              </svg>
            </button>
          </div>
        </div>
      </div>

      <div className="categories-section">
        <h2>Browse by Category</h2>
        <div className="categories-grid">
          <Link to="/events?category=Concerts" className="category-box">🎵 Concerts</Link>
          <Link to="/events?category=Festivals" className="category-box">🎉 Festivals</Link>
          <Link to="/events?category=Sports" className="category-box">🏟️ Sports</Link>
          <Link to="/events?category=Conferences" className="category-box">🎤 Conferences</Link>
          <Link to="/events?category=Movies" className="category-box">🎬 Movies</Link>
          <Link to="/events?category=Kids" className="category-box">🧒 Kids</Link>
        </div>
      </div>

      <div className="what-we-do-section">
        <div className="what-we-do-card">
          <div className="what-we-do-left">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="200" height="200">
              <defs>
                <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" style={{ stopColor: '#1D1616', stopOpacity: 1 }} />
                  <stop offset="100%" style={{ stopColor: '#8E1616', stopOpacity: 1 }} />
                </linearGradient>
                <linearGradient id="gradient2" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" style={{ stopColor: '#8E1616', stopOpacity: 0.9 }} />
                  <stop offset="100%" style={{ stopColor: '#D84040', stopOpacity: 0.8 }} />
                </linearGradient>
                <linearGradient id="gradient3" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" style={{ stopColor: '#D84040', stopOpacity: 0.8 }} />
                  <stop offset="100%" style={{ stopColor: '#8E1616', stopOpacity: 0.7 }} />
                </linearGradient>
                <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
                  <feDropShadow dx="2" dy="4" stdDeviation="3" flood-opacity="0.15"/>
                </filter>
              </defs>
              <circle cx="100" cy="100" r="90" fill="url(#gradient1)" filter="url(#shadow)" opacity="0.9"/>
              <circle cx="85" cy="85" r="45" fill="url(#gradient2)" opacity="0.8"/>
              <circle cx="125" cy="110" r="35" fill="url(#gradient3)" opacity="0.7"/>
              <circle cx="70" cy="130" r="20" fill="url(#gradient1)" opacity="0.6"/>
              <circle cx="140" cy="70" r="15" fill="url(#gradient2)" opacity="0.5"/>
              <path d="M 60 60 L 140 140" stroke="rgba(238,238,238,0.4)" strokeWidth="2" strokeLinecap="round"/>
              <path d="M 140 60 L 60 140" stroke="rgba(238,238,238,0.3)" strokeWidth="1.5" strokeLinecap="round"/>
              <circle cx="100" cy="100" r="8" fill="rgba(238,238,238,0.9)" opacity="0.8"/>
              <circle cx="100" cy="100" r="4" fill="rgba(238,238,238,1)"/>
            </svg>
          </div>
          <div className="what-we-do-right">
            <h2>We are a passion-first ticketing platform</h2>
            <p>
              We connect fans with unforgettable experiences through simple and secure ticketing. Whether you're
              an event organizer or a fan, our platform delivers a seamless experience, from discovery to reservation.
              <br /><br />
              With Eventure, you're not just attending events — you're making memories.
            </p>
            <Link to="/events" className="about-btn">Explore Events</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
