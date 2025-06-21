const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true,
    },
    email:{
        type: String,
    },
    fatherName:{
        type: String,
    },
    branch:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Branch',
        required: true,
    },
    rollNo:{
        type: String,
        required: true,
    },
    section:{
        type: String,
        required: true,
    },
    year:{
        type: String,
        required: true,
    },
});

module.exports = mongoose.model('Student', studentSchema);