const express = require('express');
const router = express.Router();
const messagesController = require('../controllers/message.controller');

// Save a new message
router.post('/', messagesController.saveMessage);

// Get all messages for a specific room
router.get('/:roomId', messagesController.getMessagesByRoomId);

module.exports = router;