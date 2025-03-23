const doctorService = require('../services/doctor.service');
const { validationResult } = require('express-validator');

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
    const doctor = await doctorService.getDoctorById(req.doctor._id);
    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }
    res.status(200).json(doctor);
  } catch (error) {
    res.status(500).json({ message: error.message });
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