import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import EventCard from './EventCard';
import api from '../../api/api';
import './EventList.css';

const EventList = () => {
  const [events, setEvents] = useState([]);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [location, setLocation] = useState('All');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchEvents = async () => {
  try {
    const response = await api.get('/events');
    const eventList = Array.isArray(response.data)
      ? response.data
      : response.data?.data || []; // fallback to [] if not valid

    setEvents(eventList);
  } catch (err) {
    console.error('Error fetching events:', err);
    setError('Failed to load events');
  } finally {
    setLoading(false);
  }
};

    fetchEvents();
  }, []);

  const uniqueLocations = ['All', ...new Set(events.map(event => event.location).filter(Boolean))];

  const filteredEvents = events.filter(event => {
    const matchTitle = event.title.toLowerCase().includes(search.toLowerCase());
    const matchCategory = category === 'All' || event.category === category;
    const matchLocation = location === 'All' || event.location === location;
    return matchTitle && matchCategory && matchLocation;
  });

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
              <path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0016 9.5 6.5 6.5 0 109.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zM10 14a4 4 0 110-8 4 4 0 010 8z" />
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

      <div className="event-list">
        {filteredEvents.length === 0 ? (
          <div className="no-events">No events found</div>
        ) : (
          filteredEvents.map(event => (
            <EventCard key={event._id} event={event} />
          ))
        )}
      </div>
    </div>
  );
};

export default EventList;