const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const { authDoctor, authUserOrDoctor } = require('../middlewares/auth.middleware');
const doctorController = require('../controllers/doctor.controller');


router.post('/create', [
  body('firstname').notEmpty().withMessage('First name is required'),
  body('lastname').notEmpty().withMessage('Last name is required'),
  body('email').isEmail().withMessage('Invalid email'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
  body('mobileNumber').notEmpty().withMessage('Mobile number is required'),
  body('hospital').notEmpty().withMessage('Hospital is required'),
  body('specialisation').notEmpty().withMessage('Specialisation is required'),
], doctorController.createDoctor);

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