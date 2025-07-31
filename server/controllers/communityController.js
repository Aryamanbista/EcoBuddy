// controllers/communityController.js
const Community = require('../models/Community');

// @desc    Get all communities
// @route   GET /api/communities
// @access  Public
exports.getCommunities = async (req, res) => {
  try {
    const communities = await Community.find().sort({ name: 1 });
    res.json(communities);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};