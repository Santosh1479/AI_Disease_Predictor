const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chatRoom.controller');
const auth = require('../middlewares/auth.middleware');

// Endpoint to create a new chat room
router.post('/create', chatController.createChatRoom);

router.get('/doctor-chat-rooms', auth.authDoctor, chatController.getChatRoomsForDoctor);

module.exports = router;