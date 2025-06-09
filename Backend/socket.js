const User = require('./models/user.models');
const Doctor = require('./models/doctor.model');
const ChatRoom = require('./models/chatRoom.model');
const { createAdapter } = require('@socket.io/redis-adapter');
const { createClient } = require('redis');

module.exports = async (server) => {
  const { Server } = require('socket.io');
  const io = new Server(server, {
    cors: {
      origin: 'http://localhost:5173',
      methods: ['GET', 'POST'],
      credentials: true,
    },
  });
  const pubClient = createClient({ url: 'redis://localhost:6379' });
  const subClient = pubClient.duplicate();

  await pubClient.connect();
  await subClient.connect();

  io.adapter(createAdapter(pubClient, subClient));


  io.on('connection', async (socket) => {
    const { userId } = socket.handshake.query;
    if (!userId) {
      const onlineUsers = await User.find({ isOnline: true }, '_id');
      socket.emit('currentOnlineUsers', { userIds: onlineUsers.map(u => u._id.toString()) });
      console.log("Emitted currentOnlineUsers to doctor socket", socket.id, onlineUsers.map(u => u._id.toString()));
    }
    console.log("Socket connected:", socket.id, "userId:", userId);
    if (userId) {
      await User.findByIdAndUpdate(userId, { isOnline: true, socketId: socket.id });
      io.emit('userOnline', { userId });
    }
    socket.on('disconnect', async () => {
      const user = await User.findOne({ socketId: socket.id });
      if (user) {
        await User.findByIdAndUpdate(user._id, { isOnline: false, socketId: null });
        console.log("Emitting userOffline for", user._id);
        io.emit('userOffline', { userId: user._id });
      }
    });

    socket.on('sendMessage', async (data) => {
      const { roomId, senderId, receiverId, message, senderType } = data;


      await ChatRoom.findByIdAndUpdate(roomId, {
        lastMessage: message,
        lastMessageTimestamp: new Date(),
        $inc: { unreadMessages: 1 }
      });


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
  });

  return io;
};