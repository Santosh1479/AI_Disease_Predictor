const express = require('express');
const router = express.Router();
const Message = require('../models/message.model');

// Endpoint to store a new message
router.post('/messages', async (req, res) => {
  try {
    const { author, message, time, room } = req.body;
    const newMessage = new Message({ author, message, time, room });
    await newMessage.save();
    res.status(201).json(newMessage);
  } catch (error) {
    res.status(500).json({ error: 'Failed to save message' });
  }
});

// Endpoint to fetch messages for a specific room
router.get('/messages/:room', async (req, res) => {
  try {
    const { room } = req.params;
    const messages = await Message.find({ room });
    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
});

module.exports = router;