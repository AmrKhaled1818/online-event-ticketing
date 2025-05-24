import React, { useEffect, useState } from 'react';
import './BookingDetails.css';
import { useParams } from 'react-router-dom';
import api from '../../api/api';

const BookingDetails = () => {
    const { id } = useParams();
    const [booking, setBooking] = useState(null);

    useEffect(() => {
        const fetchBooking = async () => {
            try {
                const res = await api.get(`/bookings/${id}`);
                setBooking(res.data);
            } catch (err) {
                console.error('Failed to fetch booking', err);
            }
        };
        fetchBooking();
    }, [id]);

    if (!booking) return <p>Loading...</p>;

    return (
        <div className="booking-details">
            <h2>Booking Details</h2>
            <p><strong>Event:</strong> {booking.eventTitle}</p>
            <p><strong>Date:</strong> {new Date(booking.createdAt).toLocaleString()}</p>
            <p><strong>Quantity:</strong> {booking.quantity}</p>
            <p><strong>Total Price:</strong> {booking.totalPrice} EGP</p>
            <p><strong>Status:</strong> {booking.status}</p>
        </div>
    );
};

export default BookingDetails;
