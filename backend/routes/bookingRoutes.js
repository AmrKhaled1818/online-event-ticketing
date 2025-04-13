import express from "express";
import {
  createBooking,
  getBookings,
  cancelBooking
} from "../controllers/bookingController.js";
import { protect, restrictTo } from "../middleware/authMiddleware.js";

const router = express.Router();

router.route("/").post(protect, restrictTo("user"), createBooking);
router.route("/").get(protect, restrictTo("user"), getBookings);
router.route("/:id").delete(protect, restrictTo("user"), cancelBooking);

export default router;
