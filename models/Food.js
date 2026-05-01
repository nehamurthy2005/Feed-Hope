const mongoose = require('mongoose');

const foodSchema = new mongoose.Schema(
  {
    donor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    title: {
      type: String,
      required: [true, 'Food title is required'],
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    category: {
      type: String,
      enum: ['cooked', 'raw', 'packaged', 'beverages', 'other'],
      default: 'other',
    },
    quantity: {
      type: String,
      required: [true, 'Quantity is required'],
    },
    expiryDate: {
      type: Date,
      required: [true, 'Expiry date is required'],
    },
    image: {
      type: String,
      default: '',
    },
    address: {
      type: String,
      required: [true, 'Pickup address is required'],
    },
    location: {
      lat: { type: Number, required: true },
      lng: { type: Number, required: true },
    },
    status: {
      type: String,
      enum: ['available', 'claimed', 'completed', 'expired'],
      default: 'available',
    },
    claimedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    claimedAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Food', foodSchema);
