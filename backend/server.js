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

app.use("/api/movies",   movieRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/admin",    adminRoutes);

app.get("/", (_req, res) => res.send("CineBook API running ✅"));

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB connected");
    app.listen(process.env.PORT || 5000, () =>
      console.log(`🚀 Server running on port ${process.env.PORT || 5000}`)
    );
  })
  .catch((err) => console.error("❌ MongoDB error:", err));
