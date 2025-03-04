const mongoose = require('mongoose');

const hospitalSchema = new mongoose.Schema({
    _id: {
        type: Number,
        required: true,
        validate: {
            validator: function(v) {
                return v >= 1000;
            },
            message: props => `${props.value} is not a valid hospital ID! Hospital ID must be at least 4 digits.`
        }
    },
    name: {
        type: String,
        required: true,
        minlength: [3, "Hospital name must be longer"]
    },
    customerCare: {
        type: String,
        required: true,
        minlength: [10, "Customer care number must be longer"]
    },
    email: {
        type: String,
        required: true,
        validate: {
            validator: function(v) {
                return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
            },
            message: props => `${props.value} is not a valid email!`
        }
    },
    specialisations: {
        type: [String],
        required: true
    },
    latitude: {
        type: Number,
        required: true
    },
    longitude: {
        type: Number,
        required: true
    }
});

const hospitalModel = mongoose.model('Hospital', hospitalSchema);

module.exports = hospitalModel;