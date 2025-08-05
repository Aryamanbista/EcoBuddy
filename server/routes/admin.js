const express = require('express');
const router = express.Router();
const {
  getDashboardStats,
  getAllIssues,
  updateIssueStatus,
  createAnnouncement,
  getAllUsers,
  getAllPickups,
  getChartData
} = require('../controllers/adminController.js');
const { protect } = require('../middleware/authMiddleware.js');
const { admin } = require('../middleware/adminMiddleware.js');

// All routes in this file are protected and require admin access
router.use(protect, admin);

router.get('/stats', getDashboardStats);
router.get('/issues', getAllIssues);
router.put('/issues/:id', updateIssueStatus);
router.post('/announce', createAnnouncement);
router.get('/users', getAllUsers);
router.get('/pickups', getAllPickups);
router.get('/charts', getChartData);

module.exports = router;