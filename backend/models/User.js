const mongoose = require("mongoose");

// Define User Schema
const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    profilePicture: { type: String, default: "" },
    role: {
        type: String,
        enum: ["Standard", "Organizer", "Admin"],
        default: "Standard"
    }
}, { timestamps: true }); // Adds createdAt & updatedAt fields

// Export the User model
module.exports = mongoose.model("User", userSchema);
