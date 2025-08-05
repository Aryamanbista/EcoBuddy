const asyncHandler = require('express-async-handler');
const Pickup = require('../models/Pickup.js');

// @desc    Schedule a new waste pickup
// @route   POST /api/pickups
// @access  Private
const schedulePickup = asyncHandler(async (req, res) => {
  const { wasteType, scheduledDate } = req.body;

  if (!wasteType || !scheduledDate) {
    res.status(400);
    throw new Error('Please provide all required fields');
  }

  const pickup = new Pickup({
    user: req.user._id,
    community: req.user.community,
    wasteType,
    scheduledDate,
  });

  const createdPickup = await pickup.save();
  res.status(201).json(createdPickup);
});

// @desc    Get pickup history for a user
// @route   GET /api/pickups
// @access  Private
const getUserPickups = asyncHandler(async (req, res) => {
  const pickups = await Pickup.find({ user: req.user._id }).sort({ createdAt: -1 });
  res.json(pickups);
});

module.exports = { schedulePickup, getUserPickups };