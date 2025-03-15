const express = require('express');
const router = express.Router();
const messagesController = require('../controllers/message.controller');

// Get messages for a specific doctor
router.get('/doctor/:doctorId', messagesController.getMessagesForDoctor);

module.exports = router;