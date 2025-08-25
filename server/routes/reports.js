const express = require('express');
const { getUserReport,exportUserReport } = require('../controllers/reportController.js');
const { protect } = require('../middleware/authMiddleware.js');
const router = express.Router();

router.route('/').get(protect, getUserReport);
router.route('/export').get(protect, exportUserReport);

module.exports = router;