const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema({
    
    customerMobile: {
        type: String,
        required: true,
        trim: true
    },
    customerEmail: {
        type: String
    },
    customerName: {
        type: String,
        required: true,
        trim: true
    },
    customerAddress: {
        type: String,
        required: true,
        trim: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Customer', customerSchema);