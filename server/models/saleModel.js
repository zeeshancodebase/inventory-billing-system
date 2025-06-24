const mongoose = require('mongoose');

const CartItemSchema = new mongoose.Schema({
  prodId: {
    type: String,
    ref: 'Product',
    required: true
  },
  prodName: { type: String },
  prodType: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    min: 0.1
  },
  sellingPrice: {
    type: Number,
    required: true,
    min: 0
  },
  costPrice: {
    type: Number,
    required: true
  },
  totalPrice: {
    type: Number,
    required: true,
    min: 0
  }
});


const saleSchema = new mongoose.Schema({
  invoiceId: {
    type: String,
    required: true,
    unique: true,
  },
  salesManId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  customerMobile: { type: String },
  customerName: { type: String },
  customerAddress: { type: String },
  cart: {
    type: [CartItemSchema],
    required: true,
    validate: [arr => arr.length > 0, 'Cart must have at least one item']
  },
  grandTotal: {
    type: Number,
    required: true,
  },
  discount: {
    type: Number,
    required: true,
  },
  amountReceived: {
    type: Number,
    required: true,
  },
  subTotal: { type: Number, required: true },
  totalCost: { type: Number, required: true },
  profit: { type: Number, required: true },
  totalItems: { type: Number, required: true },
  paymentMethod: {
    type: String,
    required: true,
    enum: ['Cash', 'UPI'],
  },
  status: {
    type: String,
    enum: ["completed", "cancelled"],
    default: "completed"
  },
  isReturn: {
    type: Boolean,
    default: false
  },
  returnOf: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Sale'
  },
  cancelledAt: Date,
  cancelledBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  }

}, { timestamps: true });

module.exports = mongoose.model('Sale', saleSchema);
