import User from '../models/User.js';
import Event from '../models/Events.js';
import path from 'path';
import fs from 'fs';

// Upload profile image
export const uploadProfileImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No image file provided'
      });
    }

    const user = await User.findById(req.user._id);
    if (!user) {
      // Delete uploaded file if user not found
      fs.unlinkSync(req.file.path);
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Delete old profile picture if exists
    if (user.profilePicture) {
      const oldImagePath = path.join(process.cwd(), user.profilePicture);
      if (fs.existsSync(oldImagePath)) {
        fs.unlinkSync(oldImagePath);
      }
    }

    // Store relative path
    const relativePath = path.join('uploads', path.basename(req.file.path));
    user.profilePicture = relativePath;
    await user.save();

    res.status(200).json({
      success: true,
      data: {
        profilePicture: `/${relativePath}`
      }
    });
  } catch (error) {
    // Delete uploaded file if there's an error
    if (req.file) {
      fs.unlinkSync(req.file.path);
    }
    res.status(500).json({
      success: false,
      message: 'Error uploading profile image',
      error: error.message
    });
  }
};

// Upload event image
export const uploadEventImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No image file provided'
      });
    }

    const eventId = req.params.eventId;
    
    // For new events (when eventId is 'new')
    if (eventId === 'new') {
      const relativePath = path.join('uploads', path.basename(req.file.path));
      return res.status(200).json({
        success: true,
        data: {
          image: `/${relativePath}`
        }
      });
    }

    // For existing events
    const event = await Event.findById(eventId);
    if (!event) {
      // Delete uploaded file if event not found
      fs.unlinkSync(req.file.path);
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    // Delete old event image if exists
    if (event.image) {
      const oldImagePath = path.join(process.cwd(), event.image);
      if (fs.existsSync(oldImagePath)) {
        fs.unlinkSync(oldImagePath);
      }
    }

    // Store relative path
    const relativePath = path.join('uploads', path.basename(req.file.path));
    event.image = relativePath;
    await event.save();

    res.status(200).json({
      success: true,
      data: {
        image: `/${relativePath}`
      }
    });
  } catch (error) {
    // Delete uploaded file if there's an error
    if (req.file) {
      fs.unlinkSync(req.file.path);
    }
    res.status(500).json({
      success: false,
      message: 'Error uploading event image',
      error: error.message
    });
  }
}; 