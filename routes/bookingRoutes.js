import express from "express";
import {
  createBooking,
  getBookings,
  cancelBooking
} from "../controllers/bookingController.js";
import { protect, authorize } from "../middleware/authMiddleware.js";

const router = express.Router();

router.route("/").post(protect, authorize("user"), createBooking);
router.route("/").get(protect, authorize("user"), getBookings);
router.route("/:id").delete(protect, authorize("user"), cancelBooking);

export default router;
