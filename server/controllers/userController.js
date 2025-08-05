const asyncHandler = require('express-async-handler');
const User = require('../models/User.js');

// @desc    Get user profile
// @route   GET /api/user/profile
// @access  Private
const getUserProfile = asyncHandler(async (req, res) => {
  // req.user is already available from the 'protect' middleware
  if (req.user) {
    res.json({
      _id: req.user._id,
      fullName: req.user.fullName,
      email: req.user.email,
    });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

module.exports = { getUserProfile };