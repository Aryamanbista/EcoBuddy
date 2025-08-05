const express = require('express');
const { reportIssue, getUserIssues } = require('../controllers/issueController.js');
const { protect } = require('../middleware/authMiddleware.js');
const router = express.Router();

router.route('/').post(protect, reportIssue).get(protect, getUserIssues);

module.exports = router;