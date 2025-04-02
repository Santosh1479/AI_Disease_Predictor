const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chatRoom.controller');
const { authDoctor } = require('../middlewares/auth.middleware');

// Endpoint to create a new chat room
router.post('/create', chatController.createChatRoom)

router.get('/doctor-chat-rooms', authDoctor, chatController.getChatRoomsForDoctor);

router.get('/test-auth', authDoctor, (req, res) => {
    res.status(200).json({ user: req.user });
});

router.get('/room/:roomId', chatController.getRoomDetails);

module.exports = router;