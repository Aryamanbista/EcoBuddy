const express = require('express');
const { getUserNotifications, markAllAsRead } = require('../controllers/notificationController.js');
const { protect } = require('../middleware/authMiddleware.js');
const router = express.Router();

router.route('/').get(protect, getUserNotifications);
router.route('/read-all').put(protect, markAllAsRead);

module.exports = router;