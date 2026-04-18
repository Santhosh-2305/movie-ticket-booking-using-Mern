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

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use("/api/movies",   movieRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/admin",    adminRoutes);

app.get("/", (req, res) => {
  res.send("API running ✅");
});

console.log("🚀 Starting server...");

// Start server FIRST so Render detects the port
const PORT = process.env.PORT || 5000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`✅ Server running on port ${PORT}`);
});

// Then connect DB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB error:", err.message));
