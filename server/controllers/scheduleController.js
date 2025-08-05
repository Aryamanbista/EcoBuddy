import asyncHandler from 'express-async-handler';
import Pickup from '../models/Pickup.js';

// @desc    Create a new pickup schedule
// @route   POST /api/pickups
// @access  Private
const schedulePickup = asyncHandler(async (req, res) => {
  const { wasteType, pickupDate, pickupTime } = req.body;

  if (!wasteType || !pickupDate || !pickupTime) {
    res.status(400);
    throw new Error('Please provide all required fields for pickup.');
  }

  const pickup = new Pickup({
    user: req.user._id, // From authMiddleware
    community: req.user.community, // From authMiddleware
    wasteType,
    pickupDate,
    pickupTime,
  });

  const createdPickup = await pickup.save();
  res.status(201).json(createdPickup);
});

export { schedulePickup };