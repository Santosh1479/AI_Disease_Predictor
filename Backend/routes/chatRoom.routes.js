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
router.patch('/clear-notifications/:roomId', chatController.clearNotifications);

router.get('/room/:roomId', chatController.getRoomDetails);
const { authUser } = require('../middlewares/auth.middleware');

// Get all chat rooms for a user
router.get('/user-chat-rooms', authUser, chatController.getChatRoomsForUser);

// Mark all messages as read in a chat room (user)
router.patch('/clear-user-notifications/:roomId', authUser, chatController.clearUserNotifications);

module.exports = router;