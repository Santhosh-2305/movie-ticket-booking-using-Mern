const mongoose = require("mongoose");

const movieSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  genre: { type: String, required: true },
  duration: { type: Number, required: true }, // in minutes
  releaseDate: { type: Date, required: true },
  poster: { type: String },
  price: { type: Number, required: true, default: 12 },
  availableSeats: { type: Number, required: true, default: 100 },
});

module.exports = mongoose.model("Movie", movieSchema);
