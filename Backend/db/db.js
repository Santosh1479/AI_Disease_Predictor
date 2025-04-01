const dotenv = require('dotenv');
const mongoose = require('mongoose');

function connecttoDB() {
    mongoose.connect(`${process.env.MONGO_URI}/AI_Disease_Prediction`, {
    }).then(() => {
        console.log("Connected to MongoDB");
    }).catch(err => {
        console.error("Error connecting to MongoDB:", err);
    });
}

module.exports = connecttoDB;