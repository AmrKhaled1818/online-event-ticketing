import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  profilePicture: { type: String, default: "" },
  role: {
    type: String,
    enum: ["user", "organizer", "admin"], // Use lowercase to match middleware
    default: "user",
  },
  resetPasswordOtp: { type: String }, // For OTP-based password reset (Bonus)
  resetPasswordOtpExpire: { type: Date }, // OTP expiration
  resetPasswordToken: { type: String }, // For token-based password reset
  resetPasswordExpire: { type: Date }, // Token expiration
}, { timestamps: true }); // Adds createdAt & updatedAt fields

// Hash password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare password
userSchema.methods.matchPassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Generate JWT token
userSchema.methods.generateToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, { expiresIn: "30d" });
};

// Export the User model
export default mongoose.model("User", userSchema);






