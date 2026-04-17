const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
  {
    movie: { type: mongoose.Schema.Types.ObjectId, ref: "Movie", required: true },
    name: { type: String, required: true },
    email: { type: String, required: true },
    seats: { type: Number, required: true, min: 1, max: 10 },
    totalPrice: { type: Number, required: true },
    showDate: { type: Date, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Booking", bookingSchema);
