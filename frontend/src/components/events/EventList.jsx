import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import EventSearch from './EventSearch';
import api from '../../api/api';
import './EventList.css';

const EventList = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchEvents = async () => {
    try {
      const response = await api.get('/events');
      if (response.data.success) {
        setEvents(response.data.data || []);
      } else {
        setError('Failed to fetch events');
        setEvents([]);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch events');
      setEvents([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleSearchResults = (searchResults) => {
    setEvents(searchResults || []);
  };

  if (loading) {
    return <div className="loading">Loading events...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="event-list-container">
      <h1>Upcoming Events</h1>
      <EventSearch onSearchResults={handleSearchResults} />
      
      {!events || events.length === 0 ? (
        <div className="no-events">No events found</div>
      ) : (
        <div className="event-grid">
          {events.map((event) => (
            <Link to={`/events/${event._id}`} key={event._id} className="event-card">
              <div className="event-image">
                <img src={event.image} alt={event.title} />
              </div>
              <div className="event-details">
                <h2>{event.title}</h2>
                <p className="event-date">{new Date(event.date).toLocaleDateString()}</p>
                <p className="event-location">{event.location}</p>
                <p className="event-price">${event.ticketPrice}</p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default EventList;