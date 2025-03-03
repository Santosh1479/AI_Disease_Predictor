const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const hospitalController = require('../controllers/hospital.controller');

// Create a new hospital
router.post('/create',
    [
        body('name').isLength({ min: 3 }).withMessage('Hospital name is too short'),
        body('customerCare').isLength({ min: 10 }).withMessage('Customer care number is too short'),
        body('email').isEmail().withMessage('Invalid email'),
        body('specialisations').isArray().withMessage('Specialisations must be an array'),
        body('latitude').isFloat({ min: -90, max: 90 }).withMessage('Invalid latitude'),
        body('longitude').isFloat({ min: -180, max: 180 }).withMessage('Invalid longitude')
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