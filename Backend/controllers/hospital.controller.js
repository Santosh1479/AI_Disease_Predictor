const hospitalService = require('../services/hospital.service');
const { validationResult } = require('express-validator');

module.exports.createHospital = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { id, name, customerCare, email, specialisations, latitude, longitude } = req.body;

    try {
        const hospital = await hospitalService.createHospital({ id, name, customerCare, email, specialisations, latitude, longitude });
        res.status(201).json(hospital);
    } catch (error) {
        next(error);
    }
};

module.exports.getHospitals = async (req, res, next) => {
    try {
        const hospitals = await hospitalService.getHospitals();
        res.status(200).json(hospitals);
    } catch (error) {
        next(error);
    }
};

module.exports.getHospitalById = async (req, res, next) => {
    try {
        const hospital = await hospitalService.getHospitalById(req.params.id);
        if (!hospital) {
            return res.status(404).json({ message: 'Hospital not found' });
        }
        res.status(200).json(hospital);
    } catch (error) {
        next(error);
    }
};

module.exports.updateHospital = async (req, res, next) => {
    try {
        const hospital = await hospitalService.updateHospital(req.params.id, req.body);
        if (!hospital) {
            return res.status(404).json({ message: 'Hospital not found' });
        }
        res.status(200).json(hospital);
    } catch (error) {
        next(error);
    }
};

module.exports.deleteHospital = async (req, res, next) => {
    try {
        const hospital = await hospitalService.deleteHospital(req.params.id);
        if (!hospital) {
            return res.status(404).json({ message: 'Hospital not found' });
        }
        res.status(200).json({ message: 'Hospital deleted successfully' });
    } catch (error) {
        next(error);
    }
};