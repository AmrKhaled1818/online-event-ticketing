import React, { useEffect, useState } from 'react';
import './AdminEventsPage.css';
import axios from 'axios';

const AdminEventsPage = () => {
    const [events, setEvents] = useState([]);
    const [filter, setFilter] = useState('all');

    const fetchEvents = async () => {
        try {
            const res = await axios.get('/api/admin/events', { withCredentials: true });
            setEvents(res.data);
        } catch (err) {
            console.error('Failed to load events');
        }
    };

    useEffect(() => {
        fetchEvents();
    }, []);

    const handleStatusChange = async (id, status) => {
        try {
            await axios.put(`/api/admin/events/${id}/status`, { status }, { withCredentials: true });
            fetchEvents();
        } catch {
            alert('Failed to update status');
        }
    };

    const filtered = filter === 'all' ? events : events.filter(e => e.status === filter);

    return (
        <div className="admin-events-page">
            <h2>Manage Events</h2>
            <div className="filter-buttons">
                {['all', 'approved', 'pending', 'declined'].map(f => (
                    <button key={f} onClick={() => setFilter(f)}>{f.toUpperCase()}</button>
                ))}
            </div>

            <table>
                <thead>
                <tr>
                    <th>Title</th><th>Date</th><th>Status</th><th>Actions</th>
                </tr>
                </thead>
                <tbody>
                {filtered.map((event) => (
                    <tr key={event._id}>
                        <td>{event.title}</td>
                        <td>{new Date(event.date).toLocaleString()}</td>
                        <td>{event.status}</td>
                        <td>
                            {event.status === 'pending' && (
                                <>
                                    <button onClick={() => handleStatusChange(event._id, 'approved')}>Approve</button>
                                    <button onClick={() => handleStatusChange(event._id, 'declined')}>Decline</button>
                                </>
                            )}
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
};

export default AdminEventsPage;
