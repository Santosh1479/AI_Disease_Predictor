const express = require('express');
const router = express.Router();
const { body, check } = require("express-validator");
const userController = require('../controllers/user.controller');
const { authUser } = require('../middlewares/auth.middleware');

router.post('/register', [
  check('firstname').not().isEmpty().withMessage('First name is required'),
  check('lastname').not().isEmpty().withMessage('Last name is required'),
  check('email').isEmail().withMessage('Valid email is required'),
  check('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
  check('mobileNumber').not().isEmpty().withMessage('Mobile number is required')
], userController.registerUser);

router.post('/login', [
  body('email').isEmail().withMessage('Invalid Email'),
  body('password').isLength({ min: 6 }).withMessage('Password is short'),
], userController.loginUser);

router.get('/profile', authUser, userController.getUserProfile);

router.post('/logout', authUser, userController.logoutUser);

module.exports = router;