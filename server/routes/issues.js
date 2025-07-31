const express = require('express');
const router = express.Router();
const { reportIssue, getIssues } = require('../controllers/issueController');
const { protect } = require('../middleware/authMiddleware');

router.route('/')
  .post(protect, reportIssue)
  .get(protect, getIssues);

module.exports = router;