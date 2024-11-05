const mongoose = require('mongoose');

const ChatSchema = new mongoose.Schema({
  roomId: {
    type: String,
    required: true,
  },
  messages: [{
    sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    message: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
  }]
}, { timestamps: true });

module.exports = mongoose.model('Chat', ChatSchema);
