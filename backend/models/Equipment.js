const mongoose = require('mongoose');

const equipmentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide equipment name'],
    trim: true,
  },
  category: {
    type: String,
    required: [true, 'Please provide category'],
    enum: ['Tractors', 'Harvesters', 'Planters', 'Sprayers', 'Other'],
  },
  description: {
    type: String,
    required: [true, 'Please provide description'],
    trim: true,
  },
  images: [{
    type: String,
  }],
  pricePerDay: {
    type: Number,
    required: [true, 'Please provide price per day'],
    min: [0, 'Price must be positive'],
  },
  location: {
    type: String,
    required: [true, 'Please provide location'],
    trim: true,
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  rating: {
    type: Number,
    default: 0,
    min: [0, 'Rating must be at least 0'],
    max: [5, 'Rating cannot exceed 5'],
  },
  reviews: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    rating: {
      type: Number,
      required: true,
      min: [0, 'Rating must be at least 0'],
      max: [5, 'Rating cannot exceed 5'],
    },
    comment: String,
    date: {
      type: Date,
      default: Date.now,
    },
  }],
  availability: {
    type: Boolean,
    default: true,
  },
  specifications: {
    type: Map,
    of: String,
    default: {},
  },
  isApproved: {
    type: Boolean,
    default: false,
  },
}, {
  timestamps: true,
});

// Update rating when new review is added
equipmentSchema.methods.calculateRating = function() {
  if (this.reviews.length === 0) {
    this.rating = 0;
  } else {
    const total = this.reviews.reduce((sum, review) => sum + review.rating, 0);
    this.rating = total / this.reviews.length;
  }
  return this.rating;
};

module.exports = mongoose.model('Equipment', equipmentSchema);
