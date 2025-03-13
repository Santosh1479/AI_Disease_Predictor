// user.routes.js
const express = require('express');
const router = express.Router();
const { body } = require("express-validator");
const usercontroller = require('../controllers/user.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const { check } = require('express-validator');
const userController = require('../controllers/user.controller');
router.post('/register', [
  check('fullname').not().isEmpty().withMessage('Full name is required'),
  check('email').isEmail().withMessage('Valid email is required'),
  check('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
  check('mobileNumber').not().isEmpty().withMessage('Mobile number is required')
], userController.registerUser);

router.post('/login', [
  body('email').isEmail().withMessage('Invalid Email'),
  body('password').isLength({ min: 6 }).withMessage('password is short'),
], usercontroller.loginuser);

router.get('/data', usercontroller.getUserData);

router.get('/profile', authMiddleware.authUser, usercontroller.getUserProfile);

router.post('/logout', authMiddleware.authUser, usercontroller.logoutUser);

module.exports = router;