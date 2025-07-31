const mongoose = require('mongoose');

const PickupSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  pickupDate: { type: Date, required: true },
  wasteType: {
    type: String,
    enum: ['general', 'recyclable', 'organic'],
    required: true,
  },
  status: {
    type: String,
    enum: ['Scheduled', 'Completed', 'Cancelled'],
    default: 'Scheduled',
  },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Pickup', PickupSchema);