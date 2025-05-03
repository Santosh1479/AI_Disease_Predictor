const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema(
  {
    roomId: {
      type: String,
      required: true, // Unique identifier for the chat room
    },
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    receiverId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    timestamp: {
      type: Date,
      default: Date.now, // Automatically saves the current date and time
    },
  },
  { timestamps: true } // Includes createdAt and updatedAt fields
);

const Message = mongoose.model('Message', messageSchema);

module.exports = Message;