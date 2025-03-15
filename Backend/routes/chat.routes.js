const express = require('express');
const router = express.Router();
const ChatRoom = require('../models/chatRoom.model');

// Endpoint to create a new chat room
router.post('/create', async (req, res) => {
  try {
    const { userId, doctorId } = req.body;
    if (!userId || !doctorId) {
      return res.status(400).json({ error: 'User ID and Doctor ID are required' });
    }
    const newChatRoom = new ChatRoom({ userId, doctorId });
    await newChatRoom.save();
    res.status(201).json({ roomId: newChatRoom._id });
  } catch (error) {
    console.error('Error creating chat room:', error);
    res.status(500).json({ error: 'Failed to create chat room' });
  }
});

module.exports = router;