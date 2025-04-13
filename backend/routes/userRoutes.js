import express from "express";
import { registerUser, loginUser, getUserProfile, updateUserProfile, forgetPassword, resetPassword } from "../controllers/file1.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// User Management Routes (Part B)
router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/users/profile", protect, getUserProfile);
router.put("/users/profile", protect, updateUserProfile);
router.post("/forgetPassword", forgetPassword);
router.put("/resetPassword/:token", resetPassword);

export default router;