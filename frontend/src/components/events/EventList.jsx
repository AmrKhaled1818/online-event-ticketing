import React, { useEffect, useState } from 'react';
import './EventList.css';
import EventCard from './EventCard';
import { getAllEvents } from '../../api/events';

const EventList = () => {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await getAllEvents(); 
        console.log("Fetched events:", res);
        setEvents(res);
      } catch (err) {
        console.error("Error fetching events:", err);
      }
    };
  
    fetchEvents();
  }, []);
  

  return (
    <div className="event-list-wrapper">
      <h2>Available Events</h2>
      <div className="event-list">
        {events.map((event) => (
          <EventCard key={event._id} event={event} />
        ))}
      </div>
    </div>
  );
};

export default EventList;