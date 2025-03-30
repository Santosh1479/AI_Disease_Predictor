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

// Get all doctors (move this route before the dynamic :doctorId route)
router.get('/all', authUserOrDoctor, doctorController.getAllDoctors);

// Get doctor profile
router.get('/profile', authDoctor, (req, res) => {
  console.log('Authenticated doctor:', req.user);
  res.status(200).json(req.user);
});
// Get doctor by ID
router.get('/:doctorId', authDoctor, doctorController.getDoctorById);

// Doctor logout
router.post('/logout', authDoctor, doctorController.logoutDoctor);

module.exports = router;