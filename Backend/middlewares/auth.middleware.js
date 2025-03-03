const jwt = require('jsonwebtoken');
const userModel = require('../models/user.models');

module.exports.authUser = async (req, res, next) => {
  const token = req.cookies.token || req.headers.authorization.split(' ')[1];
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
    res.status(400).json({ message: 'Invalid token.' });
  }
};