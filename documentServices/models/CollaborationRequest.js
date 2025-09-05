// models/CollaborationRequest.js
const mongoose = require('mongoose');

const CollaborationRequestSchema = new mongoose.Schema({
  document: { type: mongoose.Schema.Types.ObjectId, ref: 'Document', required: true },
  requester: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // denormalized
  message: { type: String }, // optional note
  status: { type: String, enum: ['pending','accepted','declined'], default: 'pending' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('CollaborationRequest', CollaborationRequestSchema);
