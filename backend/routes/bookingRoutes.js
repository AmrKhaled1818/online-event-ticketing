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
router.post("/", protect, restrictTo("user"), createBooking); // /api/v1/bookings (POST) - Standard User
//router.get("/", protect, restrictTo("user"), getBookings); // /api/v1/bookings (GET) - Standard User
router.get("/:id", protect, restrictTo("user"), getBookingById); // /api/v1/bookings/:id (GET) - Standard User
router.delete("/:id", protect, restrictTo("user"), cancelBooking); // /api/v1/bookings/:id (DELETE) - Standard User


export default router;