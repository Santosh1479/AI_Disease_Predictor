const ChatRoom = require('../models/chatRoom.model');
module.exports.getChatRoomsForDoctor = async (req, res) => {
    try {
      const chatRooms = await ChatRoom.find({ doctorId: req.user._id });
      res.status(200).json(chatRooms);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };