// filepath: c:\Users\Santosh\Desktop\AI_Disease_Predictor\Backend\routes\doctor.routes.js
const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const { authDoctor } = require('../middlewares/auth.middleware');
const doctorController = require('../controllers/doctor.controller');

// Doctor login
router.post('/login', [
  body('email').isEmail().withMessage('Invalid email'),
  body('password').isLength({ min: 6 }).withMessage('Password is too short')
], doctorController.loginDoctor);

// Get doctor profile
router.get('/profile', authDoctor, doctorController.getProfile);

module.exports = router;