const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

const doctorSchema = new mongoose.Schema({
  fullname: {
    firstname: {
      type: String,
      required: true,
    },
    lastname: {
      type: String,
      required: true,
    },
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  mobileNumber: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  hospital: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Hospital',
    required: true,
  },
  specialisation: {
    type: String,
    required: true,
  },
});

doctorSchema.methods.generateAuthToken = function () {
  const token = jwt.sign({ _id: this._id, email: this.email }, process.env.JWT_SECRET, {
    expiresIn: '1h',
  });
  return token;
};

const Doctor = mongoose.model('Doctor', doctorSchema);

module.exports = Doctor;