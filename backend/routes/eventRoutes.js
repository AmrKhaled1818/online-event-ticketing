import express from "express";
import {
  createEvent,
  updateEvent,
  deleteEvent,
  getAllEvents,
  getEventById,
  getEventAnalytics,
  updateEventStatus,
  getApprovedEvents,
} from "../controllers/eventController.js";
import { protect, restrictTo } from "../middleware/authMiddleware.js";

const router = express.Router();

// Public routes
router.get("/", getApprovedEvents); // /api/v1/events (GET) - Public
router.get("/all", getAllEvents); // /api/v1/events (GET) - Public

// Organizer routes
router.post("/", protect, restrictTo("organizer"), createEvent); // /api/v1/events (POST) - Event Organizer
router.get("/analytics", protect, restrictTo("organizer"), getEventAnalytics); // /api/v1/events/analytics (GET) - Event Organizer

// Public routes with parameters
router.get("/:id", getEventById); // /api/v1/events/:id (GET) - Public

// Organizer or Admin routes
router.put("/:id", protect, restrictTo("organizer", "admin"), updateEvent); // /api/v1/events/:id (PUT) - Event Organizer or Admin
router.delete("/:id", protect, restrictTo("organizer", "admin"), deleteEvent); // /api/v1/events/:id (DELETE) - Event Organizer or Admin
router.patch("/:id/status", protect, restrictTo("admin"), updateEventStatus); // /api/v1/events/:id/status


export default router;



