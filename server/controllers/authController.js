// controllers/authController.js
const User = require('../models/User');
const Community = require('../models/Community');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res) => {
  const { name, email, password, communityName, isNewCommunity } = req.body;

  try {
    // Basic validation
    if (!name || !email || !password || !communityName) {
      return res.status(400).json({ msg: 'Please enter all fields' });
    }

    // Check if user exists
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ msg: 'User already exists' });
    }

    let community;
    if (isNewCommunity) {
      // Check if new community name already exists
      let existingCommunity = await Community.findOne({ name: communityName });
      if (existingCommunity) {
        return res.status(400).json({ msg: 'Community name already exists' });
      }
      community = new Community({ name: communityName });
      await community.save();
    } else {
      community = await Community.findById(communityName); // Here communityName is the ID
      if (!community) {
        return res.status(400).json({ msg: 'Community not found' });
      }
    }

    // Create new user
    user = new User({
      name,
      email,
      password,
      community: community._id,
    });

    // Hash password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    await user.save();
    
    // Create token
    const token = generateToken(user._id);

    res.status(201).json({
      token,
      user: { id: user._id, name: user.name, email: user.email, community: community.name },
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check for user
    const user = await User.findOne({ email }).populate('community', 'name');
    if (!user) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }
    
    const token = generateToken(user._id);

    res.json({
      token,
      user: { id: user._id, name: user.name, email: user.email, community: user.community.name },
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// @desc    Get user data
// @route   GET /api/auth/me
// @access  Private
exports.getMe = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password').populate('community', 'name');
        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }
        res.json(user);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};