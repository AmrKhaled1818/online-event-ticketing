import React, { useEffect, useState } from 'react';
import './UserBookingsPage.css';
import BookingCard from './BookingCard';
import axios from 'axios';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const UserBookingsPage = () => {
    const [bookings, setBookings] = useState([]);

    const fetchBookings = async () => {
        try {
            const res = await axios.get('/api/bookings/my', { withCredentials: true });
            setBookings(res.data);
        } catch (err) {
            console.error('Error fetching bookings:', err);
        }
    };

    useEffect(() => {
        fetchBookings();
    }, []);

    const handleBookingCancelled = (bookingId) => {
        setBookings(prevBookings => prevBookings.filter(booking => booking._id !== bookingId));
    };

    return (
        <div className="bookings-page">
            <ToastContainer />
            <h2>My Bookings</h2>
            <div className="booking-list">
                {bookings.length === 0 ? (
                    <p>You have no bookings yet.</p>
                ) : (
                    bookings.map((booking) => (
                        <BookingCard 
                            key={booking._id} 
                            booking={booking} 
                            onBookingCancelled={handleBookingCancelled}
                        />
                    ))
                )}
            </div>
        </div>
    );
};

export default UserBookingsPage;
