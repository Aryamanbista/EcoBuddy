const asyncHandler = require('express-async-handler');
const User = require('../models/User.js');

// @desc    Get user profile
// @route   GET /api/user/profile
// @access  Private
const getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).select('-password');
  // req.user is already available from the 'protect' middleware
  if (user) {
    res.json({
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      notificationPreferences: user.notificationPreferences,
    });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

// @desc    Update user profile
// @route   PUT /api/user/profile
// @access  Private
const updateUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    user.fullName = req.body.fullName || user.fullName;
    
    // Gracefully handle nested preferences object
    if (req.body.notificationPreferences) {
      user.notificationPreferences = {
        ...user.notificationPreferences,
        ...req.body.notificationPreferences,
      };
    }

    const updatedUser = await user.save();

    // Respond with the updated user data (including the role for the frontend)
    res.json({
      _id: updatedUser._id,
      fullName: updatedUser.fullName,
      email: updatedUser.email,
      role: updatedUser.role,
      community: req.user.community, // Community name isn't on the user model, get from req.user
      notificationPreferences: updatedUser.notificationPreferences,
      token: generateToken(updatedUser._id), // Issue a new token with updated info
    });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

module.exports = { getUserProfile, updateUserProfile };