const hospitalModel = require('../models/hospital.model');

module.exports.createHospital = async ({ id, name, customerCare, email, specialisations, latitude, longitude }) => {
    if (!id || !name || !customerCare || !email || !specialisations || latitude === undefined || longitude === undefined) {
        throw new Error('All fields are required');
    }

    const hospital = await hospitalModel.create({
        _id: id,
        name,
        customerCare,
        email,
        specialisations,
        latitude,
        longitude
    });

    return hospital;
};

module.exports.getHospitals = async () => {
    return await hospitalModel.find();
};

module.exports.getHospitalById = async (id) => {
    return await hospitalModel.findById(id);
};

module.exports.updateHospital = async (id, updateData) => {
    return await hospitalModel.findByIdAndUpdate(id, updateData, { new: true });
};

module.exports.deleteHospital = async (id) => {
    return await hospitalModel.findByIdAndDelete(id);
};