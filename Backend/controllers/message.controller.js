const Message = require('../models/message.model');

// Save a new message
exports.saveMessage = async (req, res) => {
  try {
    const { roomId, senderId, receiverId, message } = req.body;

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

// Get all messages for a specific room
exports.getMessagesByRoomId = async (req, res) => {
  try {
    const { roomId } = req.params;

    const messages = await Message.find({ roomId })
      .populate('senderId', 'fullname email') // Populate sender details
      .populate('receiverId', 'fullname email') // Populate receiver details
      .sort({ timestamp: 1 });

    res.status(200).json(messages);
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
};