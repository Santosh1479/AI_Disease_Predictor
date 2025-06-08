const User = require('./models/user.models');
const Doctor = require('./models/doctor.model');
const ChatRoom = require('./models/chatRoom.model');

module.exports = (server) => {
  const { Server } = require('socket.io');
  const io = new Server(server, {
    cors: {
      origin: 'http://localhost:5173',
      methods: ['GET', 'POST'],
      credentials: true,
    },
  });

  io.on('connection', async (socket) => {
    const { userId } = socket.handshake.query;

    // Mark user/doctor as online and save socketId
    if (userId) {
      await User.findByIdAndUpdate(userId, { isOnline: true, socketId: socket.id });
      io.emit('userOnline', { userId });
    }
    

    // Listen for messages
    socket.on('sendMessage', async (data) => {
      // data: { roomId, senderId, receiverId, message, senderType }
      const { roomId, senderId, receiverId, message, senderType } = data;

      // Update lastMessage in ChatRoom (for demo)
      await ChatRoom.findByIdAndUpdate(roomId, {
        lastMessage: message,
        lastMessageTimestamp: new Date(),
        $inc: { unreadMessages: 1 }
      });

      // Emit message to receiver if online
      let receiverSocket = null;
      if (senderType === 'user') {
        const doctor = await Doctor.findById(receiverId);
        receiverSocket = doctor?.socketId;
      } else {
        const user = await User.findById(receiverId);
        receiverSocket = user?.socketId;
      }

      if (receiverSocket) {
        io.to(receiverSocket).emit('receiveMessage', {
          roomId,
          senderId,
          message,
          timestamp: new Date(),
        });
      }
    });

    // Handle disconnect
    socket.on('disconnect', async () => {
      const user = await User.findOne({ socketId: socket.id });
      if (user) {
        await User.findByIdAndUpdate(user._id, { isOnline: false, socketId: null });
        io.emit('userOffline', { userId: user._id });
      }
    });
  });

  return io;
};