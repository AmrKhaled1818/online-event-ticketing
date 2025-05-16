import React from 'react';
import './BookingCard.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const BookingCard = ({ booking }) => {
    const navigate = useNavigate();

    const handleCancel = async () => {
        try {
            await axios.put(`/api/bookings/${booking._id}/cancel`, {}, { withCredentials: true });
            alert('Booking cancelled');
            window.location.reload(); // Refresh the page
        } catch (err) {
            alert('Failed to cancel booking');
        }
    };

    return (
        <div className="booking-card">
            <h3>{booking.eventTitle}</h3>
            <p><strong>Quantity:</strong> {booking.quantity}</p>
            <p><strong>Total:</strong> {booking.totalPrice} EGP</p>
            <p><strong>Status:</strong> {booking.status}</p>
            <div className="booking-actions">
                <button onClick={() => navigate(`/bookings/${booking._id}`)}>View</button>
                {booking.status === 'Confirmed' && (
                    <button className="cancel-btn" onClick={handleCancel}>Cancel</button>
                )}
            </div>
        </div>
    );
};

export default BookingCard;
