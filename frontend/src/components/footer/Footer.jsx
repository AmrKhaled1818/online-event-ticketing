import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import './Footer.css';
import api from '../../api/api';

const Footer = () => {
  const [selectedInterests, setSelectedInterests] = useState([]);
  const [selectedBudget, setSelectedBudget] = useState('');
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    company: '',
    email: '',
    phone: '',
    message: ''
  });
  
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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (selectedInterests.length === 0) {
      toast.error('Please select at least one interest');
      return;
    }
    
    if (!selectedBudget) {
      toast.error('Please select a budget range');
      return;
    }

    setLoading(true);
    try {
      await api.post('/users/contact', {
        ...formData,
        interests: selectedInterests,
        budget: selectedBudget
      });
      
      toast.success('Message sent successfully! We will get back to you soon.');
      
      // Reset form
      setFormData({
        name: '',
        company: '',
        email: '',
        phone: '',
        message: ''
      });
      setSelectedInterests([]);
      setSelectedBudget('');
      
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to send message. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <footer className="footer-wrapper">
      <div className="footer-contact">
        <h3>Ready to plan your next event with us?</h3>
        <form className="contact-form" onSubmit={handleSubmit}>
          <div className="form-section">
            <label>Name</label>
            <input 
              type="text" 
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Your name" 
              required 
            />
          </div>
          
          <div className="form-section">
            <label>Company</label>
            <input 
              type="text" 
              name="company"
              value={formData.company}
              onChange={handleInputChange}
              placeholder="Company name" 
            />
          </div>
          
          <div className="form-section">
            <label>Your Email</label>
            <input 
              type="email" 
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="your.email@example.com" 
              required 
            />
          </div>
          
          <div className="form-section">
            <label>Your Phone</label>
            <input 
              type="tel" 
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              placeholder="Your phone number" 
            />
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
              name="message"
              value={formData.message}
              onChange={handleInputChange}
              placeholder="Describe your event requirements, preferred dates, expected attendance, or any special requests..."
              rows="4"
              required
            ></textarea>
          </div>
          
          <button type="submit" disabled={loading}>
            {loading ? 'Sending...' : 'Submit Request'}
          </button>
        </form>
      </div>
      
      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} Eventure. All rights reserved.</p>
        <div className="footer-links">
          <Link to="/events">Events</Link>
          <Link to="/profile">Profile</Link>
          <Link to="/my-events">My Events</Link>
          <Link to="/termsandpolicy">Privacy Policy</Link>
          <Link to="/termsandpolicy">Terms of Service</Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
