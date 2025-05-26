import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/api';
import './RecentEvents.css';

const RecentEvents = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchRecentEvents = async () => {
      try {
        const response = await api.get('/events/recent');
        if (response.data.success) {
          setEvents(response.data.data);
        }
      } catch (err) {
        console.error('Error fetching recent events:', err);
        setError('Failed to load recent events');
      } finally {
        setLoading(false);
      }
    };

    fetchRecentEvents();
  }, []);

  if (loading) {
    return (
      <div className="recent-events-container">
        <h2>Recent Events</h2>
        <div className="loading">Loading events...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="recent-events-container">
        <h2>Recent Events</h2>
        <div className="error">{error}</div>
      </div>
    );
  }

  return (
    <div className="recent-events-container">
      <h2>Recent Events</h2>
      {events.length === 0 ? (
        <p>No events found</p>
      ) : (
        <div className="events-grid">
          {events.map((event) => (
            <div key={event._id} className="event-card">
              <div className="event-image">
                {event.image ? (
                  <img src={event.image} alt={event.title} />
                ) : (
                  <div className="no-image">No Image</div>
                )}
              </div>
              <div className="event-details">
                <h3>{event.title}</h3>
                <p className="event-date">
                  {new Date(event.date).toLocaleDateString()}
                </p>
                <p className="event-location">{event.location}</p>
                <p className="event-price">EGP {event.ticketPrice}</p>
                <Link to={`/events/${event._id}`} className="view-event-btn">
                  View Event
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RecentEvents; 