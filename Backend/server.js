const dotenv = require('dotenv');
dotenv.config();
const http = require('http');
const app = require('./app.js'); // Import the Express app
const socketio = require('socket.io');
const port = process.env.PORT || 3000;
// Create the HTTP server
const server = http.createServer(app);

// Initialize Socket.IO with CORS configuration
const io = socketio(server, {
  cors: {
    origin: 'http://localhost:5173', // Frontend URL
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
    credentials: true, // Allow cookies and credentials
  },
});

// Handle WebSocket connections
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

// Start the server
server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});