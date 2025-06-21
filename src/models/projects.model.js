const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true,
    },
    description:{
        type: String,
        required: true,
    },
    thumbnail:{
        type: String,
        required: true,
    },
    demoLink:{
        type: String
    },
    sourceCodeLink:{
        type: String
    },
    isDeleted:{
        type: Boolean,
        default: false
    }   
});

module.exports = mongoose.model('Project', projectSchema);