// filepath: c:\Users\Santosh\Desktop\AI_Disease_Predictor\Backend\services\doctor.service.js
const doctorModel = require('../models/doctor.model');
const bcrypt = require('bcrypt');

module.exports.loginDoctor = async (email, password) => {
  const doctor = await doctorModel.findOne({ email });
  if (!doctor) {
    throw new Error('Invalid email or password');
  }

  const isMatch = await bcrypt.compare(password, doctor.password);
  if (!isMatch) {
    throw new Error('Invalid email or password');
  }

  return doctor;
};

module.exports.getDoctorById = async (id) => {
  return await doctorModel.findById(id);
};