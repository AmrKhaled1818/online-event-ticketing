import React, { useEffect, useState } from 'react';
import './UserBookingsPage.css';
import BookingCard from './BookingCard';
import axios from 'axios';

const UserBookingsPage = () => {
    const [bookings, setBookings] = useState([]);

    useEffect(() => {
        const fetchBookings = async () => {
            try {
                const res = await axios.get('/api/bookings/my', { withCredentials: true });
                setBookings(res.data);
            } catch (err) {
                console.error('Error fetching bookings:', err);
            }
        };
        fetchBookings();
    }, []);

    return (
        <div className="bookings-page">
            <h2>My Bookings</h2>
            <div className="booking-list">
                {bookings.length === 0 ? (
                    <p>You have no bookings yet.</p>
                ) : (
                    bookings.map((booking) => (
                        <BookingCard key={booking._id} booking={booking} />
                    ))
                )}
            </div>
        </div>
    );
};

export default UserBookingsPage;
