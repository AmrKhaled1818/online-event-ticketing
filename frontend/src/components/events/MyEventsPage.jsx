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
      <button
        className="new-event-btn"
        onClick={() => navigate('/my-events/new')}
      >
        ➕ Create New Event
      </button>

      <div className="event-grid">
        {events.length === 0 ? (
          <p>No events yet. Click above to create one.</p>
        ) : (
          events.map((event) => (
            <div key={event._id} className="event-item">
              <EventCard event={event} />

              <div className="event-actions">
                <button onClick={() => navigate(`/my-events/${event._id}/edit`)}>
                  ✏️ Edit
                </button>
                <button
                  className="delete-btn"
                  onClick={() => handleDelete(event._id)}
                >
                  🗑️ Delete
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
