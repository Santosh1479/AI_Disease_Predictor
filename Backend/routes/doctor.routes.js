const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const { authDoctor, authUser, authUserOrDoctor } = require('../middlewares/auth.middleware');
const doctorController = require('../controllers/doctor.controller');

// Doctor login
router.post('/login', [
  body('email').isEmail().withMessage('Invalid email'),
  body('password').isLength({ min: 6 }).withMessage('Password is too short')
], doctorController.loginDoctor);

// Get doctor profile
router.get('/profile', authDoctor, doctorController.getProfile);

// Get doctor by ID
router.get('/:doctorId', authDoctor, doctorController.getDoctorById);

// Get all doctors
router.get('/all', authUserOrDoctor, doctorController.getAllDoctors);

// Doctor logout
router.post('/logout', authDoctor, doctorController.logoutDoctor);

module.exports = router;