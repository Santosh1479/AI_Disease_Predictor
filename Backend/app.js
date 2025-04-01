const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const connecttoDB = require('./db/db');
const userRoutes = require('./routes/user.routes');
const hospitalRoutes = require('./routes/hospital.routes');
const doctorRoutes = require('./routes/doctor.routes');
const resultsRoutes = require('./routes/results.routes');
const chatRoutes = require('./routes/chatRoom.routes'); // Add chat routes
const messageRoutes = require('./routes/message.routes');

// Add message routes

// Connect to MongoDB
connecttoDB();

const app = express();

// CORS configuration
app.use(cors({
  origin: 'http://localhost:5173', // Frontend URL
  methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
  credentials: true, // Allow cookies and credentials
}));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Routes
app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.use('/users', userRoutes);
app.use('/hospitals', hospitalRoutes);
app.use('/doctors', doctorRoutes);
app.use('/messages', messageRoutes);
app.use('/results', resultsRoutes);
app.use('/chat', chatRoutes); // Use chat routes
app.use('/messages', messageRoutes);

module.exports = app;