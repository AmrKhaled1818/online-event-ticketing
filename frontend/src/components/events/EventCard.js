import React from 'react';
import './EventCard.css';
import { Link } from 'react-router-dom';

const EventCard = ({ event }) => {
    return (
        <Link to={`/events/${event._id}`} className="event-card">
            <h3>{event.title}</h3>
            <p>{new Date(event.date).toLocaleDateString()}</p>
            <p>{event.location}</p>
            <p>{event.price} EGP</p>
        </Link>
    );
};

export default EventCard;
