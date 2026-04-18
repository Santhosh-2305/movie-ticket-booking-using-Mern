const express   = require("express");
const router    = express.Router();
const path      = require("path");
const fs        = require("fs");
const Movie     = require("../models/Movie");
const Booking   = require("../models/Booking");
const adminAuth = require("../middleware/adminAuth");
const upload    = require("../middleware/upload");

// POST /api/admin/login
router.post("/login", (req, res) => {
  const { email, password } = req.body;
  if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
    const token = Buffer.from(`${email}:${password}`).toString("base64");
    return res.json({ token, name: "Santhosh" });
  }
  res.status(401).json({ message: "Invalid admin credentials." });
});

// ── IMAGE UPLOAD ───────────────────────────────────────────────────────
// POST /api/admin/upload  →  { url: "/uploads/filename.jpg" }
router.post("/upload", adminAuth, upload.single("poster"), (req, res) => {
  if (!req.file) return res.status(400).json({ message: "No file uploaded." });
  res.json({ url: `/uploads/${req.file.filename}` });
});

// ── MOVIES CRUD ────────────────────────────────────────────────────────

router.get("/movies", adminAuth, async (req, res) => {
  try {
    const movies = await Movie.find().sort({ createdAt: -1 });
    res.json(movies);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.post("/movies", adminAuth, async (req, res) => {
  try {
    // showTimes / showDates may arrive as JSON strings from FormData
    const data = { ...req.body };
    if (typeof data.showTimes === "string") data.showTimes = JSON.parse(data.showTimes);
    if (typeof data.showDates === "string") data.showDates = JSON.parse(data.showDates);
    const movie = new Movie(data);
    const saved = await movie.save();
    res.status(201).json(saved);
  } catch (err) { res.status(400).json({ message: err.message }); }
});

router.put("/movies/:id", adminAuth, async (req, res) => {
  try {
    const data = { ...req.body };
    if (typeof data.showTimes === "string") data.showTimes = JSON.parse(data.showTimes);
    if (typeof data.showDates === "string") data.showDates = JSON.parse(data.showDates);
    const updated = await Movie.findByIdAndUpdate(req.params.id, data, { new: true, runValidators: true });
    if (!updated) return res.status(404).json({ message: "Movie not found." });
    res.json(updated);
  } catch (err) { res.status(400).json({ message: err.message }); }
});

router.delete("/movies/:id", adminAuth, async (req, res) => {
  try {
    const deleted = await Movie.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Movie not found." });
    // Remove poster file if local
    if (deleted.poster && deleted.poster.startsWith("/uploads/")) {
      const filePath = path.join(__dirname, "..", deleted.poster);
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    }
    res.json({ message: "Movie deleted." });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// ── BOOKINGS ───────────────────────────────────────────────────────────

// GET all bookings (with optional ?today=true filter)
router.get("/bookings", adminAuth, async (req, res) => {
  try {
    let filter = {};
    if (req.query.today === "true") {
      const today = new Date().toISOString().split("T")[0]; // "YYYY-MM-DD"
      filter = { showDate: today };
    }
    const bookings = await Booking.find(filter)
      .populate("movie", "title poster price")
      .sort({ createdAt: -1 });
    res.json(bookings);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.delete("/bookings/:id", adminAuth, async (req, res) => {
  try {
    const deleted = await Booking.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Booking not found." });
    res.json({ message: "Booking deleted." });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

module.exports = router;
