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

    // Extract the required fields from the authenticated doctor's profile
    const doctorProfile = {
      id: req.user._id,
      firstname: req.user.fullname.firstname,
      lastname: req.user.fullname.lastname,
      email: req.user.email,
      mobileNumber: req.user.mobileNumber,
      hospital: req.user.hospital,
      specialisation: req.user.specialisation,
    };

    res.status(200).json(doctorProfile); // Return the doctor's profile
  } catch (error) {
    console.error('Error fetching doctor profile:', error);
    res.status(500).json({ message: 'Failed to fetch doctor profile' });
  }
};

module.exports.getDoctorProfileById = async (req, res) => {
  try {
    const doctorId = req.params.id;

    // Fetch doctor details by ID
    const doctor = await doctorService.getDoctorById(doctorId);
    if (!doctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }

    // Extract the required fields
    const doctorProfile = {
      id: doctor._id,
      firstname: doctor.fullname.firstname,
      lastname: doctor.fullname.lastname,
      email: doctor.email,
      mobileNumber: doctor.mobileNumber,
      hospital: doctor.hospital,
      specialisation: doctor.specialisation,
    };

    res.status(200).json(doctorProfile); // Return the doctor's profile
  } catch (error) {
    console.error("Error fetching doctor profile by ID:", error);
    res.status(500).json({ message: "Failed to fetch doctor profile" });
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