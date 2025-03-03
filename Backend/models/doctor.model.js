const mongoose = require('mongoose');

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
        type: Number, // Change this to a number
        ref: 'Hospital',
        required: true
    },
    specialisation: {
        type: String,
        required: true
    }
});

const doctorModel = mongoose.model('Doctor', doctorSchema);

module.exports = doctorModel;