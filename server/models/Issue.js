const mongoose = require('mongoose');

const IssueSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  issueType: { type: String, required: true },
  description: { type: String, required: true },
  status: {
    type: String,
    enum: ['Submitted', 'In Progress', 'Resolved'],
    default: 'Submitted',
  },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Issue', IssueSchema);
