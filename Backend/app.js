const express = require('express');
const cors = require('cors');
const app = express();
const cookieParser = require('cookie-parser');
const connecttoDB = require('./db/db');
const userRoutes = require('./routes/user.routes');
const hospitalRoutes = require('./routes/hospital.routes');
const doctorRoutes = require('./routes/doctor.routes');
connecttoDB();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.get('/page', (req, res) => {
  res.render('page.jsx');
});
app.use('/users', userRoutes);
app.use('/hospitals', hospitalRoutes);
app.use('/doctors', doctorRoutes);

module.exports = app;