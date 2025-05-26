import React from 'react';
import RecentEvents from '../components/home/RecentEvents';
import './HomePage.css';

const HomePage = () => {
  return (
    <div className="home-page">
      <section className="hero-section">
        <div className="hero-content">
          <h1>Welcome to EventHub</h1>
          <p>Discover and book tickets for amazing events in your area</p>
        </div>
      </section>

      <section className="recent-events-section">
        <RecentEvents />
      </section>
    </div>
  );
};

export default HomePage; 