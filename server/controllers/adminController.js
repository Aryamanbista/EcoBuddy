const asyncHandler = require('express-async-handler');
const User = require('../models/User.js');
const Pickup = require('../models/Pickup.js');
const Issue = require('../models/Issue.js');
const Notification = require('../models/Notification.js');

// @desc    Get admin dashboard stats
// @route   GET /api/admin/stats
// @access  Private/Admin
const getDashboardStats = asyncHandler(async (req, res) => {
  const totalUsers = await User.countDocuments({});
  const totalPickups = await Pickup.countDocuments({});
  const openIssues = await Issue.countDocuments({ status: { $ne: 'Resolved' } });

  res.json({ totalUsers, totalPickups, openIssues });
});

// @desc    Get all issues for the admin
// @route   GET /api/admin/issues
// @access  Private/Admin
const getAllIssues = asyncHandler(async (req, res) => {
  const issues = await Issue.find({}).populate('user', 'fullName').sort({ createdAt: -1 });
  res.json(issues);
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

  if (usersInCommunity.length === 0) {
    res.status(404);
    throw new Error('No users found in this community');
  }

  // Prepare a notification document for each user
  const notificationsToCreate = usersInCommunity.map(user => ({
    user: user._id,
    title,
    message,
    type: 'announcement',
  }));

  // Insert all notifications into the database at once
  await Notification.insertMany(notificationsToCreate);

  res.status(201).json({ message: 'Announcement sent successfully to all community members.' });
});

module.exports = { getDashboardStats, getAllIssues, updateIssueStatus, createAnnouncement, };