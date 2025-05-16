import React, { useEffect, useState } from 'react';
import './EventList.css';
import EventCard from './EventCard';
import axios from 'axios';

const EventList = () => {
    const [events, setEvents] = useState([]);

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const res = await axios.get('/api/v1/events');
                setEvents(res.data);
            } catch (err) {
                console.error('Failed to fetch events', err);
            }
        };
        fetchEvents();
    }, []);

    return (
        <div className="event-list-wrapper">
            <h2>Available Events</h2>
            <div className="event-list">
                {events.map((event) => (
                    <EventCard key={event._id} event={event} />
                ))}
            </div>
        </div>
    );
};

export default EventList;
