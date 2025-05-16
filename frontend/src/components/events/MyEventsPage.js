import React, { useEffect, useState } from 'react';
import './MyEventsPage.css';
import EventCard from './EventCard';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const MyEventsPage = () => {
    const [events, setEvents] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchMyEvents = async () => {
            try {
                const res = await axios.get('/api/events/my', { withCredentials: true });
                setEvents(res.data);
            } catch (err) {
                console.error('Error fetching my events', err);
            }
        };
        fetchMyEvents();
    }, []);

    const handleDelete = async (id) => {
        try {
            await axios.delete(`/api/events/${id}`, { withCredentials: true });
            setEvents(events.filter((e) => e._id !== id));
        } catch (err) {
            alert('Failed to delete event');
        }
    };

    return (
        <div className="my-events-page">
            <h2>My Events</h2>
            <button className="new-event-btn" onClick={() => navigate('/my-events/new')}>+ New Event</button>
            <div className="event-grid">
                {events.map((event) => (
                    <div key={event._id} className="event-item">
                        <EventCard event={event} />
                        <div className="event-actions">
                            <button onClick={() => navigate(`/my-events/${event._id}/edit`)}>Edit</button>
                            <button className="delete-btn" onClick={() => handleDelete(event._id)}>Delete</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default MyEventsPage;
