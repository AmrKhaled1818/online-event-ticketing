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
} from "../controllers/userController.js";
import { protect, restrictTo } from "../middleware/authMiddleware.js";

const router = express.Router();

// Public routes
router.post("/register", registerUser);
router.post("/login", loginUser);

// Protected routes (require authentication)
router.use(protect); // Apply protect middleware to all routes below

// User profile routes
router.get("/profile", getUserProfile);
router.put("/profile", updateUserProfile);

// Admin routes (require admin role)
router.use(restrictTo("Admin")); // Apply admin restriction to all routes below
router.get("/", getAllUsers);
router.get("/:id", getUserById);
router.put("/:id/role", updateUserRole);
router.delete("/:id", deleteUser);

export default router;