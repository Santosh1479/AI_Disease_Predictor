const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
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
    select: false,
  },
  hospital: {
    type: Number,
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
    expiresIn: '24h',
  });
  return token;
};

doctorSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

doctorSchema.statics.hashPassword = async function (password) {
  return await bcrypt.hash(password, 10);
};

const Doctor = mongoose.model('Doctor', doctorSchema);

module.exports = Doctor;