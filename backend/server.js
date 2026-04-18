require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");

const movieRoutes   = require("./routes/movies");
const bookingRoutes = require("./routes/bookings");
const adminRoutes   = require("./routes/admin");

const app = express();

// middleware
app.use(cors());
app.use(express.json());

// Serve uploaded images
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// API routes
app.use("/api/movies",   movieRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/admin",    adminRoutes);

// 🔥 TEST ROUTE (VERY IMPORTANT)
app.get("/", (req, res) => {
  res.send("API running ✅");
});

console.log("🚀 Starting server...");

// 🔥 CONNECT DB THEN START SERVER
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
    console.error("❌ MongoDB error:", err);
    process.exit(1);
  });
