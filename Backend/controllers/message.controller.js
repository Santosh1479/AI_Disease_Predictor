const Message = require('../models/message.model');
const User = require('../models/user.models'); // Import the User model
const Doctor = require('../models/doctor.model');
const mongoose = require('mongoose');
const ChatRoom = require('../models/chatRoom.model');

exports.saveMessage = async (req, res) => {
  try {
    const { roomId, senderId, receiverId, message } = req.body;

    if (!mongoose.Types.ObjectId.isValid(senderId) || !mongoose.Types.ObjectId.isValid(receiverId)) {
      return res.status(400).json({ error: 'Invalid senderId or receiverId' });
    }

    const newMessage = new Message({
      roomId,
      senderId,
      receiverId,
      message,
    });

    await newMessage.save();

    // Increment unread messages for the receiver only
    await ChatRoom.findOneAndUpdate(
      { _id: roomId },
      {
        $set: { lastMessage: message, lastMessageTimestamp: new Date() },
        $inc: { unreadMessages: senderId !== receiverId ? 1 : 0 }, // Increment only if sender is not the receiver
      }
    );

    // Clear notifications for the sender
    if (senderId === receiverId) {
      await ChatRoom.findOneAndUpdate(
        { _id: roomId },
        { $set: { unreadMessages: 0 } }
      );
    }

    res.status(201).json({ message: 'Message saved successfully', newMessage });
  } catch (error) {
    console.error('Error saving message:', error);
    res.status(500).json({ error: 'Failed to save message' });
  }
};


exports.getMessagesByRoomId = async (req, res) => {
  try {
    const { roomId } = req.params;

    const messages = await Message.find({ roomId }).select('message senderId receiverId timestamp');
    console.log("Fetched messages from DB:", messages); // Debugging log
    res.status(200).json(messages);
  } catch (error) {
    console.error("Error fetching messages:", error);
    res.status(500).json({ error: "Failed to fetch messages" });
  }
};