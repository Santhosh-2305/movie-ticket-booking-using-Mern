const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
  {
    movie:        { type: mongoose.Schema.Types.ObjectId, ref: "Movie", required: true },
    name:         { type: String, required: true },
    email:        { type: String, required: true },
    seats:        { type: Number, required: true, min: 1, max: 10 },
    seatNumbers:  { type: [String], default: [] },   // e.g. ["A3","B7","C1"]
    showDate:     { type: String, required: true },   // "YYYY-MM-DD"
    showTime:     { type: String, required: true },   // "7:00 AM"
    totalPrice:   { type: Number, required: true },
    status:       { type: String, enum: ["booked", "cancelled"], default: "booked" },
    refundAmount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Booking", bookingSchema);
