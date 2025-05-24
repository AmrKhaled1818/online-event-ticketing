import React, { useEffect, useState } from 'react';
import './EventForm.css';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../api/api';

const EventForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(id ? true : false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    location: '',
    category: '',
    totalTickets: '',
    ticketPrice: '',
  });

  useEffect(() => {
    if (id) {
      setLoading(true);
      api.get(`/events/${id}`)
        .then((res) => {
          if (res.data && res.data.data) {
            const eventData = res.data.data;
            
            // Format the date for datetime-local input if it exists
            let formattedDate = '';
            if (eventData.date) {
              const dateObj = new Date(eventData.date);
              if (!isNaN(dateObj)) {
                formattedDate = dateObj.toISOString().slice(0, 16);
              }
            }
            
            setFormData({
              title: eventData.title || '',
              description: eventData.description || '',
              date: formattedDate,
              location: eventData.location || '',
              category: eventData.category || '',
              totalTickets: eventData.totalTickets || '',
              ticketPrice: eventData.ticketPrice || '',
            });
          }
        })
        .catch((err) => {
          console.error('Error fetching event:', err);
          setError('Failed to load event data. Please try again.');
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (id) {
        await api.put(`/events/${id}`, formData);
      } else {
        await api.post('/events', formData);
      }
      navigate('/my-events');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save event');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="event-form-container">
      <h2>{id ? 'Edit Event' : 'Create New Event'}</h2>
      {error && <p className="error-message">{error}</p>}
      <form onSubmit={handleSubmit} className="event-form">
        <div className="form-group">
          <label htmlFor="title">Event Title</label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="date">Date and Time</label>
          <input
            type="datetime-local"
            id="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="location">Location</label>
          <input
            type="text"
            id="location"
            name="location"
            value={formData.location}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="category">Category</label>
          <select
            id="category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            required
          >
            <option value="">Select a category</option>
            <option value="music">Music</option>
            <option value="sports">Sports</option>
            <option value="arts">Arts</option>
            <option value="food">Food</option>
            <option value="business">Business</option>
            <option value="other">Other</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="totalTickets">Total Tickets</label>
          <input
            type="number"
            id="totalTickets"
            name="totalTickets"
            value={formData.totalTickets}
            onChange={handleChange}
            min="1"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="ticketPrice">Ticket Price (EGP)</label>
          <input
            type="number"
            id="ticketPrice"
            name="ticketPrice"
            value={formData.ticketPrice}
            onChange={handleChange}
            min="0"
            step="0.01"
            required
          />
        </div>

        <button type="submit" disabled={loading}>
          {id ? 'Update Event' : 'Create Event'}
        </button>
      </form>
    </div>
  );
};

export default EventForm;