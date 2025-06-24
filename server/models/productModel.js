const mongoose = require('mongoose');

// Function to generate a prodId ID based on product attributes
function generateProdId(product) {
    let id = 'RT';

    if (product.category) id += product.category[0].toUpperCase();
    if (product.type) id += product.type[0].toUpperCase();
    if (product.color) id += product.color[0].toUpperCase();

    const rand = Math.floor(1000 + Math.random() * 9000); // Always 4-digit number
    id += rand;

    return id;
}


const productSchema = new mongoose.Schema({
    prodId: { type: String, unique: true, trim: true },
    prodType: {
        type: String,
        required: true,
        enum: ['roll', 'box'],
        trim: true,
    },
    prodName: {
        type: String,
        trim: true,
    },
    category: {
        type: String,
        trim: true,
    },
    sku: {
        type: String,
        unique: true,
        trim: true,
    },
    quantity: {
        type: Number,
        required: true,
        min: 0,
    },
    costPrice: {
        type: Number,
        required: true,
        min: [1, 'Cost price must be greater than 1'],
    },
    sellingPrice: {
        type: Number,
        required: true,
        min: [1, 'Cost price must be greater than 1'],
    },
    lengthPerRoll: {
        type: Number,
        trim: true,
    },
    totalLength: {
        type: Number,
        trim: true,
    },
    type: {
        type: String,
        trim: true,
    },
    color: {
        type: String,
        trim: true,
    },
    image: {
        type: String,
        trim: true,
    },
    minimumStock: { type: Number, default: 10 }
}, {
    timestamps: true,
});

productSchema.pre('save', function (next) {
    if (!this.prodId) {
        this.prodId = generateProdId(this);
    }
    next();
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;