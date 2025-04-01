module.exports = (server) => {
  const socketIo = require('socket.io');
  const io = socketIo(server, {
    cors: {
      origin: 'http://localhost:5173', // Frontend URL
      methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
      credentials: true, // Allow cookies and credentials
    },
  });

  io.on('connection', (socket) => {
    console.log('A user connected');

    socket.on('join_room', (room) => {
      socket.join(room);
      console.log(`User joined room: ${room}`);
    });

    socket.on('send_message', (data) => {
      io.to(data.room).emit('receive_message', data);
    });

    socket.on('disconnect', () => {
      console.log('Client disconnected');
    });
  });

  return io;
};