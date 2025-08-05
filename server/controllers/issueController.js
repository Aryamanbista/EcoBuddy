const asyncHandler = require('express-async-handler');
const Issue = require('../models/Issue.js');

// @desc    Report a new issue
// @route   POST /api/issues
// @access  Private
const reportIssue = asyncHandler(async (req, res) => {
  const { issueType, description } = req.body;

  const issue = await Issue.create({
    user: req.user._id,
    community: req.user.community,
    issueType,
    description,
  });
  
  res.status(201).json(issue);
});

// @desc    Get issues reported by a user
// @route   GET /api/issues
// @access  Private
const getUserIssues = asyncHandler(async (req, res) => {
  const issues = await Issue.find({ user: req.user._id }).sort({ createdAt: -1 });
  res.json(issues);
});

module.exports = { reportIssue, getUserIssues };