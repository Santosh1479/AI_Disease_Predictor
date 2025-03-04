const doctorModel = require('../models/doctor.model');
const hospitalModel = require('../models/hospital.model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

module.exports.createDoctor = async ({ firstname, lastname, email, mobileNumber, password, hospital, specialisation }) => {
    if (!firstname || !lastname || !email || !mobileNumber || !password || !hospital || !specialisation) {
        throw new Error('All fields are required');
    }

    // Check if the hospital exists
    const hospitalRecord = await hospitalModel.findById(hospital);
    if (!hospitalRecord) {
        throw new Error('Hospital not found');
    }

    // Check if the specialisation is valid
    if (!hospitalRecord.specialisations.includes(specialisation)) {
        throw new Error('Specialisation not available in the selected hospital');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const doctor = await doctorModel.create({
        fullname: {
            firstname,
            lastname
        },
        email,
        mobileNumber,
        password: hashedPassword,
        hospital: hospital,
        specialisation
    });

    return doctor;
};

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

module.exports.getDoctors = async () => {
    return await doctorModel.find().populate('hospital');
};

module.exports.getDoctorById = async (id) => {
    return await doctorModel.findById(id).populate('hospital');
};

module.exports.updateDoctor = async (id, updateData) => {
    return await doctorModel.findByIdAndUpdate(id, updateData, { new: true });
};

module.exports.deleteDoctor = async (id) => {
    return await doctorModel.findByIdAndDelete(id);
};