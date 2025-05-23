import React, { useEffect, useState } from 'react';
import './MyEventsPage.css';
import EventCard from './EventCard';
import { useNavigate } from 'react-router-dom';
import { getMyEvents, deleteEvent } from '../../api/events';

const MyEventsPage = () => {
  const [events, setEvents] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    getMyEvents()
      .then(setEvents)
      .catch((err) => console.error('Error fetching my events', err));
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this event?')) return;
    try {
      await deleteEvent(id);
      setEvents(events.filter((e) => e._id !== id));
    } catch (err) {
      alert('Failed to delete event');
    }
  };

  return (
    <div className="my-events-page">
      <h2>My Events</h2>
      <div className="action-buttons">
        <button className="new-event-btn" onClick={() => navigate('/my-events/new')}>
          <span className="icon-text">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24">
              <path d="M13 11h8v2h-8v8h-2v-8H3v-2h8V3h2v8z" />
            </svg>
            Create New Event
          </span>
        </button>
        <button className="analytics-btn" onClick={() => navigate('/my-events/analytics')}>
          <span className="icon-text">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24">
              <path d="M3 17h2v-7H3v7zm4 0h2V7H7v10zm4 0h2v-4h-2v4zm4 0h2V4h-2v13zm4 0h2v-9h-2v9z" />
            </svg>
            View Analytics
          </span>
        </button>
      </div>

      <div className="event-grid">
        {events.length === 0 ? (
          <p>No events yet. Click above to create one.</p>
        ) : (
          events.map((event) => (
            <div key={event._id} className="event-item">
              <EventCard event={event} />
              <div className="event-actions">
                <button onClick={() => navigate(`/my-events/${event._id}/edit`)}>
                  <span className="icon-text dark-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24">
                      <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 
                      7.04a1.003 1.003 0 0 0 0-1.42l-2.34-2.34a1.003 
                      1.003 0 0 0-1.42 0l-1.83 1.83 3.75 3.75 1.84-1.82z" />
                    </svg>
                    Edit
                  </span>
                </button>
                <button className="delete-btn" onClick={() => handleDelete(event._id)}>
                  <span className="icon-text">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24">
                      <path d="M16 9v10H8V9h8m-1.5-6h-5l-1 
                      1H5v2h14V4h-4.5l-1-1zM18 7H6v12c0 
                      1.1.9 2 2 2h8c1.1 0 2-.9 
                      2-2V7z" />
                    </svg>
                    Delete
                  </span>
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default MyEventsPage;
