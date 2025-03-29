const doctorModel = require('../models/doctor.model.js');


module.exports.createDoctor = async (doctorData) => {
  const existingDoctor = await doctorModel.findOne({ email: doctorData.email });
  if (existingDoctor) {
    throw new Error('Doctor with this email already exists');
  }

  const doctor = new doctorModel(doctorData);
  await doctor.save();
  return doctor;
};


module.exports.loginDoctor = async (email, password) => {
  const doctor = await doctorModel.findOne({ email }).select('+password');
  if (!doctor) {
    throw new Error('Invalid email or password');
  }

  const isMatch = await doctor.comparePassword(password);
  if (!isMatch) {
    throw new Error('Invalid email or password');
  }

  return doctor;
};

module.exports.getDoctorById = async (doctorId) => {
  const doctor = await doctorModel.findById(doctorId);
  if (!doctor) {
    throw new Error('Doctor not found');
  }
  return doctor;
};

module.exports.getAllDoctors = async () => {
  const doctors = await doctorModel.find();
  return doctors;
};