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

  const hashedPassword = await userModel.hashPassword(password);

  const user = await userModel.create({
    fullname: {
      firstname,
      lastname,
    },
    email,
    password: hashedPassword,
    mobileNumber,
  });

  return user;
};

module.exports.loginUser = async (email, password) => {
  const user = await userModel.findOne({ email }).select('+password');
  if (!user) {
    throw new Error('Invalid email or password');
  }

  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    throw new Error('Invalid email or password');
  }

  return user;
};

module.exports.getUserById = async (userId) => {
  const user = await userModel.findById(userId);
  if (!user) {
    throw new Error('User not found');
  }
  return user;
};