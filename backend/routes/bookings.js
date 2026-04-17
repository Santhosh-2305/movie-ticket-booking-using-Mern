const express = require("express");
const router = express.Router();
const Booking = require("../models/Booking");
const Movie = require("../models/Movie");

// POST create booking
router.post("/", async (req, res) => {
  try {
    const { movie: movieId, seats, ...rest } = req.body;

    const movie = await Movie.findById(movieId);
    if (!movie) return res.status(404).json({ message: "Movie not found" });
    if (movie.availableSeats < seats)
      return res.status(400).json({ message: "Not enough seats available" });

    const totalPrice = seats * movie.price;
    const booking = new Booking({ movie: movieId, seats, totalPrice, ...rest });
    const saved = await booking.save();

    // Deduct seats
    movie.availableSeats -= seats;
    await movie.save();

    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// GET bookings by email
router.get("/", async (req, res) => {
  try {
    const { email } = req.query;
    const filter = email ? { email } : {};
    const bookings = await Booking.find(filter).populate("movie", "title poster price");
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
