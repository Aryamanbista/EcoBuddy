const mongoose = require('mongoose');

const pickupSchema = mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
    community: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Community' },
    wasteType: { type: String, required: true, enum: ['recyclable', 'organic', 'general'] },
    scheduledDate: { type: Date, required: true },
    status: { type: String, required: true, enum: ['Scheduled', 'Completed', 'Cancelled'], default: 'Scheduled' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Pickup', pickupSchema);