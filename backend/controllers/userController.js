import User from "../models/User.js";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import sendEmail from "../utils/sendEmail.js";
import bcrypt from "bcryptjs";

// Generate Token Cookie Helper
const sendTokenResponse = (user, res) => {
  const token = user.generateToken();

  // Set cookie
  res.cookie('token', token, {
    httpOnly: true,
    secure: true,
    sameSite: 'None', // Allow cross-origin requests
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    domain: '.railway.app' // Allow sharing across subdomains
  });

  // Send response with token
  res.status(200).json({
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    token: token // Include token in response
  });
};

// Generate OTP
const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

// Store OTP in memory (in production, use Redis or similar)
const otpStore = new Map();

// Register user
const registerUser = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Generate OTP
        const otp = generateOTP();
        otpStore.set(email, {
            otp,
            timestamp: Date.now(),
            userData: { name, email, password, role }
        });

        // Send OTP via email
        const message = `Your registration OTP: ${otp} (valid for 5 minutes)`;
        await sendEmail({
            email: email,
            subject: "Registration OTP",
            message,
        });

        res.status(200).json({
            message: 'OTP sent successfully'
        });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ message: 'Registration failed' });
    }
};

// Verify registration OTP
const verifyRegistrationOTP = async (req, res) => {
    try {
        const { email, otp } = req.body;

        const storedData = otpStore.get(email);
        if (!storedData) {
            return res.status(400).json({ message: 'Invalid or expired OTP' });
        }

        // Check if OTP is expired (5 minutes)
        if (Date.now() - storedData.timestamp > 5 * 60 * 1000) {
            otpStore.delete(email);
            return res.status(400).json({ message: 'OTP expired' });
        }

        // Verify OTP
        if (storedData.otp !== otp) {
            return res.status(400).json({ message: 'Invalid OTP' });
        }

        // Create user
        const { name, password, role } = storedData.userData;
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            role
        });

        // Clear OTP data
        otpStore.delete(email);

        // Generate token
        const token = jwt.sign(
            { userId: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.status(201).json({
            message: 'Registration successful',
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });
    } catch (error) {
        console.error('OTP verification error:', error);
        res.status(500).json({ message: 'OTP verification failed' });
    }
};

// Resend registration OTP
const resendRegistrationOTP = async (req, res) => {
    try {
        const { email } = req.body;

        const storedData = otpStore.get(email);
        if (!storedData) {
            return res.status(400).json({ message: 'No registration in progress' });
        }

        // Generate new OTP
        const newOtp = generateOTP();
        otpStore.set(email, {
            ...storedData,
            otp: newOtp,
            timestamp: Date.now()
        });

        // Send new OTP via email (implement your email service here)
        // For now, we'll just return the OTP in the response
        res.status(200).json({
            message: 'New OTP sent successfully',
            otp: newOtp // Remove this in production
        });
    } catch (error) {
        console.error('Resend OTP error:', error);
        res.status(500).json({ message: 'Failed to resend OTP' });
    }
};

// Login user
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    sendTokenResponse(user, res);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Logout user (clears cookie)
const logoutUser = async (req, res) => {
  try {
    // Clear the token cookie
    res.clearCookie('token', {
      httpOnly: true,
      secure: true,
      sameSite: 'None',
      domain: '.railway.app'
    });

    res.status(200).json({
      success: true,
      message: 'Logged out successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error logging out'
    });
  }
};

// Get current user's profile
const getUserProfile = async (req, res) => {
  try {
    res.json({
      success: true,
      data: {
      _id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      role: req.user.role,
        profilePicture: req.user.profilePicture || ''
      }
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: "Server error", 
      error: error.message 
    });
  }
};

// Update current user's profile
const updateUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ 
        success: false,
        message: "User not found" 
      });
    }

    // Update basic info
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    user.profilePicture = req.body.profilePicture || user.profilePicture;

    // Update password if provided
    if (req.body.newPassword) {
      // Verify current password
      const isMatch = await user.matchPassword(req.body.currentPassword);
      if (!isMatch) {
        return res.status(401).json({ 
          success: false,
          message: "Current password is incorrect" 
        });
      }
      user.password = req.body.newPassword;
    }

    const updatedUser = await user.save();

    res.json({
      success: true,
      data: {
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      role: updatedUser.role,
        profilePicture: updatedUser.profilePicture || ''
      }
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: "Server error", 
      error: error.message 
    });
  }
};

