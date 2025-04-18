import Event from '../models/Events.js';
import mongoose from "mongoose";

//post /api/v1/events
export const createEvent = async (req, res) => {
  try {
    const { title, description, date, location, category, image, ticketPrice, totalTickets } = req.body;

    const event = new Event({
      title,
      description,
      date,
      location,
      category,
      image,
      ticketPrice,
      totalTickets,
      remainingTickets: totalTickets,
      organizer: req.user._id // Using user authentication middleware
    });

    await event.save();
    res.status(201).json({ message: 'Event created successfully', event });
  } catch (error) {
    res.status(500).json({ message: 'Error creating event', error: error.message });
  }
};

// PUT /api/v1/events/:id
export const updateEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, date, location, category, image, ticketPrice, totalTickets } = req.body;

    // Check if the event exists
    const event = await Event.findById(id);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    // Update the event details
    event.title = title || event.title;
    event.description = description || event.description;
    event.date = date || event.date;
    event.location = location || event.location;
    event.category = category || event.category;
    event.image = image || event.image;
    event.ticketPrice = ticketPrice || event.ticketPrice;
    event.totalTickets = totalTickets || event.totalTickets;

    await event.save();
    res.status(200).json({ message: 'Event updated successfully', event });
  } catch (error) {
    res.status(500).json({ message: 'Error updating event', error: error.message });
  }
};

// DELETE /api/v1/events/:id
export const deleteEvent = async (req, res) => {
    try {
        const event = await Event.findById(req.params.id);
        if (!event) return res.status(404).json({ message: 'Event not found' });
        
        // Allow admin to delete any event, or organizer to delete their own events
        if (req.user.role !== 'admin' && !event.organizer.equals(req.user._id)) {
            return res.status(403).json({ message: "Unauthorized" });
        }
        
        await event.deleteOne();
        res.json({ message: 'Event deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting event', error: error.message });
    }
};

// GET /api/v1/events/:id
export const getAllEvents = async (req, res) => {
    try {
        const events = await Event.find({}).populate('organizer', 'name email');
        res.status(200).json(events);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching events', error: error.message });
    }
};

// GET /api/v1/events 
export const getEventById = async (req, res) => {
    try {
        const event = await Event.findById(req.params.id).populate('organizer', 'name email');
        if (!event) return res.status(404).json({ message: 'Event not found' });
        res.status(200).json(event);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching event', error: error.message });
    }
};

// GET /api/v1/events/users/events
export const getUserEvents = async (req, res) => {
    try {
        const events = await Event.find({ organizer: req.user._id }).populate('organizer', 'name email');
        res.status(200).json(events);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching user events', error: error.message });
    }
};

// GET /api/v1/users/events/analytics 
export const getEventAnalytics = async (req, res) => {
    try {
      const events = await Event.find({ organizer: req.user._id });
      const analytics = events.map((event) => ({
        eventId: event._id,
        title: event.title,
        totalBookings: event.totalTickets - event.remainingTickets,
        totalAttendees: event.totalTickets - event.remainingTickets
      }));
      res.json(analytics);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  };

// PATCH /api/v1/events/:id/status
export const updateEventStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        // Check for valid status value
        if (!['approved', 'declined'].includes(status)) {
            return res.status(400).json({ message: 'Invalid status value' });
        }

        const event = await Event.findById(id);
        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }

        event.status = status;
        await event.save();

        res.status(200).json({ message: `Event ${status} successfully`, event });
    } catch (error) {
        res.status(500).json({ message: 'Error updating event status', error: error.message });
    }
};
