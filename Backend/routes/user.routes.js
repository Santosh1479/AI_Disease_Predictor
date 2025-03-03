// user.routes.js
const express = require('express');
const router = express.Router();
const { body } = require("express-validator");
const usercontroller = require('../controllers/user.controller');
const authMiddleware = require('../middlewares/auth.middleware');

router.post('/register', [
  body('email').isEmail().withMessage('Invalid Email'),
  body('fullname.firstname').isLength({ min: 3 }).withMessage('firstname is short'),
  body('password').isLength({ min: 2 }).withMessage('password is short'),
  body('mobileNumber').isLength({ min: 10 }).withMessage('Mobile number is too short'),
], usercontroller.registerUser);

router.post('/login', [
  body('email').isEmail().withMessage('Invalid Email'),
  body('password').isLength({ min: 6 }).withMessage('password is short'),
], usercontroller.loginuser);

router.get('/data', usercontroller.getUserData);

router.get('/profile', authMiddleware.authUser, usercontroller.getUserProfile);

router.post('/logout', authMiddleware.authUser, usercontroller.logoutUser);

module.exports = router;