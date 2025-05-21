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
    const { title, description, date, location, category, image, ticketPrice, totalTickets , status} = req.body;

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
    event.status = status || event.status;

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

// GET /api/v1/events/:id
export const getEventById = async (req, res) => {
    try {
        const event = await Event.findById(req.params.id)
            .populate('organizer', 'name email');
            
        if (!event) {
            return res.status(404).json({ 
                success: false,
                message: 'Event not found' 
            });
        }

        res.status(200).json({
            success: true,
            data: event
        });
    } catch (error) {
        console.error('Error fetching event:', error);
        res.status(500).json({ 
            success: false,
            message: 'Error fetching event', 
            error: error.message 
        });
    }
};

// GET /api/v1/events/users/events
export const getUserEvents = async (req, res) => {
    try {
      console.log("👀 getUserEvents hit");
      console.log("🔐 req.user:", req.user);
  
      if (!req.user || !req.user._id) {
        console.log("❌ No user on request");
        return res.status(401).json({ message: "Unauthorized" });
      }
  
      const events = await Event.find({ organizer: req.user._id });
  
      console.log("✅ Fetched events:", events.length);
      res.status(200).json(events);
    } catch (error) {
      console.error("❌ getUserEvents crashed:", error.message);
      console.error(error.stack); // <- this line will give full details
      res.status(500).json({ message: "Server error", error: error.message });
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

        // Find and update the event in one operation
        const event = await Event.findByIdAndUpdate(
            id,
            { status: status },
            { new: true, runValidators: true }
        );

        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }

        res.status(200).json({ 
            message: `Event ${status} successfully`, 
            event: event 
        });
    } catch (error) {
        res.status(500).json({ message: 'Error updating event status', error: error.message });
    }
};

export const getApprovedEvents = async (req, res) => {
    try {
        const { category, date, priceRange, location } = req.query;
        let query = { status: 'approved' };

        // Add category filter
        if (category) {
            query.category = category;
        }

        // Add location filter
        if (location) {
            query.location = { $regex: location, $options: 'i' };
        }

        // Add date filter
        if (date) {
            const now = new Date();
            const tomorrow = new Date(now);
            tomorrow.setDate(tomorrow.getDate() + 1);
            const nextWeek = new Date(now);
            nextWeek.setDate(nextWeek.getDate() + 7);
            const nextMonth = new Date(now);
            nextMonth.setMonth(nextMonth.getMonth() + 1);

            switch (date) {
                case 'today':
                    query.date = {
                        $gte: new Date(now.setHours(0, 0, 0, 0)),
                        $lt: new Date(now.setHours(23, 59, 59, 999))
                    };
                    break;
                case 'tomorrow':
                    query.date = {
                        $gte: new Date(tomorrow.setHours(0, 0, 0, 0)),
                        $lt: new Date(tomorrow.setHours(23, 59, 59, 999))
                    };
                    break;
                case 'this-week':
                    query.date = {
                        $gte: now,
                        $lt: nextWeek
                    };
                    break;
                case 'this-month':
                    query.date = {
                        $gte: now,
                        $lt: nextMonth
                    };
                    break;
            }
        }

        // Add price range filter
        if (priceRange) {
            switch (priceRange) {
                case 'free':
                    query.ticketPrice = 0;
                    break;
                case 'under-50':
                    query.ticketPrice = { $lt: 50 };
                    break;
                case '50-100':
                    query.ticketPrice = { $gte: 50, $lte: 100 };
                    break;
                case 'over-100':
                    query.ticketPrice = { $gt: 100 };
                    break;
            }
        }

        const events = await Event.find(query)
            .populate('organizer', 'name email')
            .sort({ date: 1 });

        res.status(200).json({
            success: true,
            count: events.length,
            data: events
        });
    } catch (error) {
        res.status(500).json({ 
            success: false,
            message: 'Error fetching approved events', 
            error: error.message 
        });
    }
};

export const searchEvents = async (req, res) => {
  try {
    const { query } = req.query;
    
    if (!query) {
      return res.status(400).json({ 
        success: false,
        message: 'Search query is required' 
      });
    }

    const events = await Event.find({
      title: { $regex: query, $options: 'i' },
      status: 'approved'
    }).populate('organizer', 'name email')
      .sort({ date: 1 });

    res.status(200).json({
      success: true,
      count: events.length,
      data: events
    });
  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({
      success: false,
      message: 'Error searching events',
      error: error.message
    });
  }
};  
