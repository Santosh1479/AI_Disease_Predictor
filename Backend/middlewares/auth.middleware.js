// filepath: c:\Users\Santosh\Desktop\AI_Disease_Predictor\Backend\middlewares\auth.middleware.js
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
  const token = req.cookies.token || (req.headers.authorization && req.headers.authorization.split(' ')[1]);
  if (!token) {
    return res.status(401).json({ message: 'Access denied. No token provided.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const doctor = await doctorModel.findById(decoded._id);
    if (!doctor) {
      return res.status(401).json({ message: 'Invalid token.' });
    }
    req.user = doctor;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid token.' });
  }
};