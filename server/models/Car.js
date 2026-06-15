const mongoose = require('mongoose');

const variantSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true }, // in lakhs
  fuelType: String,
  transmission: String,
}, { _id: false });

const carSchema = new mongoose.Schema({
  make: { type: String, required: true, index: true },
  model: { type: String, required: true },
  year: { type: Number, required: true },
  bodyType: {
    type: String,
    required: true,
    enum: ['Hatchback', 'Sedan', 'SUV', 'MPV', 'Coupe', 'Convertible', 'Pickup'],
    index: true,
  },
  fuelType: {
    type: String,
    required: true,
    enum: ['Petrol', 'Diesel', 'Electric', 'CNG', 'Hybrid'],
    index: true,
  },
  transmission: {
    type: String,
    required: true,
    enum: ['Manual', 'Automatic', 'AMT', 'CVT', 'DCT', 'iMT'],
    index: true,
  },
  priceRange: {
    min: { type: Number, required: true }, // in lakhs
    max: { type: Number, required: true },
  },
  engine: {
    displacement: Number, // in cc
    power: Number,        // in bhp
    torque: Number,       // in Nm
  },
  mileage: {
    city: Number,    // km/l
    highway: Number, // km/l
  },
  safety: {
    rating: { type: Number, min: 0, max: 5 }, // NCAP stars
    airbags: Number,
    features: [String],
  },
  dimensions: {
    length: Number,       // mm
    width: Number,        // mm
    height: Number,       // mm
    wheelbase: Number,    // mm
    bootSpace: Number,    // litres
    groundClearance: Number, // mm
  },
  seatingCapacity: { type: Number, required: true },
  variants: [variantSchema],
  pros: [String],
  cons: [String],
  expertRating: { type: Number, min: 0, max: 10 },
  image: String,
  tags: [String], // "family", "budget", "performance", "city", "highway", "off-road"
}, {
  timestamps: true,
});

// Text index for search
carSchema.index({ make: 'text', model: 'text', tags: 'text' });

module.exports = mongoose.model('Car', carSchema);
