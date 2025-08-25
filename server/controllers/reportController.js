const asyncHandler = require('express-async-handler');
const Pickup = require('../models/Pickup.js');
const { Parser } = require('json2csv');

// @desc    Generate report for a user
// @route   GET /api/reports
// @access  Private
const getUserReport = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  // Aggregate pickups by type
  const pickupStats = await Pickup.aggregate([
    { $match: { user: req.user._id, status: 'Completed' } },
    { $group: { _id: '$wasteType', count: { $sum: 1 } } },
  ]);

  // Aggregate pickups over time (last 6 months)
  const twelveMonthsAgo = new Date();
  twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 12);

  const monthlyPickups = await Pickup.aggregate([
    { $match: { user: userId, createdAt: { $gte: twelveMonthsAgo } } },
    {
      $group: {
        _id: { year: { $year: '$createdAt' }, month: { $month: '$createdAt' } },
        count: { $sum: 1 },
      },
    },
    { $sort: { '_id.year': 1, '_id.month': 1 } },
  ]);

  const twelveWeeksAgo = new Date();
  twelveWeeksAgo.setDate(twelveWeeksAgo.getDate() - (12 * 7));
  const weeklyPickups = await Pickup.aggregate([
    { $match: { user: userId, createdAt: { $gte: twelveWeeksAgo } } },
    {
      $group: {
        _id: { year: { $isoWeekYear: '$createdAt' }, week: { $isoWeek: '$createdAt' } },
        count: { $sum: 1 },
      },
    },
    { $sort: { '_id.year': 1, '_id.week': 1 } },
  ]);

  res.json({ pickupStats, monthlyPickups, weeklyPickups });
});

// @desc    Export user's pickup history as CSV
// @route   GET /api/reports/export
// @access  Private
const exportUserReport = asyncHandler(async (req, res) => {
    // 1. Fetch the raw data for the user
    const pickups = await Pickup.find({ user: req.user._id })
        .select('wasteType scheduledDate status createdAt -_id') // Select fields, exclude _id
        .lean(); // Use .lean() for faster performance on read-only queries

    // 2. Define the fields for the CSV header
    const fields = [
        { label: 'Waste Type', value: 'wasteType' },
        { label: 'Scheduled Date', value: 'scheduledDate' },
        { label: 'Status', value: 'status' },
        { label: 'Requested On', value: 'createdAt' }
    ];

    // 3. Create a new parser instance
    const json2csvParser = new Parser({ fields });
    const csv = json2csvParser.parse(pickups);

    // 4. Set headers to trigger a download in the browser
    res.header('Content-Type', 'text/csv');
    res.attachment('pickup-report.csv');
    res.send(csv);
});

module.exports = { getUserReport, exportUserReport  };