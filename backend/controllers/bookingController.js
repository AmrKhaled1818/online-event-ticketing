// controllers/bookingController.js
import Booking from '../models/Booking.js';
import Event from '../models/Events.js';
import mongoose from "mongoose";

// Get current user bookings
export const getBookings = async (req, res) => {
  try {
    const userId = req.user._id;
    
    // Find all bookings for the current user and populate more event details
    const bookings = await Booking.find({ user: userId })
      .populate({
        path: 'event',
        select: 'title date location price description image category status'
      })
      .sort({ createdAt: -1 }); // Sort by most recent first

    if (!bookings || bookings.length === 0) {
      return res.status(200).json({
        success: true,
        count: 0,
        data: []
      });
    }

    res.status(200).json({
      success: true,
      count: bookings.length,
      data: bookings
    });
  } catch (error) {
    console.error('Error fetching bookings:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching bookings',
      error: error.message
    });
  }
};

// Get a specific booking by ID
export const getBookingById = async (req, res) => {
  try {
    const bookingId = req.params.id;
    const userId = req.user._id;

    // Check if booking exists and belongs to the user
    const booking = await Booking.findOne({ _id: bookingId, user: userId })
      .populate('event', 'title date location price description');

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    res.status(200).json(booking);
  } catch (error) {
    if (error instanceof mongoose.Error.CastError) {
      return res.status(400).json({ message: 'Invalid booking ID' });
    }
    res.status(500).json({ message: error.message });
  }
};

// Cancel booking
export const cancelBooking = async (req, res) => {
  try {
    const bookingId = req.params.id;
    const userId = req.user._id;

    const booking = await Booking.findOne({ _id: bookingId, user: userId });
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    const event = await Event.findById(booking.event);
    if (event) {
      event.remainingTickets += booking.ticketsBooked;
      await event.save();
    }

    await Booking.deleteOne({ _id: bookingId });
    res.status(200).json({ message: 'Booking cancelled successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create a new booking
export const createBooking = async (req, res) => {
  try {
    const { eventId, quantity } = req.body;
    const userId = req.user._id;

    // Validate quantity
    if (!quantity || quantity <= 0) {
      return res.status(400).json({ message: 'Quantity must be a positive number' });
    }

    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }
    
    if (event.remainingTickets < quantity) {
      return res.status(400).json({ message: 'Not enough tickets available' });
    }

    const totalPrice = quantity * event.ticketPrice;
    const booking = new Booking({
      user: userId,
      event: eventId,
      ticketsBooked: quantity,
      totalPrice,
    });

    await booking.save();
    event.remainingTickets -= quantity;
    await event.save();

    res.status(201).json(booking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
