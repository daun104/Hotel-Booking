// src/models/room.model.js
const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    price: { type: Number, required: true, min: 0 }, // simple price field (aligns with your controller)
    capacity: { type: Number, required: true, min: 1 },
    description: { type: String, default: '' },
    image: { type: String },
    size: String,
    bedType: String,
    features: [String],
    amenities: [{ type: String }],
    isAvailable: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Room', roomSchema);
