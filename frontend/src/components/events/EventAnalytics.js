import React, { useEffect, useState } from 'react';
import './EventAnalytics.css';
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const EventAnalytics = () => {
  const [analytics, setAnalytics] = useState([]);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await axios.get('/api/events/my/analytics', { withCredentials: true });
        setAnalytics(res.data);
      } catch (err) {
        console.error('Failed to load analytics');
      }
    };
    fetchAnalytics();
  }, []);

  return (
    <div className="analytics-wrapper">
      <h2>Event Booking Analytics</h2>
      <ResponsiveContainer width="100%" height={400}>
        <BarChart data={analytics}>
          <XAxis dataKey="title" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="percentageBooked" fill="#1976d2" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default EventAnalytics;
