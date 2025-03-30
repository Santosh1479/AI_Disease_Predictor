const doctorService = require('../services/doctor.service');
const { validationResult } = require('express-validator');
const mongoose = require('mongoose');


module.exports.createDoctor = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { firstname, lastname, email, password, mobileNumber, hospital, specialisation } = req.body;

    // Validate hospital as a number
    if (isNaN(hospital)) {
      return res.status(400).json({ message: 'Invalid hospital ID. It must be a number.' });
    }

    // Construct fullname
    const fullname = { firstname, lastname };

    // Pass the constructed fullname along with other data
    const doctor = await doctorService.createDoctor({
      fullname,
      email,
      password,
      mobileNumber,
      hospital: Number(hospital), // Ensure hospital is a number
      specialisation,
    });

    res.status(201).json({ message: 'Doctor created successfully', doctor });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports.loginDoctor = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, password } = req.body;

  try {
    const doctor = await doctorService.loginDoctor(email, password);
    const token = doctor.generateAuthToken();
    res.status(200).json({ token, doctor });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports.getProfile = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(400).json({ message: 'Doctor not authenticated' });
    }

    res.status(200).json(req.user); // Return the authenticated doctor's profile
  } catch (error) {
    console.error('Error fetching doctor profile:', error);
    res.status(500).json({ message: 'Failed to fetch doctor profile' });
  }
};

module.exports.getDoctorById = async (req, res) => {
  try {
    const doctor = await doctorService.getDoctorById(req.params.doctorId);
    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }
    res.status(200).json(doctor);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports.getAllDoctors = async (req, res) => {
  try {
    const doctors = await doctorService.getAllDoctors();
    res.status(200).json(doctors);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports.logoutDoctor = (req, res) => {
  res.clearCookie('token');
  res.status(200).json({ message: 'Logged out successfully' });
};