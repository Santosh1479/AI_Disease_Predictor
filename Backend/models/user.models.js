// user.models.js
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema({
  fullname: {
    firstname: {
      type: String,
      required: true,
      minlength: [3, "First name must be longer"],
    },
    lastname: {
      type: String,
      required: true,
      minlength: [3, "Last name must be longer"],
    },
  },
  email: {
    type: String,
    required: true,
    unique: true,
    minlength: [3, "Enter a valid email"],
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
  mobileNumber: {
    type: String,
    required: true,
    minlength: [10, "Mobile number must be longer"],
  },
  socketId: {
    type: String,
  },
  isOnline: {
  type: Boolean,
  default: false,
},
});

userSchema.methods.generateAuthToken = function () {
  const token = jwt.sign({ _id: this._id }, process.env.JWT_SECRET, {
    expiresIn: "24h",
  });
  return token;
};

userSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

userSchema.statics.hashPassword = async function (password) {
  return await bcrypt.hash(password, 10);
};

const userModel = mongoose.model("user", userSchema);

module.exports = userModel;