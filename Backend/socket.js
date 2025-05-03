module.exports = (server) => {
  const socketIo = require('socket.io');
  const io = socketIo(server, {
    cors: {
      origin: 'http://localhost:5173', // Frontend URL
      methods: ['GET', 'POST'],
    },
  });

  io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);

    socket.on('join_room', (roomId) => {
      socket.join(roomId);
      console.log(`User joined room: ${roomId}`);
    });

    socket.on('send_message', (data) => {
      io.to(data.roomId).emit('receive_message', data);
    });

    socket.on('disconnect', () => {
      console.log('User disconnected:', socket.id);
    });
  });

  return io;
};

const io = require('socket.io')(server);

io.on('connection', (socket) => {
  const { userId } = socket.handshake.query;

  // Mark user as online
  Doctor.findByIdAndUpdate(userId, { isOnline: true }, { new: true }).exec();

  socket.on('disconnect', async () => {
    // Mark user as offline
    await Doctor.findByIdAndUpdate(userId, { isOnline: false }, { new: true }).exec();
  });
});