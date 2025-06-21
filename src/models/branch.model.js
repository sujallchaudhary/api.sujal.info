const mongoose = require('mongoose');

const branchSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true,
    },
    shortName:{
        type: String,
        required: true,
    },
});

module.exports = mongoose.model('Branch', branchSchema);