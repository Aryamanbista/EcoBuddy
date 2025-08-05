const express = require('express');
const { getUserProfile } = require('../controllers/userController.js');
const { protect } = require('../middleware/authMiddleware.js');
const router = express.Router();

router.get('/profile', protect, getUserProfile);

module.exports = router;