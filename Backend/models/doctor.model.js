const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

const doctorSchema = new mongoose.Schema({
    fullname: {
        firstname: {
            type: String,
            required: true,
            minlength: [3, "First name must be longer"]
        },
        lastname: {
            type: String,
            required: true,
            minlength: [3, "Last name must be longer"]
        }
    },
    email: {
        type: String,
        required: true,
        unique: true,
        minlength: [5, "Enter a correct email"]
    },
    mobileNumber: {
        type: String,
        required: true,
        minlength: [10, "Mobile number must be longer"]
    },
    password: {
        type: String,
        required: true,
        minlength: [6, "Password must be longer"]
    },
    hospital: {
        type: Number,
        required: true
    },
    specialisation: {
        type: String,
        required: true
    }
});

doctorSchema.methods.generateAuthToken = function () {
    const token = jwt.sign({ _id: this._id, email: this.email }, process.env.JWT_SECRET, { expiresIn: '1h' });
    return token;
};

const doctorModel = mongoose.model('Doctor', doctorSchema);

module.exports = doctorModel;