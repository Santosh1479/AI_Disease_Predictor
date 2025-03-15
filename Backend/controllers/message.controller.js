const Message = require('../models/message.model');

exports.getMessagesForDoctor = async (req, res) => {
    try {
        const doctorId = req.params.doctorId;
        const messages = await Message.find({ doctorId });
        res.status(200).json(messages);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching messages' });
    }
};