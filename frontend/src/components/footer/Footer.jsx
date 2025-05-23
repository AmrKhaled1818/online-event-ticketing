import React, { useState } from 'react';
import './Footer.css';

const Footer = () => {
  const [selectedInterests, setSelectedInterests] = useState([]);
  const [selectedBudget, setSelectedBudget] = useState('');
  
  const interests = [
    'Event Planning', 'Concert Tickets', 'Sports Events', 'Festivals',
    'Theater Shows', 'Comedy Shows', 'Corporate Events', 'Private Parties'
  ];
  
  const budgetOptions = [
    { value: 'free', label: 'Free' },
    { value: 'low', label: '≤ $100' },
    { value: 'high', label: '> $100' }
  ];

  const handleInterestToggle = (interest) => {
    setSelectedInterests(prev => 
      prev.includes(interest) 
        ? prev.filter(i => i !== interest)
        : [...prev, interest]
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission
    console.log('Form submitted with interests:', selectedInterests, 'budget:', selectedBudget);
  };

  return (
    <footer className="footer-wrapper">
      <div className="footer-contact">
        <h3>Ready to plan your next event with us?</h3>
        <form className="contact-form" onSubmit={handleSubmit}>
          <div className="form-section">
            <label>Name</label>
            <input type="text" placeholder="Your name" required />
          </div>
          
          <div className="form-section">
            <label>Company</label>
            <input type="text" placeholder="Company name" />
          </div>
          
          <div className="form-section">
            <label>Your Email</label>
            <input type="email" placeholder="your.email@example.com" required />
          </div>
          
          <div className="form-section">
            <label>Your Phone</label>
            <input type="tel" placeholder="Your phone number" />
          </div>
          
          <div className="interest-section">
            <label>I'm interested in...</label>
            <div className="interest-tags">
              {interests.map(interest => (
                <span
                  key={interest}
                  className={`interest-tag ${selectedInterests.includes(interest) ? 'selected' : ''}`}
                  onClick={() => handleInterestToggle(interest)}
                >
                  {interest}
                </span>
              ))}
            </div>
          </div>
          
          <div className="budget-section">
            <label>Event Budget (USD)</label>
            <div className="budget-options">
              {budgetOptions.map(option => (
                <div
                  key={option.value}
                  className={`budget-option ${selectedBudget === option.value ? 'selected' : ''}`}
                  onClick={() => setSelectedBudget(option.value)}
                >
                  {option.label}
                </div>
              ))}
            </div>
          </div>
          
          <div className="form-section full-width">
            <label>Tell us about your event</label>
            <textarea 
              placeholder="Describe your event requirements, preferred dates, expected attendance, or any special requests..."
              rows="4"
            ></textarea>
          </div>
          
          <button type="submit">Submit Request</button>
        </form>
      </div>
      
      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} Eventure. All rights reserved.</p>
        <div className="footer-links">
          <a href="/events">Events</a>
          <a href="/profile">Profile</a>
          <a href="/my-events">My Events</a>
          <a href="/privacy">Privacy Policy</a>
          <a href="/terms">Terms of Service</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;