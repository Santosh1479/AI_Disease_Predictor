const jwt = require('jsonwebtoken');
const userModel = require('../models/user.models');
const doctorModel = require('../models/doctor.model');

const jwt = require('jsonwebtoken');
const userModel = require('../models/user.models');
const doctorModel = require('../models/doctor.model');

module.exports.authUser = async (req, res, next) => {
  try {
    // Extract token from Authorization header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Access denied. No token provided.' });
    }
    console.log('Authorization Header:', req.headers.authorization);

    const token = authHeader.split(' ')[1]; // Extract the token after "Bearer"
    if (!token) {
      return res.status(401).json({ message: 'Access denied. No token provided.' });
    }

    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Find the user in the database
    const user = await userModel.findById(decoded._id);
    if (!user) {
      return res.status(401).json({ message: 'Invalid token.' });
    }

    // Attach the user to the request object
    req.user = user;
    next();
  } catch (error) {
    console.error('Error in authUser middleware:', error);
    res.status(401).json({ message: 'Invalid token.' });
  }
};

// module.exports.authDoctor = async (req, res, next) => {
//   const authHeader = req.header('Authorization');
//   if (!authHeader) {
//     return res.status(401).json({ message: 'No token, authorization denied' });
//   }

//   const token = authHeader.replace('Bearer ', '');
//   try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     req.doctor = await doctorModel.findById(decoded._id);
//     if (!req.doctor) {
//       return res.status(401).json({ message: 'Authorization denied' });
//     }
//     next();
//   } catch (error) {
//     res.status(401).json({ message: 'Token is not valid' });
//   }
// };

module.exports.authDoctor = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1]; // Extract token
    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Verify token
    const doctor = await doctorModel.findById(decoded._id); // Find doctor by ID in token
    if (!doctor) {
      return res.status(401).json({ message: 'Doctor not found' });
    }

    req.user = doctor; // Attach doctor to request
    next();
  } catch (error) {
    console.error('Error in authDoctor middleware:', error);
    res.status(500).json({ message: 'Authentication failed' });
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