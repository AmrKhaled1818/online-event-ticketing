import express from "express";
import {
  createBooking,
  getBookings,
  getBookingById,
  cancelBooking,
} from "../controllers/bookingController.js";
import { protect, restrictTo } from "../middleware/authMiddleware.js";

const router = express.Router();

// Standard User routes
router.post("/bookings", protect, restrictTo("user"), createBooking); // /api/v1/bookings (POST) - Standard User
router.get("/users/bookings", protect, restrictTo("user"), getBookings); // /api/v1/users/bookings (GET) - Standard User
router.get("/bookings/:id", protect, restrictTo("user"), getBookingById); // /api/v1/bookings/:id (GET) - Standard User
router.delete("/bookings/:id", protect, restrictTo("user"), cancelBooking); // /api/v1/bookings/:id (DELETE) - Standard User

export default router;