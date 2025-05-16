import React, { useEffect, useState } from 'react';
import './EventDetails.css';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const EventDetails = () => {
    const { id } = useParams();
    const [event, setEvent] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchEvent = async () => {
            try {
                const res = await axios.get(`/api/events/${id}`);
                setEvent(res.data);
            } catch (err) {
                console.error('Error fetching event:', err);
            }
        };
        fetchEvent();
    }, [id]);

    const handleBook = async () => {
        try {
            const res = await axios.post(
                `/api/bookings`,
                { eventId: event._id, quantity },
                { withCredentials: true }
            );
            setMessage(`Successfully booked ${quantity} ticket(s)!`);
            setError('');
        } catch (err) {
            setError(err.response?.data?.message || 'Booking failed');
        }
    };

    if (!event) return <p>Loading...</p>;

    return (
        <div className="event-details-wrapper">
            <h2>{event.title}</h2>
            <p><strong>Date:</strong> {new Date(event.date).toLocaleString()}</p>
            <p><strong>Location:</strong> {event.location}</p>
            <p><strong>Price:</strong> {event.price} EGP</p>
            <p><strong>Available Tickets:</strong> {event.availableTickets}</p>

            <div className="booking-section">
                <input
                    type="number"
                    min="1"
                    max={event.availableTickets}
                    value={quantity}
                    onChange={(e) => setQuantity(Number(e.target.value))}
                />
                <button onClick={handleBook}>Book</button>
            </div>

            {message && <p className="success-message">{message}</p>}
            {error && <p className="error-message">{error}</p>}
        </div>
    );
};

export default EventDetails;
