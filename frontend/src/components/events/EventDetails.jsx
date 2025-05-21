import React, { useEffect, useState } from 'react';
import './EventDetails.css';
import { useParams } from 'react-router-dom';
import api from '../../api/api';

const EventDetails = () => {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [bookingMessage, setBookingMessage] = useState('');

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/events/${id}`);
        if (response.data.success) {
          setEvent(response.data.data);
        } else {
          setError('Failed to load event details');
        }
      } catch (err) {
        console.error('Error fetching event:', err);
        setError(err.response?.data?.message || 'Error loading event details');
      } finally {
        setLoading(false);
      }
    };
    fetchEvent();
  }, [id]);

  const handleBookTicket = async () => {
    try {
      await api.post('/bookings', {
        eventId: event._id,
        quantity: quantity
      });
      setBookingMessage('Ticket booked successfully!');
      // Refresh event details to update remaining tickets
      const updatedEvent = await api.get(`/events/${id}`);
      setEvent(updatedEvent.data.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to book ticket');
    }
  };

  if (loading) return <div className="loading">Loading event details...</div>;
  if (error) return <div className="error">{error}</div>;
  if (!event) return <div className="no-event">Event not found</div>;

  return (
    <div className="event-details-container">
      <div className="event-details-content">
        <div className="event-details-header">
          <h1>{event.title}</h1>
          <div className="event-meta">
            <span className="event-category">{event.category}</span>
            <span className="event-status">
              {event.remainingTickets === 0 ? 'Sold Out' : 'Available'}
            </span>
          </div>
        </div>

        <div className="event-details-grid">
          <div className="event-details-main">
            <div className="details-section">
              <h2>Event Information</h2>
              <div className="details-grid">
                <div className="detail-item">
                  <i className="fas fa-map-marker-alt"></i>
                  <div>
                    <h3>Location</h3>
                    <p>{event.location}</p>
                  </div>
                </div>
                <div className="detail-item">
                  <i className="fas fa-calendar"></i>
                  <div>
                    <h3>Date</h3>
                    <p>{new Date(event.date).toLocaleDateString()}</p>
                  </div>
                </div>
                <div className="detail-item">
                  <i className="fas fa-clock"></i>
                  <div>
                    <h3>Time</h3>
                    <p>{new Date(event.date).toLocaleTimeString()}</p>
                  </div>
                </div>
                <div className="detail-item">
                  <i className="fas fa-ticket-alt"></i>
                  <div>
                    <h3>Price</h3>
                    <p>${event.ticketPrice}</p>
                  </div>
                </div>
                <div className="detail-item">
                  <i className="fas fa-users"></i>
                  <div>
                    <h3>Available Tickets</h3>
                    <p>{event.remainingTickets} of {event.totalTickets}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="details-section">
              <h2>About this event</h2>
              <p className="event-description">{event.description}</p>
            </div>
          </div>

          <div className="event-details-sidebar">
            <div className="ticket-card">
              <h3>Book Tickets</h3>
              <div className="ticket-price">
                <span className="price-label">Price per ticket</span>
                <span className="price-value">${event.ticketPrice}</span>
              </div>
              <div className="ticket-availability">
                <span className="availability-label">Available Tickets</span>
                <span className="availability-value">{event.remainingTickets}</span>
              </div>
              {event.remainingTickets > 0 && (
                <div className="quantity-selector">
                  <label htmlFor="quantity">Number of Tickets:</label>
                  <input
                    type="number"
                    id="quantity"
                    min="1"
                    max={event.remainingTickets}
                    value={quantity}
                    onChange={(e) => setQuantity(Number(e.target.value))}
                  />
                </div>
              )}
              <button 
                className="buy-ticket-button"
                onClick={handleBookTicket}
                disabled={event.remainingTickets === 0}
              >
                {event.remainingTickets === 0 ? 'Sold Out' : 'Book Tickets'}
              </button>
              {bookingMessage && (
                <div className="booking-message success">{bookingMessage}</div>
              )}
              {error && (
                <div className="booking-message error">{error}</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetails; 