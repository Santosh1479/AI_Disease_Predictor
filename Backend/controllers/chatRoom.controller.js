const ChatRoom = require('../models/chatRoom.model');
const chatService = require('../services/chatRoom.service');

module.exports.createChatRoom = async (req, res) => {
  try {
    const { userId, userName, doctorId, doctorName } = req.body;

    // Call the service to create a chat room
    const chatRoom = await chatService.createChatRoom(userId, userName, doctorId, doctorName);

    res.status(201).json({ roomId: chatRoom._id });
  } catch (error) {
    console.error('Error creating chat room:', error);
    res.status(500).json({ error: error.message });
  }
};

module.exports.getChatRoomsForDoctor = async (req, res) => {
  try {
    if (!req.user || !req.user._id) {
      return res.status(400).json({ message: 'Doctor ID is missing' });
    }

    const doctorId = req.user._id; // Extract doctor ID
    const chatRooms = await ChatRoom.find({ doctorId }); // Fetch chat rooms
    res.status(200).json(chatRooms);
  } catch (error) {
    console.error('Error fetching chat rooms:', error);
    res.status(500).json({ message: error.message });
  }
};