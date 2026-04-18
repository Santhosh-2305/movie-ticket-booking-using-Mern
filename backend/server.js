require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");

const movieRoutes   = require("./routes/movies");
const bookingRoutes = require("./routes/bookings");
const adminRoutes   = require("./routes/admin");

const app = express();

app.use(cors());
app.use(express.json());

// Serve uploaded images
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Routes
app.use("/api/movies",   movieRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/admin",    adminRoutes);

// Test route
app.get("/", (req, res) => {
  res.send("API running");
});

console.log("🚀 Server starting...");

// 🔥 FIX: WAIT for DB before starting server
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB connected");

    const PORT = process.env.PORT || 5000;

    app.listen(PORT, "0.0.0.0", () => {
      console.log(`✅ Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ MongoDB connection failed:");
    console.error(err);
    process.exit(1); // force crash with visible error
  });
