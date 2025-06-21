const mongoose = require('mongoose');
const urlSchema = new mongoose.Schema({
    shortenUrl:{
        type: String,
        required: true,
    },
    fullUrl: {
        type: String,
        required: true
    },
    clicks: {
        type: Number,
        default: 0
    },
    userId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    isDeleted: {
        type: Boolean,
        default: false
    }
});

const Url = mongoose.model('Url', urlSchema);
module.exports = Url;