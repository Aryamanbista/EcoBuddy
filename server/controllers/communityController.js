const asyncHandler = require('express-async-handler');
const Community = require('../models/Community.js');

// @desc    Get all communities
// @route   GET /api/communities
// @access  Public
const getCommunities = asyncHandler(async (req, res) => {
  const communities = await Community.find({});
  res.json(communities);
});

module.exports = { getCommunities };