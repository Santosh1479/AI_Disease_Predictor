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

exports.getChatRooms = async (req, res) => {
  try {
    const chatRooms = await ChatRoom.find()
      .populate('userId', 'isOnline') // Populate user online status
      .populate('doctorId', 'isOnline'); // Populate doctor online status

    res.status(200).json(chatRooms);
  } catch (error) {
    console.error('Error fetching chat rooms:', error);
    res.status(500).json({ error: 'Failed to fetch chat rooms' });
  }
};

exports.clearNotifications = async (req, res) => {
  try {
    const { roomId } = req.params;

    await ChatRoom.findOneAndUpdate(
      { _id: roomId },
      { $set: { unreadMessages: 0 } }
    );

    res.status(200).json({ message: "Notifications cleared successfully" });
  } catch (error) {
    console.error("Error clearing notifications:", error);
    res.status(500).json({ error: "Failed to clear notifications" });
  }
};
exports.getChatRoomsForDoctor = async (req, res) => {
  try {
    if (!req.user || !req.user._id) {
      return res.status(400).json({ message: 'Doctor ID is missing' });
    }
    const doctorId = req.user._id;
    const chatRooms = await ChatRoom.find({ doctorId })
      .populate('userId', 'fullname isOnline'); // Populate user online status
    // Map to include isOnline at top level for frontend
    const roomsWithOnline = chatRooms.map(room => ({
      ...room.toObject(),
      isOnline: room.userId.isOnline,
      userName: room.userName,
      lastMessage: room.lastMessage,
      lastMessageTimestamp: room.lastMessageTimestamp,
      unreadMessages: room.unreadMessages,
      _id: room._id
    }));
    res.status(200).json(roomsWithOnline);
  } catch (error) {
    console.error('Error fetching chat rooms:', error);
    res.status(500).json({ message: error.message });
  }
};

exports.getChatRoomsForUser = async (req, res) => {
  try {
    const userId = req.user._id;
    const chatRooms = await ChatRoom.find({ userId })
      .populate('doctorId', 'fullname email isOnline') // doctor info
      .sort({ updatedAt: -1 });

    res.status(200).json(chatRooms);
  } catch (error) {
    console.error('Error fetching user chat rooms:', error);
    res.status(500).json({ error: 'Failed to fetch user chat rooms' });
  }
};

exports.clearUserNotifications = async (req, res) => {
  try {
    const { roomId } = req.params;
    const userId = req.user._id;

    // Only allow if the user is part of the chat room
    const room = await ChatRoom.findOne({ _id: roomId, userId });
    if (!room) {
      return res.status(404).json({ error: "Chat room not found" });
    }

    room.unreadMessages = 0;
    await room.save();

    res.status(200).json({ message: "Notifications cleared successfully" });
  } catch (error) {
    console.error("Error clearing notifications:", error);
    res.status(500).json({ error: "Failed to clear notifications" });
  }
};

module.exports.getRoomDetails = async (req, res) => {
  try {
    const { roomId } = req.params;

    // Query the database for the roomId
    const room = await ChatRoom.findOne({ _id: roomId });
    if (!room) {
      return res.status(404).json({ error: "Room not found" });
    }

    res.status(200).json({
      senderId: room.userId,
      receiverId: room.doctorId,
    });
  } catch (error) {
    console.error("Error fetching room details:", error);
    res.status(500).json({ error: "Failed to fetch room details" });
  }
};