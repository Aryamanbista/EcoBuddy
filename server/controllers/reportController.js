const asyncHandler = require('express-async-handler');
const Pickup = require('../models/Pickup.js');

// @desc    Generate report for a user
// @route   GET /api/reports
// @access  Private
const getUserReport = asyncHandler(async (req, res) => {
  // Aggregate pickups by type
  const pickupStats = await Pickup.aggregate([
    { $match: { user: req.user._id, status: 'Completed' } },
    { $group: { _id: '$wasteType', count: { $sum: 1 } } },
  ]);

  // Aggregate pickups over time (last 6 months)
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

  const pickupsOverTime = await Pickup.aggregate([
    { $match: { user: req.user._id, createdAt: { $gte: sixMonthsAgo } } },
    {
      $group: {
        _id: { year: { $year: '$createdAt' }, month: { $month: '$createdAt' } },
        count: { $sum: 1 },
      },
    },
    { $sort: { '_id.year': 1, '_id.month': 1 } },
  ]);

  res.json({
    pickupStats,
    pickupsOverTime,
  });
});

module.exports = { getUserReport };