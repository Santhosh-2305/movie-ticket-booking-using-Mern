const express = require("express");
const router  = express.Router();
const Booking = require("../models/Booking");
const Movie   = require("../models/Movie");

// POST — create booking
router.post("/", async (req, res) => {
  try {
    const { movie: movieId, seats, seatNumbers = [], showDate, showTime, ...rest } = req.body;

    if (!showTime) return res.status(400).json({ message: "Show time is required." });
    if (!showDate) return res.status(400).json({ message: "Show date is required." });
    if (seats > 10) return res.status(400).json({ message: "Maximum 10 seats per booking." });

    const movie = await Movie.findById(movieId);
    if (!movie) return res.status(404).json({ message: "Movie not found." });
    if (movie.availableSeats < seats)
      return res.status(400).json({ message: "Not enough seats available." });

    // Check seat conflicts for same movie + date + time
    const existing = await Booking.find({
      movie: movieId, showDate, showTime, status: "booked"
    }).select("seatNumbers");
    const takenSeats = existing.flatMap(b => b.seatNumbers);
    const conflict = seatNumbers.filter(s => takenSeats.includes(s));
    if (conflict.length > 0)
      return res.status(400).json({ message: `Seats already taken: ${conflict.join(", ")}` });

    const totalPrice = seats * movie.price;
    const booking = new Booking({
      movie: movieId, seats, seatNumbers, showDate, showTime, totalPrice, ...rest
    });
    const saved = await booking.save();

    movie.availableSeats -= seats;
    await movie.save();

    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// GET — bookings by email
router.get("/", async (req, res) => {
  try {
    const { email } = req.query;
    const filter = email ? { email } : {};
    const bookings = await Booking.find(filter)
      .populate("movie", "title poster price showTimes showDates")
      .sort({ createdAt: -1 });
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET — taken seats for a specific show (for real-time seat grid)
router.get("/taken-seats", async (req, res) => {
  try {
    const { movieId, showDate, showTime } = req.query;
    if (!movieId || !showDate || !showTime)
      return res.status(400).json({ message: "movieId, showDate, showTime required." });

    const bookings = await Booking.find({
      movie: movieId, showDate, showTime, status: "booked"
    }).select("seatNumbers");
    const takenSeats = bookings.flatMap(b => b.seatNumbers);
    res.json({ takenSeats });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PATCH — cancel booking (50% refund)
router.patch("/:id/cancel", async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ message: "Booking not found." });
    if (booking.status === "cancelled")
      return res.status(400).json({ message: "Booking is already cancelled." });

    const refundAmount = parseFloat((booking.totalPrice * 0.5).toFixed(2));
    booking.status = "cancelled";
    booking.refundAmount = refundAmount;
    await booking.save();

    await Movie.findByIdAndUpdate(booking.movie, { $inc: { availableSeats: booking.seats } });
    res.json({ message: "Booking cancelled.", refundAmount, booking });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PATCH — edit booking (update seat count, keep same seat labels + add new ones)
router.patch("/:id/edit", async (req, res) => {
  try {
    const { seats: newSeats, seatNumbers: newSeatNumbers } = req.body;
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ message: "Booking not found." });
    if (booking.status === "cancelled")
      return res.status(400).json({ message: "Cannot edit a cancelled booking." });
    if (newSeats < 1 || newSeats > 10)
      return res.status(400).json({ message: "Seats must be between 1 and 10." });

    const movie = await Movie.findById(booking.movie);
    if (!movie) return res.status(404).json({ message: "Movie not found." });

    const diff = newSeats - booking.seats;
    if (diff > 0 && movie.availableSeats < diff)
      return res.status(400).json({ message: `Only ${movie.availableSeats} more seats available.` });

    // Check new seats aren't taken by others
    if (newSeatNumbers && newSeatNumbers.length > 0) {
      const others = await Booking.find({
        movie: booking.movie, showDate: booking.showDate,
        showTime: booking.showTime, status: "booked",
        _id: { $ne: booking._id }
      }).select("seatNumbers");
      const takenByOthers = others.flatMap(b => b.seatNumbers);
      const conflict = newSeatNumbers.filter(s => takenByOthers.includes(s));
      if (conflict.length > 0)
        return res.status(400).json({ message: `Seats already taken: ${conflict.join(", ")}` });
      booking.seatNumbers = newSeatNumbers;
    }

    movie.availableSeats -= diff;
    await movie.save();

    booking.seats = newSeats;
    booking.totalPrice = parseFloat((newSeats * movie.price).toFixed(2));
    await booking.save();

    res.json({ message: "Booking updated.", booking });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
