const userModel = require('../models/user.models');
const userservice = require('../services/user.service');
const { validationResult } = require('express-validator');
const blacklistTokenModel = require('../models/blackListToken.model');

module.exports.registerUser = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
  
    const { fullname, email, password, mobileNumber } = req.body;
  
    try {
      const hashedpass = await userModel.hashPassword(password);
  
      const user = await userservice.createUser({
        firstname: fullname.firstname,
        lastname: fullname.lastname,
        email,
        password: hashedpass,
        mobileNumber,
      });
  
      const token = user.generateAuthToken();
  
      res.status(201).json({ token, user });
    } catch (error) {
      if (error.message === 'Email already exists') {
        return res.status(400).json({ message: error.message });
      }
      next(error);
    }
  };

module.exports.loginuser = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, password } = req.body;
  const user = await userModel.findOne({ email }).select('+password');
  if (!user) {
    return res.status(401).json({ message: 'Invalid Email or Password' });
  }
  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    return res.status(401).json({ message: 'Invalid Email or Password' });
  }

  const token = user.generateAuthToken();

  res.cookie('token', token);

  res.status(200).json({ token, user });
};

module.exports.getUserData = async (req, res, next) => {
  try {
    const users = await userModel.find();
    res.status(200).json(users);
  } catch (error) {
    next(error);
  }
};

module.exports.getUserProfile = async (req, res, next) => {
  res.status(200).json(req.user);
};

module.exports.logoutUser = async (req, res, next) => {
    try {
      const token = req.cookies.token || req.headers.authorization.split(' ')[1];
      if (!token) {
        return res.status(400).json({ message: "Token is required" });
      }
  
      await blacklistTokenModel.create({ token });
  
      res.clearCookie('token');
      res.status(200).json({ message: "Logged out" });
    } catch (error) {
      next(error);
    }
  };