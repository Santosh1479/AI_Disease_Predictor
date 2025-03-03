
const mongoose = require('mongoose');

function connecttoDB() {
    mongoose.connect("mongodb://localhost:27017/",
    ).then(() => {
        console.log("connec db done")
    }).catch(err => console.log(err));
}

module.exports = connecttoDB;