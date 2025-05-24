import React, { useEffect, useState } from 'react';
import './EventAnalytics.css';
import api from '../../api/api';
import { 
  BarChart, Bar, 
  PieChart, Pie, Cell,
  XAxis, YAxis, Tooltip, 
  Legend, ResponsiveContainer 
} from 'recharts';

const EventAnalytics = () => {
  const [analytics, setAnalytics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [events, setEvents] = useState([]);
  
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Fetch user events
      const eventsRes = await api.get('/events/my');
      
      if (eventsRes.data) {
        const eventData = Array.isArray(eventsRes.data) ? eventsRes.data : 
                         (eventsRes.data.data ? eventsRes.data.data : []);
        
        // Calculate analytics from event data
        const analyticsData = eventData.map(event => {
          const totalTickets = event.totalTickets || 0;
          const remainingTickets = event.remainingTickets || 0;
          const bookedTickets = totalTickets - remainingTickets;
          const percentageBooked = totalTickets > 0 
            ? Math.round((bookedTickets / totalTickets) * 100) 
            : 0;
            
          return {
            eventId: event._id,
            title: event.title,
            totalTickets,
            remainingTickets,
            bookedTickets,
            percentageBooked,
            revenue: bookedTickets * event.ticketPrice,
            date: new Date(event.date).toLocaleDateString(),
            location: event.location,
            status: event.status,
            category: event.category
          };
        });
        
        setEvents(eventData);
        setAnalytics(analyticsData);
      }
    } catch (err) {
      console.error('Failed to load analytics:', err);
      setError('Failed to load analytics data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const renderBookingPercentage = () => {
    const data = analytics.map(event => ({
      name: event.title,
      value: event.percentageBooked
    }));

    return (
      <div className="chart-container">
        <h3>Ticket Booking Percentage</h3>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={true}
              outerRadius={100}
              fill="#8884d8"
              dataKey="value"
              nameKey="name"
              label={({ name, value }) => `${name}: ${value}%`}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip formatter={(value) => `${value}%`} />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    );
  };

  const renderTicketSalesBarChart = () => {
    return (
      <div className="chart-container">
        <h3>Ticket Sales</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={analytics}>
            <XAxis dataKey="title" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar name="Total Tickets" dataKey="totalTickets" fill="#8884d8" />
            <Bar name="Tickets Booked" dataKey="bookedTickets" fill="#82ca9d" />
            <Bar name="Remaining Tickets" dataKey="remainingTickets" fill="#ffc658" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    );
  };

  const renderRevenueBarChart = () => {
    return (
      <div className="chart-container">
        <h3>Revenue Generated</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={analytics}>
            <XAxis dataKey="title" />
            <YAxis />
            <Tooltip formatter={(value) => `${value} EGP`} />
            <Bar name="Revenue" dataKey="revenue" fill="#0088FE" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    );
  };

  const renderEventCards = () => {
    return (
      <div className="event-cards-container">
        <h3>Event Details</h3>
        <div className="event-cards">
          {analytics.map((event) => (
            <div key={event.eventId} className="event-card">
              <h4>{event.title}</h4>
              <div className="event-stats">
                <div className="stat">
                  <span className="stat-label">Date:</span>
                  <span>{event.date}</span>
                </div>
                <div className="stat">
                  <span className="stat-label">Location:</span>
                  <span>{event.location}</span>
                </div>
                <div className="stat">
                  <span className="stat-label">Category:</span>
                  <span>{event.category}</span>
                </div>
                <div className="stat">
                  <span className="stat-label">Status:</span>
                  <span className={`status-${event.status}`}>{event.status}</span>
                </div>
                <div className="stat">
                  <span className="stat-label">Total Tickets:</span>
                  <span>{event.totalTickets}</span>
                </div>
                <div className="stat">
                  <span className="stat-label">Tickets Sold:</span>
                  <span>{event.bookedTickets}</span>
                </div>
                <div className="stat">
                  <span className="stat-label">Remaining:</span>
                  <span>{event.remainingTickets}</span>
                </div>
                <div className="stat">
                  <span className="stat-label">Booking %:</span>
                  <span>{event.percentageBooked}%</span>
                </div>
                <div className="stat">
                  <span className="stat-label">Revenue:</span>
                  <span>{event.revenue} EGP</span>
                </div>
              </div>
              <div className="booking-progress">
                <div 
                  className="progress-bar" 
                  style={{ width: `${event.percentageBooked}%` }}
                >
                  {event.percentageBooked}%
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  if (loading) return <div className="analytics-wrapper loading">Loading analytics data...</div>;
  
  if (error) return <div className="analytics-wrapper error">{error}</div>;

  if (analytics.length === 0) {
    return (
      <div className="analytics-wrapper">
        <h2>Event Booking Analytics</h2>
        <div className="no-data">No event data available. Create events to see analytics.</div>
      </div>
    );
  }

  return (
    <div className="analytics-wrapper">
      <h2>Event Booking Analytics</h2>
      
      <div className="summary-stats">
        <div className="stat-card">
          <span className="stat-value">{events.length}</span>
          <span className="stat-label">Total Events</span>
        </div>
        <div className="stat-card">
          <span className="stat-value">
            {analytics.reduce((sum, event) => sum + event.totalTickets, 0)}
          </span>
          <span className="stat-label">Total Tickets</span>
        </div>
        <div className="stat-card">
          <span className="stat-value">
            {analytics.reduce((sum, event) => sum + event.bookedTickets, 0)}
          </span>
          <span className="stat-label">Tickets Booked</span>
        </div>
        <div className="stat-card">
          <span className="stat-value">
            {analytics.reduce((sum, event) => sum + event.revenue, 0)} EGP
          </span>
          <span className="stat-label">Total Revenue</span>
        </div>
      </div>

      <div className="charts-container">
        {renderBookingPercentage()}
        {renderTicketSalesBarChart()}
        {renderRevenueBarChart()}
      </div>
      
      {renderEventCards()}
    </div>
  );
};

export default EventAnalytics;
