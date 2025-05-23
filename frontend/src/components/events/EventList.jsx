import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/api';
import './EventList.css';

const EventList = () => {
  const [events, setEvents] = useState([]);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [location, setLocation] = useState('All');
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
    const fetchEvents = async () => {
      try {
        const res = await getAllEvents();
        setEvents(res);
      } catch (err) {
        console.error("Error fetching events:", err);
      }
    };
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
  }, []);

  const filteredEvents = events.filter(event => {
    const matchTitle = event.title.toLowerCase().includes(search.toLowerCase());
    const matchCategory = category === 'All' || event.category === category;
    const matchLocation = location === 'All' || event.location === location;
    return matchTitle && matchCategory && matchLocation;
  });

  const uniqueLocations = ['All', ...new Set(events.map(event => event.location).filter(Boolean))];
  };

  if (loading) return <div className="loading">Loading events...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="event-list-wrapper">
      <h2>Available Events</h2>

      <div className="event-search-panel">
        <div className="search-row with-icon">
          <input
            type="text"
            placeholder="Search events..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <span className="search-icon">
            <svg xmlns="http://www.w3.org/2000/svg" height="20" fill="#D84040" viewBox="0 0 24 24" width="20">
              <path d="M0 0h24v24H0z" fill="none" />
              <path
                d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0016 9.5 
                6.5 6.5 0 109.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 
                4.99L20.49 19l-4.99-5zM10 14a4 4 0 110-8 4 4 0 010 8z"
              />
            </svg>
          </span>
        </div>

        <div className="filters-row">
          <select value={category} onChange={(e) => setCategory(e.target.value)}>
            <option value="All">All Categories</option>
            <option value="Music">Music</option>
            <option value="Conference">Conference</option>
            <option value="Technology">Technology</option>
          </select>

          <select value={location} onChange={(e) => setLocation(e.target.value)}>
            {uniqueLocations.map(loc => (
              <option key={loc} value={loc}>{loc}</option>
            ))}
          </select>

          <button
            className="reset-btn"
            onClick={() => {
              setSearch('');
              setCategory('All');
              setLocation('All');
            }}
          >
            Reset
          </button>
        </div>
      </div>

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
        {filteredEvents.map(event => (
          <EventCard key={event._id} event={event} />
        ))}
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