// Get all users (admin only)
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    const formattedUsers = users.map(user => ({
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    }));
    res.json({
      success: true,
      count: formattedUsers.length,
      data: formattedUsers
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: "Server error", 
      error: error.message 
    });
  }
};

// Get user by ID (admin only)
const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Update user role (admin only)
const updateUserRole = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    const { role } = req.body;
    if (!["user", "organizer", "admin"].includes(role)) {
      return res.status(400).json({ message: "Invalid role" });
    }

    user.role = role;
    await user.save();

    res.json({ message: "User role updated", role: user.role });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Delete user (admin only)
const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    await user.deleteOne();
    res.json({ message: "User deleted" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Forgot password (send OTP)
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: "Email is required" });

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    const otp = crypto.randomInt(100000, 999999).toString();
    user.resetPasswordOtp = otp;
    user.resetPasswordOtpExpire = Date.now() + 10 * 60 * 1000;
    await user.save();

    const message = `Your OTP: ${otp} (valid for 10 minutes)`;
    await sendEmail({
      email: user.email,
      subject: "Password Reset OTP",
      message,
    });

    res.json({ message: "OTP sent to email" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Verify OTP
const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;
    const user = await User.findOne({
      email,
      resetPasswordOtp: otp,
      resetPasswordOtpExpire: { $gt: Date.now() },
    });

    if (!user) return res.status(400).json({ message: "Invalid or expired OTP" });

    const resetToken = crypto.randomBytes(20).toString("hex");
    user.resetPasswordToken = crypto.createHash("sha256").update(resetToken).digest("hex");
    user.resetPasswordExpire = Date.now() + 10 * 60 * 1000;
    user.resetPasswordOtp = undefined;
    user.resetPasswordOtpExpire = undefined;
    await user.save();

    res.json({ message: "OTP verified", resetToken });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Reset password
const resetPassword = async (req, res) => {
  try {
    const { resetToken, password } = req.body;
    const hashedToken = crypto.createHash("sha256").update(resetToken).digest("hex");

    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) return res.status(400).json({ message: "Invalid or expired reset token" });

    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    res.json({ message: "Password reset successful" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Contact form submission
const submitContactForm = async (req, res) => {
  try {
    const { name, company, email, phone, interests, budget, message } = req.body;

    // Validate required fields
    if (!name || !email || !message) {
      return res.status(400).json({
        success: false,
        message: 'Name, email, and message are required'
      });
    }

    // Log the request data for debugging
    console.log('Contact form submission:', {
      name,
      company,
      email,
      phone,
      interests,
      budget,
      message
    });

    // Build a clean HTML email
    const htmlMessage = `
      <h2>New Event Inquiry</h2>
      <p><strong>Name:</strong> ${name}<br>
      <strong>Company:</strong> ${company || 'N/A'}<br>
      <strong>Email:</strong> ${email}<br>
      <strong>Phone:</strong> ${phone || 'N/A'}<br>
      <strong>Interests:</strong> ${(interests && interests.length) ? interests.join(', ') : 'N/A'}<br>
      <strong>Budget:</strong> ${budget || 'N/A'}</p>
      <p><strong>Message:</strong><br>${message}</p>
    `;

    // Send email to admin
    await sendEmail({
      email: 'amr.k.saad@outlook.com',
      subject: 'New Contact Form Submission',
      message: htmlMessage,
    });

    res.json({ success: true, message: 'Message sent successfully' });
  } catch (error) {
    console.error('Contact form error:', error);
    
    // Check if it's an email configuration error
    if (error.message.includes('Failed to send email')) {
      return res.status(500).json({
        success: false,
        message: 'Email service configuration error. Please contact the administrator.',
        error: error.message
      });
    }

    res.status(500).json({
      success: false,
      message: 'Failed to send message',
      error: error.message
    });
  }
};

// Export all functions
export {
  registerUser,
  loginUser,
  logoutUser,
  getUserProfile,
  updateUserProfile,
  getAllUsers,
  getUserById,
  updateUserRole,
  deleteUser,
  forgotPassword,
  verifyOtp,
  resetPassword,
  submitContactForm,
  verifyRegistrationOTP,
  resendRegistrationOTP
};
