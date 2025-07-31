// controllers/reportController.js
const Pickup = require('../models/Pickup');
const Issue = require('../models/Issue');
const mongoose = require('mongoose');

// @desc    Generate reports for a user
// @route   GET /api/reports
// @access  Private
exports.getReports = async (req, res) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.user.id);

    // 1. Pickup Statistics by Type
    const pickupStats = await Pickup.aggregate([
      { $match: { user: userId } }, // Filter by the logged-in user
      {
        $group: {
          _id: '$wasteType', // Group by the wasteType field
          count: { $sum: 1 }, // Count the number of documents in each group
        },
      },
      {
        $project: { // Reshape the output
          _id: 0,
          type: '$_id',
          count: '$count'
        }
      }
    ]);

    // 2. Issues Reported by Type
    const issueStats = await Issue.aggregate([
      { $match: { user: userId } },
      {
        $group: {
          _id: '$issueType',
          count: { $sum: 1 },
        },
      },
       {
        $project: {
          _id: 0,
          type: '$_id',
          count: '$count'
        }
      }
    ]);

    // Format data for easy consumption by Chart.js on the frontend
    const formattedPickupData = {
        labels: pickupStats.map(stat => stat.type.charAt(0).toUpperCase() + stat.type.slice(1)),
        data: pickupStats.map(stat => stat.count)
    };

    const formattedIssueData = {
        labels: issueStats.map(stat => stat.type),
        data: issueStats.map(stat => stat.count)
    };

    res.json({
      pickupStats: formattedPickupData,
      issueStats: formattedIssueData,
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};