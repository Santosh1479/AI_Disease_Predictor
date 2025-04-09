const Message = require('../models/message.model');
const User = require('../models/user.models'); // Import the User model
const Doctor = require('../models/doctor.model');
const mongoose = require('mongoose');
// Save a new message
exports.saveMessage = async (req, res) => {
  try {
    const { roomId, senderId, receiverId, message } = req.body;

    // Validate senderId and receiverId
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
    res.status(201).json({ message: 'Message saved successfully', newMessage });
  } catch (error) {
    console.error('Error saving message:', error);
    res.status(500).json({ error: 'Failed to save message' });
  }
};

exports.getMessagesByRoomId = async (req, res) => {
  try {
    const { roomId } = req.params;

    const messages = await Message.find({ roomId })
      .populate('senderId', 'fullname email') // Populate sender details
      .populate('receiverId', 'fullname email') // Populate receiver details
      .select('message senderId receiverId timestamp'); // Include the timestamp field

    res.status(200).json(messages);
  } catch (error) {
    console.error("Error fetching messages:", error);
    res.status(500).json({ error: "Failed to fetch messages" });
  }
};