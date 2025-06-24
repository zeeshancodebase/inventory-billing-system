const mongoose = require('mongoose');

const invoiceSchema = new mongoose.Schema({
    saleId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Sale',
        required: true,
    },
    invoiceId: {
        type: String,
        required: true,
        unique: true,
    },
    amountDue: {
        type: Number,
        required: true,
    },
    paymentMethod: {
        type: String,
        required: true,
        enum: ['cash', 'UPI'],
    },
    amountReceived: {
        type: Number,
        required: true,
    },
    status: {
        type: String,
        required: true,
        enum: ['Paid', 'Pending'],
    },

}, {
    timestamps: true
})

module.exports = mongoose.model('Invoice', invoiceSchema);
