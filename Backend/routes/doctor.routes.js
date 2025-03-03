const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const doctorController = require('../controllers/doctor.controller');

// Create a new doctor
router.post('/create',
    [
        body('firstname').isLength({ min: 3 }).withMessage('First name is too short'),
        body('lastname').isLength({ min: 3 }).withMessage('Last name is too short'),
        body('email').isEmail().withMessage('Invalid email'),
        body('mobileNumber').isLength({ min: 10 }).withMessage('Mobile number is too short'),
        body('password').isLength({ min: 6 }).withMessage('Password is too short'),
        body('hospital').notEmpty().withMessage('Hospital is required'),
        body('specialisation').notEmpty().withMessage('Specialisation is required')
    ],
    doctorController.createDoctor
);

// Get all doctors
router.get('/all', doctorController.getDoctors);

// Get a doctor by ID
router.get('/details/:id', doctorController.getDoctorById);

// Update a doctor by ID
router.put('/update/:id', doctorController.updateDoctor);

// Delete a doctor by ID
router.delete('/delete/:id', doctorController.deleteDoctor);

module.exports = router;