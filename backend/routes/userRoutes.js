import express from "express";
import {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
  getAllUsers,
  getUserById,
  updateUserRole,
  deleteUser,
  forgotPassword,
  verifyOtp,
  resetPassword,
} from "../controllers/userController.js";
import { getBookings } from "../controllers/bookingController.js";
import { protect, restrictTo } from "../middleware/authMiddleware.js";
import { getUserEvents, getEventAnalytics } from "../controllers/eventController.js";

const router = express.Router();

router.get("/users/bookings", protect, restrictTo("user"), getBookings);
router.get("/users/events", protect, restrictTo("organizer"), getUserEvents);

// Public routes
router.post("/register", registerUser); // /api/v1/register (POST) - Public
router.post("/login", loginUser); // /api/v1/login (POST) - Public
router.put("/forgetPassword", forgotPassword); // /api/v1/forgetPassword (PUT) - Public

// Protected routes (require authentication)
router.get("/users/profile", protect, getUserProfile); // /api/v1/users/profile (GET) - Authenticated Users
router.put("/users/profile", protect, updateUserProfile); // /api/v1/users/profile (PUT) - Authenticated Users

// Admin routes (require authentication and admin role)
router.get("/users", protect, restrictTo("admin"), getAllUsers); // /api/v1/users (GET) - Admin
router.get("/users/:id", protect, restrictTo("admin"), getUserById); // /api/v1/users/:id (GET) - Admin
router.put("/users/:id", protect, restrictTo("admin"), updateUserRole); // /api/v1/users/:id (PUT) - Admin
router.delete("/users/:id", protect, restrictTo("admin"), deleteUser); // /api/v1/users/:id (DELETE) - Admin

// Reset Password routes (public, but typically used after forgetPassword)
router.post("/verifyOtp", verifyOtp); // Not in the table, but needed for bonus (MFA)
router.put("/resetPassword", resetPassword); // Not explicitly in the table, but implied for bonus

// User routes
router.get("/users/events/analytics", protect, restrictTo("organizer"), getEventAnalytics); // /api/v1/users/events/analytics (GET) - Event Organizer
export default router;
