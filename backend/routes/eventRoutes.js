import express from "express";
import {
  createEvent,
  updateEvent,
  deleteEvent,
  getAllEvents,
  getEventAnalytics
} from "../controllers/eventController.js";
import { protect, restrictTo } from "../middleware/authMiddleware.js"; // Changed authorize to restrictTo

const router = express.Router();

router.route("/")
  .get(getAllEvents)
  .post(protect, restrictTo("organizer"), createEvent); // Changed authorize to restrictTo

router.route("/:id")
  .put(protect, restrictTo("organizer", "admin"), updateEvent) // Changed authorize to restrictTo
  .delete(protect, restrictTo("organizer", "admin"), deleteEvent); // Changed authorize to restrictTo

router.route("/my/events").get(protect, restrictTo("organizer"), getAllEvents); // Changed authorize to restrictTo
router.route("/my/events/analytics").get(protect, restrictTo("organizer"), getEventAnalytics); // Changed authorize to restrictTo

export default router;