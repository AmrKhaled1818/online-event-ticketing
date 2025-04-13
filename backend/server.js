import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import connectDB from "./config/db.js";
//import userRoutes from "./routes/UserRoutes.js";
import eventRoutes from "./routes/eventRoutes.js";
import bookingRoutes from "./routes/bookingRoutes.js"; 

import connectDB from "./config/db.js";
import userRoutes from "./routes/userRoutes.js";
// import eventRoutes from "./routes/eventRoutes.js";
// import bookingRoutes from "./routes/bookingRoutes.js";

      dotenv.config();

connectDB();

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Mount API routes
//app.use("/api/v1", userRoutes);
app.use("/api/v1/events", eventRoutes);
app.use("/api/v1/bookings", bookingRoutes);
app.use("/api/v1", userRoutes);
// app.use("/api/v1", eventRoutes);
// app.use("/api/v1", bookingRoutes);

// Root route for testing
app.get("/", (req, res) => {
  res.send("Online Event Ticketing System API");
});

// Global error-handling middleware (Part F)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Something went wrong!", error: err.message });
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));