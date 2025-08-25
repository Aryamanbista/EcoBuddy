const mongoose = require('mongoose');

const notificationSchema = mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
    community: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Community' }, // Add community for easier querying
    title: { type: String, required: true },
    message: { type: String, required: true },
    type: { type: String, required: true, enum: ['reminder', 'announcement', 'success', 'update'] },
    read: { type: Boolean, default: false },
    announcementId: { type: mongoose.Schema.Types.ObjectId }, // <-- ID to group announcements
  },
  { timestamps: true }
);

module.exports = mongoose.model('Notification', notificationSchema);