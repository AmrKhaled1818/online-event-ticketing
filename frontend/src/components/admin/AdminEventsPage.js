import React, { useEffect, useState } from 'react';
import './AdminEventsPage.css';
import api from '../../api/api';

const AdminEventsPage = () => {
    const [events, setEvents] = useState([]);
    const [filter, setFilter] = useState('all');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const fetchEvents = async () => {
        try {
            setLoading(true);
            const res = await api.get('/events/all');
            setEvents(res.data);
            setError('');
        } catch (err) {
            console.error('Failed to load events:', err);
            setError('Failed to load events. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchEvents();
    }, []);

    const handleStatusChange = async (id, status) => {
        try {
            await api.patch(`/events/${id}/status`, { status });
            fetchEvents();
        } catch (err) {
            console.error('Failed to update status:', err);
            alert('Failed to update status');
        }
    };

    const filtered = filter === 'all' ? events : events.filter(e => e.status === filter);

    if (loading) return <div className="loading">Loading events...</div>;

    return (
        <div className="admin-events-page">
            <h2>Manage Events</h2>
            <div className="filter-buttons">
                {['all', 'approved', 'pending', 'declined'].map(f => (
                    <button 
                        key={f} 
                        onClick={() => setFilter(f)}
                        className={filter === f ? 'active' : ''}
                    >
                        {f.toUpperCase()}
                    </button>
                ))}
            </div>

            {error && <div className="error-message">{error}</div>}

            {filtered.length === 0 ? (
                <div className="no-events">No events found{filter !== 'all' ? ` with status "${filter}"` : ''}</div>
            ) : (
                <table>
                    <thead>
                    <tr>
                        <th>Title</th>
                        <th>Date</th>
                        <th>Location</th>
                        <th>Organizer</th>
                        <th>Tickets</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                    </thead>
                    <tbody>
                    {filtered.map((event) => (
                        <tr key={event._id}>
                            <td>{event.title}</td>
                            <td>{new Date(event.date).toLocaleDateString()}</td>
                            <td>{event.location}</td>
                            <td>{event.organizer?.name || 'Unknown'}</td>
                            <td>{event.remainingTickets}/{event.totalTickets}</td>
                            <td className={`status-${event.status}`}>{event.status}</td>
                            <td className="actions">
                                {event.status === 'pending' && (
                                    <>
                                        <button 
                                            className="approve-btn"
                                            onClick={() => handleStatusChange(event._id, 'approved')}
                                        >
                                            Approve
                                        </button>
                                        <button 
                                            className="decline-btn"
                                            onClick={() => handleStatusChange(event._id, 'declined')}
                                        >
                                            Decline
                                        </button>
                                    </>
                                )}
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default AdminEventsPage;
