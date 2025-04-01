const io = socketIo(server, {
  cors: {
    origin: 'http://localhost:5173', // Replace with your frontend's URL
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
    credentials: true,
  },
});