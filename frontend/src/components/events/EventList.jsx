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
        <div className="event-list">
          {events.map((event) => (
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
          ))}
        </div>
      )}
    </div>
  );
};

export default EventList;