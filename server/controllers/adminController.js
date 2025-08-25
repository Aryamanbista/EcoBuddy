const mongoose = require('mongoose');
const asyncHandler = require('express-async-handler');
const User = require('../models/User.js');
const Pickup = require('../models/Pickup.js');
const Issue = require('../models/Issue.js');
const Notification = require('../models/Notification.js');

// @desc    Get admin dashboard stats
// @route   GET /api/admin/stats
// @access  Private/Admin
const getDashboardStats = asyncHandler(async (req, res) => {
  const communityId = req.user.community;

  const totalUsers = await User.countDocuments({ community: communityId });
  const totalPickups = await Pickup.countDocuments({ community: communityId });
  const openIssues = await Issue.countDocuments({ community: communityId, status: { $ne: 'Resolved' } });

  res.json({ totalUsers, totalPickups, openIssues });
});

// @desc    Get all issues for the admin
// @route   GET /api/admin/issues
// @access  Private/Admin
const getAllIssues = asyncHandler(async (req, res) => {
  const issues = await Issue.find({ community: req.user.community })
    .populate('user', 'fullName email')
    .sort({ createdAt: -1 });
  res.json(issues);
});

// @desc    Get all users for their community
// @route   GET /api/admin/users
const getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find({ community: req.user.community })
    .select('-password') // Exclude passwords
    .sort({ createdAt: -1 });
  res.json(users);
});

// @desc    Get all pickups for their community
// @route   GET /api/admin/pickups
const getAllPickups = asyncHandler(async (req, res) => {
  const pickups = await Pickup.find({ community: req.user.community })
    .populate('user', 'fullName')
    .sort({ scheduledDate: -1 });
  res.json(pickups);
});

// @desc    Get chart data for the admin dashboard
// @route   GET /api/admin/charts
const getChartData = asyncHandler(async (req, res) => {
  const communityId = req.user.community;

  // 1. Pickup volume over the last 30 days
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const pickupVolume = await Pickup.aggregate([
    { $match: { community: communityId, createdAt: { $gte: thirtyDaysAgo } } },
    {
      $group: {
        _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
        count: { $sum: 1 }
      }
    },
    { $sort: { _id: 1 } }
  ]);

  // 2. Pickup breakdown by type (all time)
  const pickupBreakdown = await Pickup.aggregate([
    { $match: { community: communityId } },
    {
      $group: {
        _id: '$wasteType',
        count: { $sum: 1 }
      }
    }
  ]);

  res.json({ pickupVolume, pickupBreakdown });
});


// @desc    Update an issue's status
// @route   PUT /api/admin/issues/:id
// @access  Private/Admin
const updateIssueStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  const issue = await Issue.findById(req.params.id);

  if (issue) {
    issue.status = status;
    const updatedIssue = await issue.save();
    res.json(updatedIssue);
  } else {
    res.status(404);
    throw new Error('Issue not found');
  }
});

// @desc    Create a community-wide announcement
// @route   POST /api/admin/announce
// @access  Private/Admin
const createAnnouncement = asyncHandler(async (req, res) => {
  const { title, message } = req.body;

  if (!title || !message) {
    res.status(400);
    throw new Error('Title and message are required');
  }

  // Find all users in the admin's community
  const usersInCommunity = await User.find({
    community: req.user.community,
  }).select('_id');

  const announcementId = new mongoose.Types.ObjectId(); // <-- Generate a single ID for this batch

  if (usersInCommunity.length === 0) {
    res.status(404);
    throw new Error('No users found in this community');
  }

  // Prepare a notification document for each user
  const notificationsToCreate = usersInCommunity.map(user => ({
    user: user._id,
    community: req.user.community, // <-- Add community
    title,
    message,
    type: 'announcement',
    announcementId, // <-- Assign the same ID to all
  }));

  // Insert all notifications into the database at once
  await Notification.insertMany(notificationsToCreate);

  res.status(201).json({ message: 'Announcement sent successfully to all community members.' });
});

// @desc    Get all unique announcements for the admin's community
// @route   GET /api/admin/announcements
const getAnnouncements = asyncHandler(async (req, res) => {
  // Use aggregation to find unique announcements
  const announcements = await Notification.aggregate([
    { $match: { community: req.user.community, type: 'announcement' } },
    { $sort: { createdAt: -1 } },
    {
      $group: {
        _id: '$announcementId', // Group by our unique ID
        title: { $first: '$title' },
        message: { $first: '$message' },
        createdAt: { $first: '$createdAt' }
      }
    },
    { $sort: { createdAt: -1 } }
  ]);
  res.json(announcements);
});

// @desc    Update a community-wide announcement
// @route   PUT /api/admin/announcements/:id
const updateAnnouncement = asyncHandler(async (req, res) => {
    const { title, message } = req.body;
    const { id: announcementIdString } = req.params;

    // --- THE FIX: VALIDATE AND CONVERT ---
    if (!mongoose.Types.ObjectId.isValid(announcementIdString)) {
        res.status(400);
        throw new Error('Invalid announcement ID format');
    }
    const announcementObjectId = new mongoose.Types.ObjectId(announcementIdString);
    // --- END FIX ---

    const result = await Notification.updateMany(
        { announcementId: announcementObjectId, community: req.user.community },
        { $set: { title, message } }
    );
    
    if (result.matchedCount === 0) {
        res.status(404);
        throw new Error('No announcements found to update.');
    }

    res.json({ message: 'Announcement updated successfully.' });
});

// @desc    Delete a community-wide announcement
// @route   DELETE /api/admin/announcements/:id
const deleteAnnouncement = asyncHandler(async (req, res) => {
    const { id: announcementIdString } = req.params;

    // --- APPLY THE SAME FIX HERE ---
    if (!mongoose.Types.ObjectId.isValid(announcementIdString)) {
        res.status(400);
        throw new Error('Invalid announcement ID format');
    }
    const announcementObjectId = new mongoose.Types.ObjectId(announcementIdString);
    // --- END FIX ---
    
    const result = await Notification.deleteMany({ 
        announcementId: announcementObjectId, 
        community: req.user.community 
    });

    if (result.deletedCount === 0) {
        res.status(404);
        throw new Error('No announcements found to delete.');
    }

    res.json({ message: 'Announcement deleted successfully.' });
});

module.exports = {
  getDashboardStats, getAllIssues, updateIssueStatus, createAnnouncement, getAllUsers, getAllPickups, getChartData, getAnnouncements,
  updateAnnouncement,
  deleteAnnouncement,
};