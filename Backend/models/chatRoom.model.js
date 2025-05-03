const mongoose = require('mongoose');

const chatRoomSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  userName: {
    type: String,
    required: true,
  },
  doctorId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  doctorName: {
    type: String,
    required: true,
  },
  unreadMessages: {
    type: Number,
    default: 0, // Track the number of unread messages
  },
  lastMessage: {
    type: String, // Store the last message in the chat
    default: "",
  },
  lastMessageTimestamp: {
    type: Date, // Timestamp of the last message
    default: null,
  },
});

const ChatRoom = mongoose.model('ChatRoom', chatRoomSchema);

module.exports = ChatRoom;