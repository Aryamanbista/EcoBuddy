const express = require('express');
const router = express.Router();
const { getReports } = require('../controllers/reportController');
const { protect } = require('../middleware/authMiddleware');

router.get('/', protect, getReports);

module.exports = router;