const doctorService = require('../services/doctor.service');
const { validationResult } = require('express-validator');

module.exports.createDoctor = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { firstname, lastname, email, mobileNumber, password, hospital, specialisation } = req.body;

    try {
        const doctor = await doctorService.createDoctor({ firstname, lastname, email, mobileNumber, password, hospital, specialisation });
        res.status(201).json(doctor);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

module.exports.getDoctors = async (req, res, next) => {
    try {
        const doctors = await doctorService.getDoctors();
        res.status(200).json(doctors);
    } catch (error) {
        next(error);
    }
};

module.exports.getDoctorById = async (req, res, next) => {
    try {
        const doctor = await doctorService.getDoctorById(req.params.id);
        if (!doctor) {
            return res.status(404).json({ message: 'Doctor not found' });
        }
        res.status(200).json(doctor);
    } catch (error) {
        next(error);
    }
};

module.exports.updateDoctor = async (req, res, next) => {
    try {
        const doctor = await doctorService.updateDoctor(req.params.id, req.body);
        if (!doctor) {
            return res.status(404).json({ message: 'Doctor not found' });
        }
        res.status(200).json(doctor);
    } catch (error) {
        next(error);
    }
};

module.exports.deleteDoctor = async (req, res, next) => {
    try {
        const doctor = await doctorService.deleteDoctor(req.params.id);
        if (!doctor) {
            return res.status(404).json({ message: 'Doctor not found' });
        }
        res.status(200).json({ message: 'Doctor deleted successfully' });
    } catch (error) {
        next(error);
    }
};