const doctorModel = require('../models/doctor.model');
const hospitalModel = require('../models/hospital.model');

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

    const doctor = await doctorModel.create({
        fullname: {
            firstname,
            lastname
        },
        email,
        mobileNumber,
        password,
        hospital,
        specialisation
    });

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