const jwt = require('jsonwebtoken');
const userModel = require('../models/user.models');
const doctorModel = require('../models/doctor.model');

module.exports.authUser = async (req, res, next) => {
  const token = req.cookies.token || (req.headers.authorization && req.headers.authorization.split(' ')[1]);
  if (!token) {
    return res.status(401).json({ message: 'Access denied. No token provided.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await userModel.findById(decoded._id);
    if (!user) {
      return res.status(401).json({ message: 'Invalid token.' });
    }
    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid token.' });
  }
};

module.exports.authDoctor = async (req, res, next) => {
  const authHeader = req.header('Authorization');
  if (!authHeader) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }

  const token = authHeader.replace('Bearer ', '');
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.doctor = await doctorModel.findById(decoded._id);
    if (!req.doctor) {
      return res.status(401).json({ message: 'Authorization denied' });
    }
    next();
  } catch (error) {
    res.status(401).json({ message: 'Token is not valid' });
  }
};

module.exports.authUserOrDoctor = async (req, res, next) => {
  const token = req.cookies.token || (req.headers.authorization && req.headers.authorization.split(' ')[1]);
  if (!token) {
    return res.status(401).json({ message: 'Access denied. No token provided.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Decoded Token:', decoded); // Log the decoded token

    const user = await userModel.findById(decoded._id);
    console.log('User:', user); // Log the user

    const doctor = await doctorModel.findById(decoded._id);
    console.log('Doctor:', doctor); // Log the doctor

    if (user || doctor) {
      req.user = user || doctor; // Attach the user or doctor to the request
      next();
    } else {
      return res.status(401).json({ message: 'Authorization denied' });
    }
  } catch (error) {
    console.error('Token Verification Error:', error); // Log the error
    res.status(401).json({ message: 'Token is not valid' });
  }
};