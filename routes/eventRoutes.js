import express from "express";
import {
  createEvent,
  updateEvent,
  deleteEvent,
  getAllEvents,
  getEventAnalytics
} from "../controllers/eventController.js";
import { protect, authorize } from "../middleware/authMiddleware.js";

const router = express.Router();

router.route("/")
  .get(getAllEvents)
  .post(protect, authorize("organizer"), createEvent);

router.route("/:id")
  .put(protect, authorize("organizer", "admin"), updateEvent)
  .delete(protect, authorize("organizer", "admin"), deleteEvent);

router.route("/my/events").get(protect, authorize("organizer"), getAllEvents);
router.route("/my/events/analytics").get(protect, authorize("organizer"), getEventAnalytics);

export default router;