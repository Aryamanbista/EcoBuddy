const express = require('express');
const { schedulePickup, getUserPickups } = require('../controllers/pickupController.js');
const { protect } = require('../middleware/authMiddleware.js');
const router = express.Router();

router.route('/').post(protect, schedulePickup).get(protect, getUserPickups);

module.exports = router;