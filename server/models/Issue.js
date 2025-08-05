const mongoose = require('mongoose');

const issueSchema = mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
    community: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Community' },
    issueType: { type: String, required: true },
    description: { type: String, required: true },
    imageUrl: { type: String },
    status: { type: String, required: true, enum: ['Submitted', 'In Progress', 'Resolved'], default: 'Submitted' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Issue', issueSchema);