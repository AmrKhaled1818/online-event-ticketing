import React from 'react';
import './BookingCard.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const BookingCard = ({ booking, onBookingCancelled }) => {
    const navigate = useNavigate();

    const handleCancel = async () => {
        try {
            await axios.delete(`/api/bookings/${booking._id}`, { withCredentials: true });
            toast.success('Booking cancelled successfully!', {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
            });
            // Call the callback to update the parent component
            if (onBookingCancelled) {
                onBookingCancelled(booking._id);
            }
        } catch (err) {
            toast.error('Failed to cancel booking', {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
            });
        }
    };

    return (
        <div className="booking-card">
            <ToastContainer />
            <h3>{booking.event?.title || booking.eventTitle}</h3>
            <p><strong>Quantity:</strong> {booking.ticketsBooked}</p>
            <p><strong>Total:</strong> {booking.totalPrice} EGP</p>
            <p><strong>Status:</strong> {booking.status}</p>
            <div className="booking-actions">
                <button onClick={() => navigate(`/bookings/${booking._id}`)}>View</button>
                {booking.status === 'confirmed' && (
                    <button className="cancel-btn" onClick={handleCancel}>Cancel</button>
                )}
            </div>
        </div>
    );
};

export default BookingCard;
