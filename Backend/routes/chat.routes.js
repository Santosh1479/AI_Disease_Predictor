const express = require('express');
const router = express.Router();
const ChatRoom = require('../models/chatRoom.model');
const { authDoctor } = require('../middlewares/auth.middleware');
const chatController = require('../controllers/chat.controller');

// Endpoint to create a new chat room
router.post('/create', async (req, res) => {
    try {
        const { userId, userName, doctorId, doctorName } = req.body;
        if (!userId || !userName || !doctorId || !doctorName) {
            return res.status(400).json({ error: 'User ID, User Name, Doctor ID, and Doctor Name are required' });
        }
        const newChatRoom = new ChatRoom({ userId, userName, doctorId, doctorName });
        await newChatRoom.save();
        res.status(201).json({ roomId: newChatRoom._id });
    } catch (error) {
        console.error('Error creating chat room:', error);
        res.status(500).json({ error: 'Failed to create chat room' });
    }
});
router.get('/doctor-chat-rooms', authDoctor, chatController.getChatRoomsForDoctor);

module.exports = router;