const mongoose = require('mongoose');

const communitySchema = mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Community', communitySchema);