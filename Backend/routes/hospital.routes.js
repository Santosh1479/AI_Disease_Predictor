const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const hospitalController = require('../controllers/hospital.controller');

// Create a new hospital
router.post('/create',
    [
        body('_id').isInt({ min: 1000 }).withMessage('Hospital ID must be at least 4 digits'),
        body('name').notEmpty().withMessage('Name is required'),
        body('customerCare').notEmpty().withMessage('Customer care is required'),
        body('email').isEmail().withMessage('Invalid email'),
        body('specialisations').isArray().withMessage('Specialisations must be an array'),
        body('latitude').isNumeric().withMessage('Latitude must be a number'),
        body('longitude').isNumeric().withMessage('Longitude must be a number')
    ],
    hospitalController.createHospital
);

// Get all hospitals
router.get('/all', hospitalController.getHospitals);

// Get a hospital by ID
router.get('/details/:id', hospitalController.getHospitalById);

// Update a hospital by ID
router.put('/update/:id', hospitalController.updateHospital);

// Delete a hospital by ID
router.delete('/delete/:id', hospitalController.deleteHospital);

module.exports = router;