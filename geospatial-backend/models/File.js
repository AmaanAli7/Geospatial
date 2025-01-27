const mongoose = require('mongoose');

const FileSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  type: { type: String, required: true },
  data: { type: String, required: true }, // Store file data as string or cloud link
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('File', FileSchema);
