const express = require('express');
const router = express.Router();
const { schedulePickup, getPickupHistory } = require('../controllers/scheduleController');
const { protect } = require('../middleware/authMiddleware');

// The route for getting history is also on this endpoint
router.route('/')
  .post(protect, schedulePickup)
  .get(protect, getPickupHistory);

module.exports = router;