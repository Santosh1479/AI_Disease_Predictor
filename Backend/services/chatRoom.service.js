const ChatRoom = require('../models/chatRoom.model');

module.exports.createChatRoom = async (userId, userName, doctorId, doctorName) => {
  // Validate required fields
  if (!userId || !userName || !doctorId || !doctorName) {
    throw new Error('User ID, User Name, Doctor ID, and Doctor Name are required');
  }

  // Check if a chat room already exists between the user and doctor
  const existingChatRoom = await ChatRoom.findOne({ userId, doctorId });
  if (existingChatRoom) {
    return existingChatRoom; // Return the existing chat room
  }

  // Create a new chat room
  const newChatRoom = new ChatRoom({ userId, userName, doctorId, doctorName });
  await newChatRoom.save();
  return newChatRoom;
};