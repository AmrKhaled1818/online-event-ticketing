const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const cors = require("cors");
const jwt = require("jsonwebtoken");

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();
app.use(express.json());
app.use(cors());

// ✅ Middleware: Verify JWT Token
const verifyJWT = (req, res, next) => {
    const token = req.header("Authorization");

    if (!token) {
        return res.status(401).json({ message: "Access Denied. No Token Provided." });
    }

    try {
        const decoded = jwt.verify(token.replace("Bearer ", ""), process.env.JWT_SECRET);
        req.user = decoded; // Store user data in request
        next(); // Proceed to next middleware or route handler
    } catch (error) {
        res.status(403).json({ message: "Invalid Token" });
    }
};

// ✅ Public Route (No Authentication Needed)
app.get("/", (req, res) => {
    res.send("API is running...");
});

// ✅ Protected Route (Requires JWT)
app.get("/protected", verifyJWT, (req, res) => {
    res.json({ message: "You have accessed a protected route!", user: req.user });
});

// ✅ Generate JWT Token (For Testing)
app.post("/login", (req, res) => {
    const { userId } = req.body; // In real apps, validate credentials before issuing a token

    if (!userId) {
        return res.status(400).json({ message: "User ID is required" });
    }

    // Generate a JWT token (valid for 30 days)
    const token = jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: "30d" });

    res.json({ token });
});

// Start the Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
