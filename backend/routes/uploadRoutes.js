import express from 'express';
import { uploadProfileImage, uploadEventImage } from '../controllers/uploadController.js';
import { uploadSingleImage, handleUploadError, validateImage } from '../middleware/uploadMiddleware.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Profile image upload route
router.post(
  '/profile',
  protect,
  uploadSingleImage,
  handleUploadError,
  validateImage,
  uploadProfileImage
);

// Event image upload route
router.post(
  '/event/:eventId',
  protect,
  uploadSingleImage,
  handleUploadError,
  validateImage,
  uploadEventImage
);

export default router; 