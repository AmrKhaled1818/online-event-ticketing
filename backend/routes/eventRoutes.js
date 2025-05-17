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
  getUserEvents
} from "../controllers/eventController.js";
import { protect, restrictTo } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/my", protect, restrictTo("organizer", "admin"), getUserEvents); // ✔️ GET events created by logged-in organizer

// PUBLIC ROUTES
router.get("/", getApprovedEvents); // GET approved events (main page)
router.get("/all", getAllEvents); // GET all events (admin, not usually public)
router.get("/:id", getEventById); // GET specific event by ID (public)

// ORGANIZER ROUTES
router.post("/", protect, restrictTo("organizer", "admin"), createEvent);
router.put("/:id", protect, restrictTo("organizer", "admin"), updateEvent);
router.delete("/:id", protect, restrictTo("organizer", "admin"), deleteEvent);
router.get("/analytics", protect, restrictTo("organizer", "admin"), getEventAnalytics);


// ADMIN ONLY
router.patch("/:id/status", protect, restrictTo("admin"), updateEventStatus);

export default router;
