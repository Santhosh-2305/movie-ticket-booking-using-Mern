const mongoose = require("mongoose");

const movieSchema = new mongoose.Schema({
  title:          { type: String, required: true },
  description:    { type: String, required: true },
  genre:          { type: String, required: true },
  duration:       { type: Number, required: true },
  releaseDate:    { type: Date,   required: true },
  poster:         { type: String, default: "" },       // file path served via /uploads
  price:          { type: Number, required: true, default: 12 },
  rating:         { type: Number, default: 0, min: 0, max: 10 },
  availableSeats: { type: Number, required: true, default: 100 },
  showTimes:      { type: [String], default: [] },     // ["7:00 AM","3:00 PM","6:00 PM"]
  showDates:      { type: [String], default: [] },     // ["2025-04-20","2025-04-21"]
}, { timestamps: true });

module.exports = mongoose.model("Movie", movieSchema);
