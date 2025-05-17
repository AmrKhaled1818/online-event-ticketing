import React, { useEffect, useState } from 'react';
import './EventForm.css';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import api from '../../api/api'; // Adjust path if needed

const EventForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();

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
      axios.get(`/api/v1/events/${id}`, { withCredentials: true }).then((res) => {
        const {
          title,
          description,
          date,
          location,
          category,
          totalTickets,
          ticketPrice,
        } = res.data;
        setFormData({
          title,
          description,
          date: date.slice(0, 16), // format for datetime-local
          location,
          category,
          totalTickets,
          ticketPrice,
        });
      });
    }
  }, [id]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const payload = {
      ...formData,
      remainingTickets: formData.totalTickets
    };
  
    try {
      const res = id
        ? await api.put(`/events/${id}`, formData)
        : await api.post('/events', payload);
      
      console.log("✅ Event saved:", res.data);
      navigate('/my-events');
    } catch (err) {
      console.error("❌ Error saving event:", err.response?.data || err.message);
      alert(err.response?.data?.message || 'Failed to save event');
    }
  };

  return (
    <div className="event-form-wrapper">
      <form className="event-form" onSubmit={handleSubmit}>
        <h2>{id ? 'Edit Event' : 'Create Event'}</h2>
        <input name="title" placeholder="Title" value={formData.title} onChange={handleChange} required />
        <textarea name="description" placeholder="Description" value={formData.description} onChange={handleChange} required />
        <input type="datetime-local" name="date" value={formData.date} onChange={handleChange} required />
        <input name="location" placeholder="Location" value={formData.location} onChange={handleChange} required />
        
        <select name="category" value={formData.category} onChange={handleChange} required>
          <option value="">Select Category</option>
          <option value="Music">Music</option>
          <option value="Conference">Conference</option>
          <option value="Sports">Sports</option>
        </select>

        <input name="totalTickets" type="number" placeholder="Total Tickets" value={formData.totalTickets} onChange={handleChange} required />
        <input name="ticketPrice" type="number" placeholder="Ticket Price" value={formData.ticketPrice} onChange={handleChange} required />

        <button type="submit">{id ? 'Update' : 'Create'}</button>
      </form>
    </div>
  );
};

export default EventForm;