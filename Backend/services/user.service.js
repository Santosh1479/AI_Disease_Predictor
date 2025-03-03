// user.service.js
const userModel = require('../models/user.models');

module.exports.createUser = async ({ firstname, lastname, email, password, mobileNumber }) => {
  if (!firstname || !email || !password || !mobileNumber) {
    throw new Error('All fields are required');
  }

  // Check if the email already exists
  const existingUser = await userModel.findOne({ email });
  if (existingUser) {
    throw new Error('Email already exists');
  }

  const user = await userModel.create({
    fullname: {
      firstname,
      lastname,
    },
    email,
    password,
    mobileNumber,
  });

  return user;
};