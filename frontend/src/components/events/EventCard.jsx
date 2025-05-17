import React from 'react';
import './EventCard.css';
import { Link } from 'react-router-dom';

const EventCard = ({ event }) => {
  return (
    <Link to={`/events/${event._id}`} className="event-card">
      <div className="event-header">
        <h3>{event.title}</h3>
        <span className="event-date">
          {new Date(event.date).toLocaleDateString()}
        </span>
      </div>

      <div className="event-category">{event.category}</div>

      <p className="event-description">{event.description}</p>

      <div className="event-meta">
        <div>
          <strong>Location:</strong> {event.location}
        </div>
        <div>
          <strong>Price:</strong> {event.ticketPrice} EGP
        </div>
        <div>
          <strong>Tickets:</strong> {event.remainingTickets}/{event.totalTickets}
        </div>
      </div>

      <div className="event-footer">
        <span className={`event-status ${event.status}`}>
          {event.status}
        </span>
        <span className="event-time">
          Added on {new Date(event.createdAt).toLocaleDateString()}
        </span>
      </div>
    </Link>
  );
};

export default EventCard;
