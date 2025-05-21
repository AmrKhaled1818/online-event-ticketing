import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/api';
import './EventList.css';

const EventList = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilterSidebar, setShowFilterSidebar] = useState(false);
  const [filters, setFilters] = useState({
    category: '',
    date: '',
    priceRange: '',
    location: ''
  });

  useEffect(() => {
    fetchEvents();
  }, []); // Only fetch on initial load

  const fetchEvents = async () => {
    try {
      setLoading(true);
      let response;
      
      if (searchQuery) {
        // Use search endpoint if there's a search query
        response = await api.get('/events/search', {
          params: { query: searchQuery }
        });
      } else {
        // Use regular events endpoint with filters
        const params = {};
        if (filters.category) params.category = filters.category;
        if (filters.date) params.date = filters.date;
        if (filters.priceRange) params.priceRange = filters.priceRange;
        if (filters.location) params.location = filters.location;

        response = await api.get('/events', { params });
      }

      if (response.data.success) {
        setEvents(response.data.data);
      }
    } catch (err) {
      setError('Failed to load events');
      console.error('Error fetching events:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchEvents();
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const applyFilters = () => {
    fetchEvents();
    setShowFilterSidebar(false);
  };

  const clearFilters = () => {
    setFilters({
      category: '',
      date: '',
      priceRange: '',
      location: ''
    });
    setSearchQuery('');
    fetchEvents();
  };

  if (loading) return <div className="loading">Loading events...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="event-list-container">
      <h1>Upcoming Events</h1>
      
      <form onSubmit={handleSearch} className="search-section">
        <input
          type="text"
          placeholder="Search events..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="search-input"
        />
        <button type="submit" className="search-button">
          Search
        </button>
        <button 
          type="button"
          className="filter-button"
          onClick={() => setShowFilterSidebar(!showFilterSidebar)}
        >
          Filter
        </button>
      </form>

      <div className={`filter-sidebar ${showFilterSidebar ? 'open' : ''}`}>
        <div className="filter-header">
          <h3>Filter Events</h3>
          <button 
            type="button"
            className="close-filter"
            onClick={() => setShowFilterSidebar(false)}
          >
            ×
          </button>
        </div>

        <div className="filter-options">
          <div className="filter-group">
            <label>Category</label>
            <select
              name="category"
              value={filters.category}
              onChange={handleFilterChange}
            >
              <option value="">All Categories</option>
              <option value="Music">Music</option>
              <option value="Conference">Conference</option>
              <option value="Arts">Arts</option>
              <option value="Food & Drink">Food & Drink</option>
              <option value="Technology">Technology</option>
            </select>
          </div>

          <div className="filter-group">
            <label>Date</label>
            <select
              name="date"
              value={filters.date}
              onChange={handleFilterChange}
            >
              <option value="">All Dates</option>
              <option value="today">Today</option>
              <option value="tomorrow">Tomorrow</option>
              <option value="this-week">This Week</option>
              <option value="this-month">This Month</option>
            </select>
          </div>

          <div className="filter-group">
            <label>Price Range</label>
            <select
              name="priceRange"
              value={filters.priceRange}
              onChange={handleFilterChange}
            >
              <option value="">All Prices</option>
              <option value="free">Free</option>
              <option value="under-50">Under $50</option>
              <option value="50-100">$50 - $100</option>
              <option value="over-100">Over $100</option>
            </select>
          </div>

          <div className="filter-group">
            <label>Location</label>
            <input
              type="text"
              name="location"
              placeholder="Enter location"
              value={filters.location}
              onChange={handleFilterChange}
            />
          </div>

          <div className="filter-actions">
            <button 
              type="button"
              className="apply-filters"
              onClick={applyFilters}
            >
              Apply Filters
            </button>
            <button 
              type="button"
              className="clear-filters"
              onClick={clearFilters}
            >
              Clear Filters
            </button>
          </div>
        </div>
      </div>

      {showFilterSidebar && (
        <div 
          className="filter-overlay"
          onClick={() => setShowFilterSidebar(false)}
        />
      )}

      <div className="event-list">
        {events.length === 0 ? (
          <div className="no-events">No events found</div>
        ) : (
          events.map((event) => (
            <div key={event._id} className="event-card">
              <div className="event-header">
                <h2>{event.title}</h2>
                <span className="event-created-at">
                  Added: {new Date(event.createdAt).toLocaleDateString()}
                </span>
              </div>
              
              <div className="event-info">
                <div className="info-item">
                  <i className="fas fa-map-marker-alt"></i>
                  <span className="label">Location:</span>
                  <span>{event.location}</span>
                </div>
                <div className="info-item">
                  <i className="fas fa-calendar"></i>
                  <span className="label">Date:</span>
                  <span>{new Date(event.date).toLocaleDateString()}</span>
                </div>
                <div className="info-item">
                  <i className="fas fa-clock"></i>
                  <span className="label">Time:</span>
                  <span>{new Date(event.date).toLocaleTimeString()}</span>
                </div>
                <div className="info-item">
                  <i className="fas fa-ticket-alt"></i>
                  <span className="label">Price:</span>
                  <span>${event.ticketPrice}</span>
                </div>
                <div className="info-item">
                  <i className="fas fa-users"></i>
                  <span className="label">Available:</span>
                  <span>{event.remainingTickets} of {event.totalTickets}</span>
                </div>
                <div className="info-item">
                  <i className="fas fa-tag"></i>
                  <span className="label">Category:</span>
                  <span>{event.category}</span>
                </div>
              </div>

              <div className="event-actions">
                <Link 
                  to={`/events/${event._id}`} 
                  className="reserve-button"
                  disabled={event.remainingTickets === 0}
                >
                  {event.remainingTickets === 0 ? 'Sold Out' : 'Reserve Ticket'}
                </Link>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default EventList;