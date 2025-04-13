// Import required modules using ES Module syntax
import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import connectDB from "./config/db.js"; // Add .js extension for ESM
//import userRoutes from "./routes/UserRoutes.js"; // Add .js extension for ESM

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// Middleware
app.use(express.json()); // Parse JSON bodies
app.use(cors()); // Enable CORS (optional for development)

// Mount API routes
//app.use("/api/v1", userRoutes);

// Root route
app.get("/", (req, res) => {
  res.send("Online Event Ticketing System API");
});

// Global error-handling middleware (for part F: Error Handling)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Something went wrong!", error: err.message });
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));