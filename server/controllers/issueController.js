// controllers/issueController.js
const Issue = require('../models/Issue');
const Notification = require('../models/Notification');

// @desc    Report a new issue
// @route   POST /api/issues
// @access  Private
exports.reportIssue = async (req, res) => {
  const { issueType, description } = req.body;

  try {
    // Basic validation
    if (!issueType || !description) {
      return res.status(400).json({ msg: 'Please provide an issue type and description' });
    }

    const newIssue = new Issue({
      user: req.user.id,
      issueType,
      description,
    });

    const issue = await newIssue.save();

    // Create a notification for the user
    await Notification.create({
      user: req.user.id,
      title: 'Issue Reported',
      message: `Your report for "${issueType}" has been successfully submitted.`,
      link: '/report-issue' // Link to the page where they can see the status
    });

    res.status(201).json(issue);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// @desc    Get all issues reported by a user
// @route   GET /api/issues
// @access  Private
exports.getIssues = async (req, res) => {
  try {
    const issues = await Issue.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json(issues);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};