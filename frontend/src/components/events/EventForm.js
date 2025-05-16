import React, { useEffect, useState } from 'react';
import './EventForm.css';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

const EventForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        title: '',
        date: '',
        location: '',
        ticketCount: '',
        price: '',
    });

    useEffect(() => {
        if (id) {
            axios.get(`/api/events/${id}`, { withCredentials: true }).then((res) => {
                const { title, date, location, ticketCount, price } = res.data;
                setFormData({ title, date: date.slice(0, 16), location, ticketCount, price });
            });
        }
    }, [id]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (id) {
                await axios.put(`/api/events/${id}`, formData, { withCredentials: true });
            } else {
                await axios.post('/api/events', formData, { withCredentials: true });
            }
            navigate('/my-events');
        } catch (err) {
            alert('Failed to save event');
        }
    };

    return (
        <div className="event-form-wrapper">
            <form className="event-form" onSubmit={handleSubmit}>
                <h2>{id ? 'Edit Event' : 'Create Event'}</h2>
                <input name="title" placeholder="Title" value={formData.title} onChange={handleChange} required />
                <input type="datetime-local" name="date" value={formData.date} onChange={handleChange} required />
                <input name="location" placeholder="Location" value={formData.location} onChange={handleChange} required />
                <input name="ticketCount" type="number" placeholder="Total Tickets" value={formData.ticketCount} onChange={handleChange} required />
                <input name="price" type="number" placeholder="Ticket Price" value={formData.price} onChange={handleChange} required />
                <button type="submit">{id ? 'Update' : 'Create'}</button>
            </form>
        </div>
    );
};

export default EventForm;
